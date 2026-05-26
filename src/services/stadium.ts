import type { IStadium } from '@/stores/matches.types';

import { useConfigurationStore } from '@/stores/configuration';
import { useStadiumsStore } from '@/stores/stadiums';

import ApiService from './api_request';

export default class StadiumService {
  private apiRequest;
  private configurationStore;
  private stadiumsStore;

  constructor() {
    this.apiRequest = new ApiService();
    this.configurationStore = useConfigurationStore();
    this.stadiumsStore = useStadiumsStore();
  }

  public async fetch(edition?: null | number) {
    if (this.stadiumsStore.stadiums.length > 0) return; // Avoid refetching if we already have stadiums loaded
    this.stadiumsStore.setLoading(true);

    // Season may be "0" so needs to be checked against null and undefined
    if (edition === undefined || edition === null) {
      edition = this.configurationStore.currentEdition;
    }

    try {
      const response = await this.apiRequest.get<IStadium[]>(`edition/stadiums/`);
      this.stadiumsStore.setStadiums(response);
      this.stadiumsStore.setLoading(false);
      this.stadiumsStore.setError(null);
    } catch (error: unknown) {
      this.stadiumsStore.setLoading(false);
      console.error('[StadiumService.fetch]', error);
      this.stadiumsStore.setError(new Error(error instanceof Error ? error.message : String(error)));
    }
  }
}
