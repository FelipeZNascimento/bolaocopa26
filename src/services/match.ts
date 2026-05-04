import type { IMatch } from '@/stores/matches.types';
import type { IRankingLine, IRoundRanking } from '@/stores/ranking.types';

import { useConfigurationStore } from '@/stores/configuration';
import { useMatchesStore } from '@/stores/matches';
import { useRankingStore } from '@/stores/ranking';

import ApiService from './api_request';
import WebsocketService from './websocket';

export default class MatchService {
  public websocketInstance;
  private apiRequest;
  private configurationStore;
  private matchesStore;

  constructor() {
    this.apiRequest = new ApiService();
    this.configurationStore = useConfigurationStore();
    this.matchesStore = useMatchesStore();
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

      if (this.websocketInstance) {
        this.websocketInstance.close();
      }

      this.websocketInstance.connect();
    } catch (error: unknown) {
      this.matchesStore.setLoading(false);
      this.matchesStore.setError(new Error(error instanceof Error ? error.message : String(error)));
    }
  }

  private onWebsocketUpdate(this: WebSocket, ev: MessageEvent<unknown>) {
    // const configurationStore = useConfigurationStore();
    // const selectedRound = configurationStore.selectedRound;

    // const { _matches, ranking, week } = JSON.parse(ev.data) as {
    //   _matches: IMatch[];
    //   ranking: { seasonRanking: IRankingLine[]; weeklyRanking: IRoundRanking[] };
    //   week: number;
    // };
    const { ranking } = JSON.parse(ev.data as string) as {
      ranking: {
        seasonRanking: IRankingLine[];
        weeklyRanking: IRoundRanking[];
      };
    };

    // Update matches if the update is for the current week being viewed
    // if (selectedRound === week) {
    //   const _matchesStore = useMatchesStore();
    //   _matchesStore.updateMatches(_matches);
    // }

    const rankingStore = useRankingStore();
    rankingStore.setSeason(ranking.seasonRanking);
    rankingStore.setRounds(ranking.weeklyRanking);
  }
}
