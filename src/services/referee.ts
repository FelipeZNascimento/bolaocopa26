import type { IReferee } from '@/stores/matches.types';

import { useConfigurationStore } from '@/stores/configuration';
import { useRefereesStore } from '@/stores/referees';

import ApiService from './api_request';

export default class RefereeService {
  private apiRequest;
  private configurationStore;
  private refereesStore;

  constructor() {
    this.apiRequest = new ApiService();
    this.configurationStore = useConfigurationStore();
    this.refereesStore = useRefereesStore();
  }

  public async fetch(edition?: null | number) {
    if (this.refereesStore.referees.length > 0) return; // Avoid refetching if we already have referees loaded
    this.refereesStore.setLoading(true);

    // Season may be "0" so needs to be checked against null and undefined
    if (edition === undefined || edition === null) {
      edition = this.configurationStore.currentEdition;
    }

    try {
      const response = await this.apiRequest.get<IReferee[]>(`edition/referees/`);
      this.refereesStore.setReferees(response.filter((referee) => referee.isoCode !== 'UND')); // Filter out undefined referee
      this.refereesStore.setLoading(false);
      this.refereesStore.setError(null);
    } catch (error: unknown) {
      this.refereesStore.setLoading(false);
      console.error('[RefereeService.fetch]', error);
      this.refereesStore.setError(new Error(error instanceof Error ? error.message : String(error)));
    }
  }
}
