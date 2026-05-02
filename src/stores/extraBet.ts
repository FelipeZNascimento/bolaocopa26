import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { IExtraBet, IExtraResults, IPlayerWithExtras, ITeamWithExtras, IUserWithExtras } from './extraBet.types';

export const useExtraBetStore = defineStore('extraBet', () => {
  const extraBetsByTeam = ref<ITeamWithExtras[]>([]);
  const results = ref<IExtraResults[]>([]);
  const activeProfileBets = ref<IExtraBet[]>([]);
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

  function setActiveProfileBets(newExtras: IExtraBet[]) {
    activeProfileBets.value = newExtras;
  }

  function setResults(newExtras: IExtraResults[]) {
    results.value = newExtras;
  }

  function resetActiveProfileBets() {
    activeProfileBets.value = [];
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
    activeProfileBets,
    error,
    extraBetsByTeam,
    extraBetsByUser,
    isLoading,
    isUpdating,
    resetActiveProfileBets,
    results,
    setActiveProfileBets,
    setError,
    setExtraBetsByTeam,
    setExtraBetsByUser,
    setLoading,
    setResults,
    setTopScorerBetsByPlayer,
    setUpdating,
    topScorerBetsByPlayer,
  };
});
