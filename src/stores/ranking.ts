import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { TColumnsValue, TRowSpacingValue } from './configuration.types';
import type { IRankingLine, IRoundRanking } from './ranking.types';

const initialState = {
  columnsOption: 'complete' as TColumnsValue,
  rowSpacing: 'small' as TRowSpacingValue,
};

export const useRankingStore = defineStore('ranking', () => {
  const isLoadingRounds = ref(false);
  const isLoadingSeason = ref(false);
  const errorRounds = ref<Error | null>(null);
  const errorSeason = ref<Error | null>(null);
  const seasonRanking = ref<IRankingLine[]>([]);
  const roundsRanking = ref<IRoundRanking[]>([]);
  const columnsOption = ref<TColumnsValue>(initialState.columnsOption);
  const rowSpacing = ref<TRowSpacingValue>(initialState.rowSpacing);

  function setInitialState() {
    columnsOption.value = initialState.columnsOption;
    rowSpacing.value = initialState.rowSpacing;
    localStorage.removeItem('ranking-columns');
    localStorage.removeItem('ranking-spacing');
    localStorage.removeItem('ranking-position');
  }

  function setSeason(newSeasonRanking: IRankingLine[]) {
    seasonRanking.value = Array.isArray(newSeasonRanking) ? newSeasonRanking : [];
  }

  function setRounds(newRoundsRanking: IRoundRanking[]) {
    roundsRanking.value = Array.isArray(newRoundsRanking) ? newRoundsRanking : [];
  }

  function setLoadingRounds(loadingState: boolean) {
    isLoadingRounds.value = loadingState;
  }

  function setLoadingSeason(loadingState: boolean) {
    isLoadingSeason.value = loadingState;
  }

  function setErrorRounds(newError: Error | null) {
    errorRounds.value = newError;
  }

  function setErrorSeason(newError: Error | null) {
    errorSeason.value = newError;
  }

  function setColumnsOption(newValue: TColumnsValue) {
    columnsOption.value = newValue;
    localStorage.setItem('ranking-columns', newValue);
  }

  function setRowSpacing(newValue: TRowSpacingValue) {
    rowSpacing.value = newValue;
    localStorage.setItem('ranking-spacing', newValue);
  }

  return {
    columnsOption,
    errorRounds,
    errorSeason,
    isLoadingRounds,
    isLoadingSeason,
    roundsRanking,
    rowSpacing,
    seasonRanking,
    setColumnsOption,
    setErrorRounds,
    setErrorSeason,
    setInitialState,
    setLoadingRounds,
    setLoadingSeason,
    setRounds,
    setRowSpacing,
    setSeason,
  };
});
