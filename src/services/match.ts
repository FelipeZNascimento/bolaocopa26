import type { IMatch } from '@/stores/matches.types';

import { useConfigurationStore } from '@/stores/configuration';
import { useMatchesStore } from '@/stores/matches';

import ApiService from './api_request';
import RankingService from './ranking';
import WebsocketService, { WEBSOCKET_EVENTS } from './websocket';

export default class MatchService {
  public websocketInstance;
  private apiRequest;
  private configurationStore;
  private matchesStore;
  private rankingService;

  constructor() {
    this.apiRequest = new ApiService();
    this.configurationStore = useConfigurationStore();
    this.matchesStore = useMatchesStore();
    this.rankingService = new RankingService();
    this.websocketInstance = new WebsocketService(this.onWebsocketUpdate);
  }

  public async fetch(round?: null | number, edition?: null | number) {
    this.matchesStore.setLoading(true);
    // Week may be "0" so needs to be checked against null and undefined
    if (round === undefined || round === null) {
      round = this.configurationStore.selectedRound;
    }

    // Season may be "0" so needs to be checked against null and undefined
    if (edition === undefined || edition === null) {
      edition = this.configurationStore.currentEdition;
    }

    try {
      const response = await this.apiRequest.get<IMatch[]>(`match/${edition}/${round}`);
      this.matchesStore.setMatches(response);
      this.matchesStore.setLoading(false);
      this.matchesStore.setError(null);

      this.websocketInstance.connectIfNeeded();
    } catch (error: unknown) {
      this.matchesStore.setLoading(false);
      console.error('[MatchService.fetch]', error);
      this.matchesStore.setError(new Error(error instanceof Error ? error.message : String(error)));
    }
  }

  public async fetchNextMatches() {
    this.matchesStore.setLoading(true);
    try {
      const response = await this.apiRequest.get<IMatch[]>(`match/next-matches`);
      this.matchesStore.setNextMatches(response);
      this.matchesStore.setLoading(false);
      this.matchesStore.setError(null);
    } catch (error: unknown) {
      this.matchesStore.setLoading(false);
      console.error('[MatchService.fetchNextMatches]', error);
      this.matchesStore.setError(new Error(error instanceof Error ? error.message : String(error)));
    }
  }

  private async fetchSilent() {
    try {
      const round = this.configurationStore.selectedRound;
      const edition = this.configurationStore.currentEdition;
      const response = await this.apiRequest.get<IMatch[]>(`match/${edition}/${round}`);
      this.matchesStore.setMatches(response);
      this.matchesStore.setError(null);
    } catch (error: unknown) {
      console.error('[MatchService.fetchSilent]', error);
      this.matchesStore.setError(new Error(error instanceof Error ? error.message : String(error)));
    }
  }

  private onWebsocketUpdate = (ev: MessageEvent<unknown>) => {
    if (ev.data === WEBSOCKET_EVENTS.MATCHES_UPDATED) {
      this.fetchSilent();
      this.rankingService.fetch(true);
    }
  };
}
