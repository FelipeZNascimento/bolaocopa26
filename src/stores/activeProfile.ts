import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { IUser } from './activeProfile.types';

export const useActiveProfileStore = defineStore('activeProfile', () => {
  const activeProfile = ref<IUser | null>(null);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  function setLoading(loadingState: boolean) {
    isLoading.value = loadingState;
  }

  function setActiveProfile(profile: IUser | null) {
    activeProfile.value = profile;
    isLoading.value = false;
  }

  function setError(newError: Error | null) {
    error.value = newError;
  }

  return { activeProfile, error, isLoading, setActiveProfile, setError, setLoading };
});
