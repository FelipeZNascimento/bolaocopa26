import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { IExtraBet, IExtraResults, IPlayerWithExtras, ITeamWithExtras, IUserWithExtras } from './extraBet.types';

export const useExtraBetStore = defineStore('extras', () => {
  const extraBets = ref<IExtraBet[]>([]);
  const extraBetsByTeam = ref<ITeamWithExtras[]>([]);
  const results = ref<IExtraResults[]>([]);
  const loggedUserBets = ref<IExtraBet[]>([]);
  const topScorerBetsByPlayer = ref<IPlayerWithExtras[]>([]);
  const extraBetsByUser = ref<IUserWithExtras[]>([]);

  const isUpdating = ref<boolean>(false);
  const isLoading = ref<boolean>(false);
  const error = ref<Error | null>(null);

  function setExtraBetsByTeam(newValue: ITeamWithExtras[]) {
    extraBetsByTeam.value = newValue;
  }

  function setTopScorerBetsByPlayer(newExtras: IPlayerWithExtras[]) {
    topScorerBetsByPlayer.value = newExtras;
  }

  function setExtraBetsByUser(newExtras: IUserWithExtras[]) {
    extraBetsByUser.value = newExtras;
  }

  function setLoggedUserBets(newExtras: IExtraBet[]) {
    loggedUserBets.value = newExtras;
  }

  function setResults(newExtras: IExtraResults[]) {
    results.value = newExtras;
  }

  function resetLoggedUserBets() {
    loggedUserBets.value = [];
  }

  function setExtraBets(newExtras: IExtraBet[]) {
    extraBets.value = newExtras;
  }

  function setUpdating(loadingState: boolean) {
    isUpdating.value = loadingState;
  }

  function setLoading(loadingState: boolean) {
    isLoading.value = loadingState;
  }

  function setError(newError: Error | null) {
    error.value = newError;
  }

  return {
    error,
    extraBets,
    extraBetsByTeam,
    extraBetsByUser,
    isLoading,
    isUpdating,
    loggedUserBets,
    resetLoggedUserBets,
    results,
    setError,
    setExtraBets,
    setExtraBetsByTeam,
    setExtraBetsByUser,
    setLoading,
    setLoggedUserBets,
    setResults,
    setTopScorerBetsByPlayer,
    setUpdating,
    topScorerBetsByPlayer,
  };
});
