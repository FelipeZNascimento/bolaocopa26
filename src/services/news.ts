import type { INews } from '@/stores/news.types';

import { useConfigurationStore } from '@/stores/configuration';
import { useNewsStore } from '@/stores/news';

import ApiService from './api_request';

export default class NewsService {
  private apiRequest;
  private configurationStore;
  private newsStore;

  constructor() {
    this.apiRequest = new ApiService();
    this.configurationStore = useConfigurationStore();
    this.newsStore = useNewsStore();
  }

  public async fetch(edition?: null | number) {
    this.newsStore.setLoading(true);

    // Season may be "0" so needs to be checked against null and undefined
    if (edition === undefined || edition === null) {
      edition = this.configurationStore.currentEdition;
    }

    try {
      const response = await this.apiRequest.get<INews[]>(`news/`);
      this.newsStore.setNews(response);
      this.newsStore.setLoading(false);
      this.newsStore.setError(null);
    } catch (error: unknown) {
      this.newsStore.setLoading(false);
      console.error('[NewsService.fetch]', error);
      this.newsStore.setError(new Error(error instanceof Error ? error.message : String(error)));
    }
  }
}
