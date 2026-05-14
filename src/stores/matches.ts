import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { IBet, IMatch } from './matches.types';

import { useActiveProfileStore } from './activeProfile';

interface IWorkingBet {
  scoreAway: null | number;
  scoreHome: null | number;
}

export const useMatchesStore = defineStore('matches', () => {
  const isLoading = ref<boolean>(false);
  const updatingMatches = ref<number[]>([]); // Array to track which matches are currently being updated
  const matches = ref<IMatch[]>([]);
  const error = ref<Error | null>(null);

  // Working bets state for tracking unsaved changes
  const workingBets = ref<Map<number, IWorkingBet>>(new Map());
  const originalBets = ref<IBet[]>([]);

  // Save trigger for keyboard shortcuts
  const saveTrigger = ref<number>(0);

  function resetLoggedUserBets() {
    matches.value.forEach((match) => {
      match.loggedUserBets = null;
    });
    workingBets.value.clear();
    originalBets.value = [];
  }

  function setMatches(newMatches: IMatch[]) {
    matches.value = newMatches;
    initializeBets(newMatches);
  }

  function initializeBets(matches: IMatch[]) {
    // Store original bets (filter out null and undefined)
    originalBets.value = matches.map((match) => match.loggedUserBets as IBet);

    // Initialize working bets from original
    workingBets.value.clear();
    originalBets.value.forEach((bet) => {
      if (bet && bet.matchId != null) {
        workingBets.value.set(bet.matchId, {
          scoreAway: bet.scoreAway,
          scoreHome: bet.scoreHome,
        });
      }
    });
  }

  function updateLoggedUserBets(matchId: number, bet: { scoreAway: null | number; scoreHome: null | number }) {
    const match = matches.value.find((m) => m.id === matchId);
    if (match) {
      if (match.loggedUserBets) {
        // Update existing bet
        match.loggedUserBets = {
          ...match.loggedUserBets,
          ...bet,
        };
      } else {
        // Create new bet if it doesn't exist
        const activeProfileStore = useActiveProfileStore();
        const currentUser = activeProfileStore.activeProfile;

        if (currentUser) {
          match.loggedUserBets = {
            id: 0, // Temporary ID
            matchId,
            scoreAway: bet.scoreAway,
            scoreHome: bet.scoreHome,
            timestamp: new Date().toISOString(),
            user: {
              id: currentUser.id,
              nickname: currentUser.nickname,
            },
          };
        }
      }
    }
  }

  function updateWorkingBet(matchId: number, scoreHome: null | number, scoreAway: null | number) {
    workingBets.value.set(matchId, { scoreAway, scoreHome });
  }

  function getWorkingBet(matchId: number): IWorkingBet {
    return workingBets.value.get(matchId) || { scoreAway: null, scoreHome: null };
  }

  function hasWorkingBetChanged(matchId: number): boolean {
    const working = workingBets.value.get(matchId);
    const original = originalBets.value.find((b) => b?.matchId === matchId);

    if (!working) {
      return false;
    }

    if (working && !original) {
      // New bet - only changed if at least one score is set
      return working.scoreHome !== null || working.scoreAway !== null;
    }

    // Modified bet
    return original!.scoreHome !== working!.scoreHome || original!.scoreAway !== working!.scoreAway;
  }

  function getChangedBets(): Array<{ matchId: number; scoreAway: null | number; scoreHome: null | number }> {
    const changes: Array<{ matchId: number; scoreAway: null | number; scoreHome: null | number }> = [];

    workingBets.value.forEach((working, matchId) => {
      if (hasWorkingBetChanged(matchId)) {
        changes.push({ matchId, scoreAway: working.scoreAway, scoreHome: working.scoreHome });
      }
    });

    return changes;
  }

  function hasAnyChanges(): boolean {
    return getChangedBets().length > 0;
  }

  function commitWorkingBets() {
    const activeProfileStore = useActiveProfileStore();
    const currentUser = activeProfileStore.activeProfile;

    // Update original bets to match working bets
    workingBets.value.forEach((working, matchId) => {
      if (working.scoreAway === null || working.scoreHome === null) {
        // If either score is null, do not save this bet
        return;
      }

      const originalIndex = originalBets.value.findIndex((b) => b?.matchId === matchId);

      if (originalIndex !== -1) {
        originalBets.value[originalIndex].scoreHome = working.scoreHome;
        originalBets.value[originalIndex].scoreAway = working.scoreAway;
      } else {
        // New bet - create the entire bet object
        const match = matches.value.find((m) => m.id === matchId);
        if (match && currentUser) {
          const newBet: IBet = {
            id: 0, // Temporary ID, will be replaced by server response
            matchId,
            scoreAway: working.scoreAway,
            scoreHome: working.scoreHome,
            timestamp: new Date().toISOString(),
            user: {
              id: currentUser.id,
              nickname: currentUser.nickname,
            },
          };

          // Add to original bets array
          originalBets.value.push(newBet);

          // Create loggedUserBets on the match if it doesn't exist
          if (!match.loggedUserBets) {
            match.loggedUserBets = newBet;
          }
        }
      }
    });

    // Also update the matches' loggedUserBets
    matches.value.forEach((match) => {
      const working = workingBets.value.get(match.id);
      if (working?.scoreAway === null || working?.scoreHome === null) {
        // If either score is null, do not save this bet
        return;
      }

      if (working) {
        if (match.loggedUserBets) {
          // Update existing bet
          match.loggedUserBets.scoreHome = working.scoreHome;
          match.loggedUserBets.scoreAway = working.scoreAway;
        } else if (currentUser) {
          // Create new bet object
          match.loggedUserBets = {
            id: 0, // Temporary ID
            matchId: match.id,
            scoreAway: working.scoreAway,
            scoreHome: working.scoreHome,
            timestamp: new Date().toISOString(),
            user: {
              id: currentUser.id,
              nickname: currentUser.nickname,
            },
          };
        }
      }
    });
  }

  function resetWorkingBets() {
    // Reset working bets to original state
    workingBets.value.clear();
    originalBets.value.forEach((bet) => {
      if (bet && bet.matchId != null) {
        workingBets.value.set(bet.matchId, {
          scoreAway: bet.scoreAway,
          scoreHome: bet.scoreHome,
        });
      }
    });
  }

  function setUpdatingMatch(loadingState: boolean, matchId: null | number) {
    if (loadingState && matchId !== null) {
      updatingMatches.value.push(matchId);
    } else if (!loadingState && matchId !== null) {
      const index = updatingMatches.value.indexOf(matchId);
      if (index !== -1) {
        updatingMatches.value.splice(index, 1);
      }
    }
  }

  function setLoading(loadingState: boolean) {
    isLoading.value = loadingState;
  }

  function setError(newError: Error | null) {
    error.value = newError;
  }

  function requestSave() {
    saveTrigger.value++;
  }

  return {
    commitWorkingBets,
    error,
    getChangedBets,
    getWorkingBet,
    hasAnyChanges,
    hasWorkingBetChanged,
    isLoading,
    matches,
    originalBets,
    requestSave,
    resetLoggedUserBets,
    resetWorkingBets,
    saveTrigger,
    setError,
    setLoading,
    setMatches,
    setUpdatingMatch,
    updateLoggedUserBets,
    updateWorkingBet,
    updatingMatches,
    workingBets,
  };
});
