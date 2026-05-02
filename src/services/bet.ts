import { useActiveProfileStore } from '@/stores/activeProfile';
import { useConfigurationStore } from '@/stores/configuration';
import { useMatchesStore } from '@/stores/matches';

import ApiService from './api_request';

export default class BetService {
  private activeProfileStore;
  private apiRequest;
  private configurationStore;
  private matchesStore;

  constructor() {
    this.apiRequest = new ApiService();
    this.matchesStore = useMatchesStore();
    this.configurationStore = useConfigurationStore();
    this.activeProfileStore = useActiveProfileStore();
  }

  public async placeBet(
    updateObj: { awayScore: null | number; homeScore: null | number, matchId: number, },
    callback?: (isSuccess: boolean, error?: Error) => void,
  ) {
    try {
      const activeProfile = this.activeProfileStore.activeProfile;
      if (!activeProfile) {
        throw new Error('No active profile');
      }

      this.matchesStore.setUpdatingMatch(true, updateObj.matchId as number);
      await this.apiRequest.post(`bet/update`, updateObj);

      this.matchesStore.setUpdatingMatch(false, updateObj.matchId);
      if (callback) {
        callback(true);
      }
    } catch (error: unknown) {
      this.matchesStore.setUpdatingMatch(false, updateObj.matchId);
      if (callback) {
        callback(false, error as Error);
      }
    }
  }
}
