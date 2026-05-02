import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { IMatch } from './matches.types';

export const useMatchesStore = defineStore('matches', () => {
  const isLoading = ref<boolean>(false);
  const updatingMatches = ref<number[]>([]); // Array to track which matches are currently being updated
  const matches = ref<IMatch[]>([]);
  const error = ref<Error | null>(null);

  function resetLoggedUserBets() {
    matches.value.forEach((match) => {
      match.loggedUserBets = null;
    });
  }

  function setMatches(newMatches: IMatch[]) {
    matches.value = newMatches;
  }

  function updateLoggedUserBets(matchId: number, bet: { scoreAway: null | number; scoreHome: null | number; }) {
    const match = matches.value.find((m) => m.id === matchId);
    if (match && match.loggedUserBets) {
      match.loggedUserBets = {...match.loggedUserBets, ...bet};
    }
  }

  // function updateMatches(updatedMatches: IMatch[]) {
  //   updatedMatches.forEach((updatedMatch) => {
  //     const index = matches.value.findIndex((m) => m.id === updatedMatch.id);
  //     if (index !== -1) {
  //       matches.value[index].away.possession = updatedMatch.away.possession;
  //       matches.value[index].away.score = updatedMatch.away.score;
  //       matches.value[index].home.possession = updatedMatch.home.possession;
  //       matches.value[index].home.score = updatedMatch.home.score;
  //       matches.value[index].status = updatedMatch.status;
  //       matches.value[index].overUnder = updatedMatch.overUnder;
  //       matches.value[index].homeTeamOdds = updatedMatch.homeTeamOdds;
  //       matches.value[index].bets = updatedMatch.bets;
  //     }
  //   });
  // }

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

  return { error, isLoading, matches, resetLoggedUserBets, setError, setLoading, setMatches, setUpdatingMatch, updateLoggedUserBets, updatingMatches };
});
