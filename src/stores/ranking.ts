import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { TColumnsValue, TRowSpacingValue } from './configuration.types';
import type { IRankingLine, IWeeklyRanking } from './ranking.types';

const initialState = {
  columnsOption: 'complete' as TColumnsValue,
  rowSpacing: 'small' as TRowSpacingValue,
};

export const useRankingStore = defineStore('ranking', () => {
  const isLoadingWeek = ref(false);
  const isLoadingSeason = ref(false);
  const errorWeek = ref<Error | null>(null);
  const errorSeason = ref<Error | null>(null);
  const seasonRanking = ref<IRankingLine[]>([]);
  const weeksRanking = ref<IWeeklyRanking[]>([]);
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
    seasonRanking.value = newSeasonRanking;
  }

  function setWeeks(newWeeksRanking: IWeeklyRanking[]) {
    weeksRanking.value = newWeeksRanking;
  }

  function setLoadingWeek(loadingState: boolean) {
    isLoadingWeek.value = loadingState;
  }

  function setLoadingSeason(loadingState: boolean) {
    isLoadingSeason.value = loadingState;
  }

  function setErrorWeek(newError: Error | null) {
    errorWeek.value = newError;
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
    errorSeason,
    errorWeek,
    isLoadingSeason,
    isLoadingWeek,
    rowSpacing,
    seasonRanking,
    setColumnsOption,
    setErrorSeason,
    setErrorWeek,
    setInitialState,
    setLoadingSeason,
    setLoadingWeek,
    setRowSpacing,
    setSeason,
    setWeeks,
    weeksRanking,
  };
});
