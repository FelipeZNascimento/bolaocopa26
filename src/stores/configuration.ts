import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { TRankingPositionValue, TResultsViewValue, TThemeValue } from './configuration.types';

const initialState = {
  rankingPosition: 'active' as TRankingPositionValue,
  resultsView: 'grid' as TResultsViewValue,
  theme: 'dark' as TThemeValue,
};

export const useConfigurationStore = defineStore('configuration', () => {
  const currentSeason = ref<null | number>(null);
  const seasonStart = ref<null | number>(null);
  const currentWeek = ref<null | number>(null);
  const selectedWeek = ref<null | number>(null);
  const isLoading = ref<boolean>(true);
  const error = ref<Error | null>(null);
  const theme = ref<TThemeValue>(initialState.theme);
  const resultsView = ref<TResultsViewValue>(initialState.resultsView);
  const rankingPosition = ref<TRankingPositionValue>(initialState.rankingPosition);

  function setInitialState() {
    theme.value = initialState.theme;
    resultsView.value = initialState.resultsView;
    rankingPosition.value = initialState.rankingPosition;
    localStorage.removeItem('ranking-columns');
    localStorage.removeItem('theme-preference');
    localStorage.removeItem('ranking-position');
  }

  function setSeasonStart(timestamp: number) {
    seasonStart.value = timestamp;
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

  function setResultsView(view: TResultsViewValue) {
    resultsView.value = view;
    localStorage.setItem('results-view', view);
  }

  function setCurrentSeason(season: number) {
    currentSeason.value = season;
  }

  function setCurrentWeek(week: number) {
    currentWeek.value = week;
  }

  function setSelectedWeek(week: number) {
    selectedWeek.value = week;
  }

  function setLoading(loadingState: boolean) {
    isLoading.value = loadingState;
  }

  function setError(newError: Error | null) {
    error.value = newError;
  }

  return {
    currentSeason,
    currentWeek,
    error,
    isDarkMode,
    isLoading,
    rankingPosition,
    resultsView,
    seasonStart,
    selectedWeek,
    setCurrentSeason,
    setCurrentWeek,
    setError,
    setInitialState,
    setLoading,
    setRankingPosition,
    setResultsView,
    setSeasonStart,
    setSelectedWeek,
    setTheme,
    theme,
  };
});
