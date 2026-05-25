import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { IStadium } from './matches.types';

export const useStadiumsStore = defineStore('stadiums', () => {
  const stadiums = ref<IStadium[]>([]);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  function setLoading(loadingState: boolean) {
    isLoading.value = loadingState;
  }

  function setStadiums(newStadiums: IStadium[]) {
    stadiums.value = newStadiums;
    isLoading.value = false;
  }

  function setError(newError: Error | null) {
    error.value = newError;
  }

  return {
    error,
    isLoading,
    setError,
    setLoading,
    setStadiums,
    stadiums,
  };
});
