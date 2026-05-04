import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { ITeam } from './teams.types';

export const useTeamsStore = defineStore('teams', () => {
  const teams = ref<ITeam[]>([]);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  function setLoading(loadingState: boolean) {
    isLoading.value = loadingState;
  }

  function setTeams(newTeams: ITeam[]) {
    teams.value = newTeams;
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
    setTeams,
    teams,
  };
});
