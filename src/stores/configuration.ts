import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { TRankingPositionValue, TGamesViewValue, TThemeValue } from './configuration.types';

const initialState = {
  rankingPosition: 'active' as TRankingPositionValue,
  gamesView: 'grid' as TGamesViewValue,
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
  const gamesView = ref<TGamesViewValue>(initialState.gamesView);
  const rankingPosition = ref<TRankingPositionValue>(initialState.rankingPosition);

  function setInitialState() {
    theme.value = initialState.theme;
    gamesView.value = initialState.gamesView;
    rankingPosition.value = initialState.rankingPosition;
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
    console.log('Setting theme to', newTheme);
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
    rankingPosition.value = newValue;
    localStorage.setItem('ranking-position', newValue);
  }

  function setGamesView(view: TGamesViewValue) {
    gamesView.value = view;
    localStorage.setItem('results-view', view);
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

  return {
    currentEdition,
    currentRound,
    editionStart,
    error,
    isDarkMode,
    isLoading,
    rankingPosition,
    gamesView,
    selectedRound,
    setCurrentEdition,
    setCurrentRound,
    setEditionStart,
    setError,
    setInitialState,
    setLoading,
    setRankingPosition,
    setGamesView,
    setSelectedRound,
    setTheme,
    theme,
  };
});
