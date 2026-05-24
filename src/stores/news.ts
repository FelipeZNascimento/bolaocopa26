import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { INews } from './news.types';

export const useNewsStore = defineStore('news', () => {
  const error = ref<Error | null>(null);
  const isLoading = ref<boolean>(false);
  const news = ref<INews[]>([]);

  function setError(newError: Error | null) {
    error.value = newError;
  }

  function setLoading(loadingState: boolean) {
    isLoading.value = loadingState;
  }

  function setNews(newNews: INews[]) {
    news.value = Array.isArray(newNews) ? newNews : [];
  }

  return {
    error,
    isLoading,
    news,
    setError,
    setLoading,
    setNews,
  };
});
