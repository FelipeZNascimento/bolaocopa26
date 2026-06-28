import type { IMatch } from '@/stores/matches.types';
import type { IRankingLine, IRoundRanking } from '@/stores/ranking.types';

import { useConfigurationStore } from '@/stores/configuration';
import { useMatchesStore } from '@/stores/matches';
import { useRankingStore } from '@/stores/ranking';

import ApiService from './api_request';
import RankingService from './ranking';
import WebsocketService, { WEBSOCKET_EVENTS } from './websocket';

export default class MatchService {
  public websocketInstance;
  private apiRequest;
  private configurationStore;
  private matchesStore;
  private rankingService;
  private rankingStore;

  constructor() {
    this.apiRequest = new ApiService();
    this.configurationStore = useConfigurationStore();
    this.matchesStore = useMatchesStore();
    this.rankingStore = useRankingStore();
    this.rankingService = new RankingService();
    this.websocketInstance = new WebsocketService(this.onWebsocketUpdate);
  }

  public checkWebsocketConnection() {
    this.websocketInstance.connectIfNeeded();
  }

  public async fetch(round?: null | number, edition?: null | number, silent = false) {
    if (!silent) {
      this.matchesStore.setLoading(true);
    }

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

  public async fetchLiveMatches(silent = false) {
    if (!silent) {
      this.matchesStore.setLoading(true);
    }

    try {
      const response = await this.apiRequest.get<IMatch[]>(`match/live-matches`);
      this.matchesStore.setLiveMatches(response);
      this.matchesStore.setLoading(false);
      this.matchesStore.setError(null);
    } catch (error: unknown) {
      this.matchesStore.setLoading(false);
      console.error('[MatchService.fetchNextMatches]', error);
      this.matchesStore.setError(new Error(error instanceof Error ? error.message : String(error)));
    }
  }

  public async fetchNextMatches(silent = false) {
    if (!silent) {
      this.matchesStore.setLoading(true);
    }

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

  private onWebsocketUpdate = (ev: MessageEvent<string>) => {
    interface IMatchData {
      allMatches: IMatch[];
      liveMatches: IMatch[];
      nextMatches: IMatch[];
      updatedMatches: IMatch[];
    }

    interface IRankingData {
      edition: IRankingLine[];
      editionWithoutExtras: IRankingLine[];
      round: IRoundRanking[];
    }

    const parsedData: {
      data: IMatchData | IRankingData;
      message: string;
    } = JSON.parse(ev.data);
    if (parsedData.message === WEBSOCKET_EVENTS.RANKING_UPDATED) {
      const ranking = parsedData.data as IRankingData;
      this.rankingStore.setEditionRankingWithoutExtras(ranking.editionWithoutExtras);
      this.rankingStore.setEditionRanking(ranking.edition);
      this.rankingStore.setRounds(ranking.round);
    } else if (parsedData.message === WEBSOCKET_EVENTS.MATCHES_UPDATED) {
      const matchData = parsedData.data as IMatchData;

      const mappedByIdCurrent = new Map(this.matchesStore.matches.map((m) => [m.id, m]));
      const nextMatches = matchData.nextMatches.map((m) => {
        return {
          ...m,
          loggedUserBets: mappedByIdCurrent.get(m.id)?.loggedUserBets ?? null,
        };
      });

      const liveMatches = matchData.liveMatches.map((m) => {
        return {
          ...m,
          loggedUserBets: mappedByIdCurrent.get(m.id)?.loggedUserBets ?? null,
        };
      });

      this.matchesStore.updateMatches(matchData.updatedMatches);
      this.matchesStore.setNextMatches(nextMatches);
      this.matchesStore.setLiveMatches(liveMatches);
    }
  };
}
