import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { TMatchListSorting, TRankingPositionValue, TThemeValue, TViewBetOptionValue } from './configuration.types';

const initialState = {
  matchListSorting: 'group' as TMatchListSorting,
  rankingPosition: 'active' as TRankingPositionValue,
  theme: 'dark' as TThemeValue,
  viewBetOption: 'viewBets' as TViewBetOptionValue,
};

export const useConfigurationStore = defineStore('configuration', () => {
  const currentEdition = ref<null | number>(null);
  const editionStart = ref<null | number>(null);
  const currentRound = ref<number>(1);
  const selectedRound = ref<number>(1);
  const isLoading = ref<boolean>(true);
  const error = ref<Error | null>(null);
  const theme = ref<TThemeValue>(initialState.theme);
  const language = ref<'en' | 'pt-BR'>('en');
  const matchListSorting = ref<TMatchListSorting>(initialState.matchListSorting);
  const rankingPosition = ref<TRankingPositionValue>(initialState.rankingPosition);
  const viewBetOption = ref<TViewBetOptionValue>(initialState.viewBetOption);

  function setInitialState() {
    theme.value = initialState.theme;
    rankingPosition.value = initialState.rankingPosition;
    matchListSorting.value = initialState.matchListSorting;
    viewBetOption.value = initialState.viewBetOption;
    localStorage.removeItem('ranking-columns');
    localStorage.removeItem('theme-preference');
    localStorage.removeItem('ranking-position');
    localStorage.removeItem('view-bet-option');
  }

  function setEditionStart(timestamp: number) {
    editionStart.value = timestamp;
    // editionStart.value = 1081204400; // Temporary hardcoded value for testing purposes
  }

  function setLanguage(locale: 'en' | 'pt-BR') {
    language.value = locale;
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
    rankingPosition.value = newValue;
    document.documentElement.setAttribute('ranking-position', newValue);
    localStorage.setItem('ranking-position', newValue);
  }

  function setCurrentEdition(edition: number) {
    currentEdition.value = edition;
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

  function setViewBetOption(newOption: TViewBetOptionValue) {
    console.log('Setting view bet option to:', newOption);
    viewBetOption.value = newOption;
    localStorage.setItem('view-bet-option', newOption);
  }

  return {
    currentEdition,
    currentRound,
    editionStart,
    error,
    isDarkMode,
    isLoading,
    language,
    matchListSorting,
    rankingPosition,
    selectedRound,
    setCurrentEdition,
    setCurrentRound,
    setEditionStart,
    setError,
    setInitialState,
    setLanguage,
    setLoading,
    setMatchListSorting,
    setRankingPosition,
    setSelectedRound,
    setTheme,
    setViewBetOption,
    theme,
    viewBetOption,
  };
});
