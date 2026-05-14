import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { IUser } from './activeProfile.types';

export const useAdminStore = defineStore('admin', () => {
  const isLoading = ref(false);
  const error = ref<Error | null>(null);
  const users = ref<IUser[]>([]);

  function setLoading(loadingState: boolean) {
    isLoading.value = loadingState;
  }

  function setError(newError: Error | null) {
    error.value = newError;
  }

  function setUsers(newUsers: IUser[]) {
    users.value = newUsers;
  }

  return {
    error,
    isLoading,
    setError,
    setLoading,
    setUsers,
    users,
  };
});
