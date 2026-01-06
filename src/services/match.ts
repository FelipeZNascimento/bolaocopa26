import type { IMatch } from '@/stores/matches.types';
import type { IRankingLine, IWeeklyRanking } from '@/stores/ranking.types';

import { useConfigurationStore } from '@/stores/configuration';
import { useMatchesStore } from '@/stores/matches';
import { useRankingStore } from '@/stores/ranking';

import ApiService from './api_request';
import WebsocketService from './websocket';

interface fetchMatch {
  matches: IMatch[];
  season: string;
  week: string;
}

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

  public async fetch(week?: null | number, season?: null | number) {
    this.matchesStore.setLoading(true);
    // Week may be "0" so needs to be checked against null and undefined
    if (week === undefined || week === null) {
      week = this.configurationStore.selectedWeek;
    }

    // Season may be "0" so needs to be checked against null and undefined
    if (season === undefined || season === null) {
      season = this.configurationStore.currentSeason;
    }

    try {
      const response = await this.apiRequest.get<fetchMatch>(`match/${season}/${week}`);
      this.matchesStore.setMatches(response.matches);
      this.matchesStore.setLoading(false);
      this.matchesStore.setError(null);

      if (this.websocketInstance) {
        this.websocketInstance.close();
      }

      this.websocketInstance.connect();
    } catch (error: any) {
      this.matchesStore.setLoading(false);
      this.matchesStore.setError(new Error(error));
    }
  }

  public async updateBet(matchId: number, betValue: number, callback?: (isSuccess: boolean, error?: Error) => void) {
    const betObject = {
      betValue,
      matchId,
    };

    try {
      await this.apiRequest.post<IMatch>(`bet/update/`, betObject);
      // const response = await this.apiRequest.post<Match>(`bet/update/`, betObject);
      // Deal with the response update the match in the store?

      if (callback) {
        callback(true);
      }
    } catch (error: unknown) {
      if (callback) {
        callback(false, error as Error);
      }
    }
  }

  private onWebsocketUpdate(this: WebSocket, ev: MessageEvent<any>) {
    const configurationStore = useConfigurationStore();
    const selectedWeek = configurationStore.selectedWeek;

    const { matches, ranking, week } = JSON.parse(ev.data) as {
      matches: IMatch[];
      ranking: { seasonRanking: IRankingLine[]; weeklyRanking: IWeeklyRanking[] };
      week: number;
    };

    // Update matches if the update is for the current week being viewed
    if (selectedWeek === week) {
      const matchesStore = useMatchesStore();
      matchesStore.updateMatches(matches);
    }

    const rankingStore = useRankingStore();
    rankingStore.setSeason(ranking.seasonRanking);
    rankingStore.setWeeks(ranking.weeklyRanking);
  }
}
