import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { TMatchListSorting, TRankingPositionValue, TThemeValue } from './configuration.types';

const initialState = {
  matchListSorting: 'group' as TMatchListSorting,
  rankingPosition: 'active' as TRankingPositionValue,
  theme: 'dark' as TThemeValue,
};

export const useConfigurationStore = defineStore('configuration', () => {
  const currentEdition = ref<null | number>(null);
  const editionStart = ref<null | number>(null);
  const currentRound = ref<null | number>(null);
  const selectedRound = ref<null | number>(null);
  const isLoading = ref<boolean>(true);
  const error = ref<Error | null>(null);
  const theme = ref<TThemeValue>(initialState.theme);
  const matchListSorting = ref<TMatchListSorting>(initialState.matchListSorting);
  const rankingPosition = ref<TRankingPositionValue>(initialState.rankingPosition);

  function setInitialState() {
    theme.value = initialState.theme;
    rankingPosition.value = initialState.rankingPosition;
    matchListSorting.value = initialState.matchListSorting;
    localStorage.removeItem('ranking-columns');
    localStorage.removeItem('theme-preference');
    localStorage.removeItem('ranking-position');
  }

  function setEditionStart(timestamp: number) {
    editionStart.value = timestamp;
  }

  function isDarkMode() {
    return theme.value === 'dark';
  }

  function setTheme(newTheme: TThemeValue) {
    theme.value = newTheme;
    document.documentElement.setAttribute('data-theme', newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.remove('dark-mode');
    } else {
      document.documentElement.classList.add('dark-mode');
    }
    localStorage.setItem('theme-preference', newTheme);
  }

  function setRankingPosition(newValue: TRankingPositionValue) {
    console.log('Setting ranking position to:', newValue);
    rankingPosition.value = newValue;
    document.documentElement.setAttribute('ranking-position', newValue);
    localStorage.setItem('ranking-position', newValue);
  }

  function setCurrentEdition(season: number) {
    currentEdition.value = season;
  }

  function setCurrentRound(week: number) {
    currentRound.value = week;
  }

  function setSelectedRound(week: number) {
    selectedRound.value = week;
  }

  function setLoading(loadingState: boolean) {
    isLoading.value = loadingState;
  }

  function setError(newError: Error | null) {
    error.value = newError;
  }

  function setMatchListSorting(newSorting: TMatchListSorting) {
    matchListSorting.value = newSorting;
    localStorage.setItem('match-list-sorting', newSorting);
  }

  return {
    currentEdition,
    currentRound,
    editionStart,
    error,
    isDarkMode,
    isLoading,
    matchListSorting,
    rankingPosition,
    selectedRound,
    setCurrentEdition,
    setCurrentRound,
    setEditionStart,
    setError,
    setInitialState,
    setLoading,
    setMatchListSorting,
    setRankingPosition,
    setSelectedRound,
    setTheme,
    theme,
  };
});
