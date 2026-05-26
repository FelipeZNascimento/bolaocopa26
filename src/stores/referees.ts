import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { IReferee } from './matches.types';

export const useRefereesStore = defineStore('referees', () => {
  const referees = ref<IReferee[]>([]);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  function setLoading(loadingState: boolean) {
    isLoading.value = loadingState;
  }

  function setReferees(newReferees: IReferee[]) {
    referees.value = newReferees;
    isLoading.value = false;
  }

  function setError(newError: Error | null) {
    error.value = newError;
  }

  return {
    error,
    isLoading,
    referees,
    setError,
    setLoading,
    setReferees,
  };
});
