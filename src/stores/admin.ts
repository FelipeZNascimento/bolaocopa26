import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { IUser } from './activeProfile.types';

export type TServerHealth = {
  db: string;
  pool: {
    allConnections: number;
    connectionLimit: number;
    freeConnections: number;
    queueLength: number;
  };
  status: string;
};

export const useAdminStore = defineStore('admin', () => {
  const isLoading = ref(false);
  const error = ref<Error | null>(null);
  const users = ref<IUser[]>([]);
  const serverHealth = ref<null | TServerHealth>(null);

  function setLoading(loadingState: boolean) {
    isLoading.value = loadingState;
  }

  function setError(newError: Error | null) {
    error.value = newError;
  }

  function setUsers(newUsers: IUser[]) {
    users.value = newUsers;
  }

  function setServerHealth(newServerHealth: TServerHealth) {
    serverHealth.value = newServerHealth;
  }

  return {
    error,
    isLoading,
    serverHealth,
    setError,
    setLoading,
    setServerHealth,
    setUsers,
    users,
  };
});
