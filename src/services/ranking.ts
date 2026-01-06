import type { TColumnsValue, TRowSpacingValue } from '@/stores/configuration.types';
import type { IRankingResponse } from '@/stores/ranking.types';

import { useRankingStore } from '@/stores/ranking';

import ApiService from './api_request';

export default class RankingService {
  private apiRequest;
  private rankingStore;

  constructor() {
    this.apiRequest = new ApiService();
    this.rankingStore = useRankingStore();
  }

  public async fetch() {
    this.rankingStore.setLoadingSeason(true);

    try {
      const rankingResponse = await this.apiRequest.get<IRankingResponse>(`ranking/season/`);
      this.rankingStore.setLoadingSeason(false);
      this.rankingStore.setSeason(rankingResponse.seasonRanking);
      this.rankingStore.setWeeks(rankingResponse.weeklyRanking);
      this.rankingStore.setErrorSeason(null);
    } catch (error: any) {
      this.rankingStore.setLoadingSeason(false);
      this.rankingStore.setErrorSeason(new Error(error));
    }
  }

  public async initialize() {
    this.initializePreferences();
    this.fetch();
  }

  async initializePreferences() {
    const rankingColumns = localStorage.getItem('ranking-columns');
    const rankingSpacing = localStorage.getItem('ranking-spacing');

    if (!rankingColumns) {
      localStorage.setItem('ranking-columns', 'complete');
    } else {
      this.rankingStore.columnsOption = rankingColumns as TColumnsValue;
    }

    if (!rankingSpacing) {
      localStorage.setItem('ranking-spacing', 'normal');
    } else {
      this.rankingStore.rowSpacing = rankingSpacing as TRowSpacingValue;
    }
  }
}
