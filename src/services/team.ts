import type { ITeam } from '@/stores/teams.types';

import { useConfigurationStore } from '@/stores/configuration';
import { useTeamsStore } from '@/stores/teams';

import ApiService from './api_request';

export default class TeamService {
  private apiRequest;
  private configurationStore;
  private teamsStore;

  constructor() {
    this.apiRequest = new ApiService();
    this.configurationStore = useConfigurationStore();
    this.teamsStore = useTeamsStore();
  }

  public async fetch(edition?: null | number) {
    this.teamsStore.setLoading(true);

    // Season may be "0" so needs to be checked against null and undefined
    if (edition === undefined || edition === null) {
      edition = this.configurationStore.currentEdition;
    }

    try {
      const response = await this.apiRequest.get<ITeam[]>(`team/all/${edition}`);
      this.teamsStore.setTeams(response);
      this.teamsStore.setLoading(false);
      this.teamsStore.setError(null);
    } catch (error: unknown) {
      this.teamsStore.setLoading(false);
      this.teamsStore.setError(new Error(error instanceof Error ? error.message : String(error)));
    }
  }
}
