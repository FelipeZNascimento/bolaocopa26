<template>
  <div class="news-widget">
    <template v-if="newsStore.isLoading">
      <div
        v-for="i in 3"
        :key="i"
        class="news-skeleton"
      >
        <PrimeSkeleton class="skeleton-image" />
        <div class="skeleton-text">
          <PrimeSkeleton class="skeleton-title" />
          <PrimeSkeleton class="skeleton-summary" />
        </div>
      </div>
    </template>

    <div
      v-else-if="newsStore.error"
      class="news-state"
    >
      <i class="pi pi-exclamation-circle" />
      <span>{{ t('home.news.loadingError') }}</span>
    </div>

    <div
      v-else-if="newsStore.news.length === 0"
      class="news-state"
    >
      <i class="pi pi-newspaper" />
      <span>{{ t('home.news.noNews') }}</span>
    </div>

    <div
      v-else
      class="news-list"
    >
      <a
        v-for="item in newsStore.news"
        :key="item.id"
        :href="item.link"
        class="news-item"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div
          v-if="item.image"
          class="news-image-wrapper"
        >
          <PrimeSkeleton
            v-if="imageLoading[item.id]"
            class="image-skeleton"
          />
          <img
            :src="item.image"
            :alt="item.title"
            class="news-image"
            :class="{ 'is-loading': imageLoading[item.id] }"
            loading="lazy"
            @load="onImageLoad(item.id)"
            @error="onImageLoad(item.id)"
          />
        </div>
        <div class="news-body">
          <span class="news-title">{{ item.title }}</span>
          <p class="news-summary">{{ item.summary }}</p>
          <span class="news-read-more">
            {{ t('home.news.readMore') }}
            <i class="pi pi-external-link" />
          </span>
        </div>
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import NewsService from '@/services/news';
import { useNewsStore } from '@/stores/news';

const { t } = useI18n();

const newsStore = useNewsStore();
const newsService = new NewsService();
const imageLoading = reactive<Record<number, boolean>>({});

watch(
  () => newsStore.news,
  (items) => {
    items.forEach((item) => {
      if (!(item.id in imageLoading)) {
        imageLoading[item.id] = true;
      }
    });
  },
  { immediate: true },
);

function onImageLoad(id: number) {
  imageLoading[id] = false;
}

onMounted(() => {
  newsService.fetch();
});
</script>

<style lang="scss" scoped>
.news-widget {
  display: flex;
  flex-direction: column;
  gap: var(--s-spacing);
  max-height: 420px;
  overflow-y: auto;
}

.news-skeleton {
  display: flex;
  gap: var(--s-spacing);
  align-items: flex-start;
}

.skeleton-image {
  flex-shrink: 0;
  width: 80px !important;
  height: 60px !important;
  border-radius: 6px;
}

.skeleton-text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--xs-spacing);
}

.skeleton-title {
  width: 100% !important;
  height: 16px !important;
}

.skeleton-summary {
  width: 75% !important;
  height: 12px !important;
}

.news-state {
  display: flex;
  flex-direction: column;
  gap: var(--s-spacing);
  align-items: center;
  justify-content: center;
  height: 120px;
  font-size: var(--s-font-size);
  color: var(--bolao-c-grey2);

  i {
    font-size: 1.5rem;
  }
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: var(--xs-spacing);
}

.news-item {
  display: flex;
  gap: var(--s-spacing);
  align-items: flex-start;
  padding: var(--xs-spacing);
  text-decoration: none;
  border-bottom: 1px solid var(--bolao-c-grey3-t1);

  // border-radius: 6px;
  transition: background-color 0.15s ease;

  &:hover {
    text-decoration: none;
    background-color: rgb(255 255 255 / 5%);
  }
}

.news-image-wrapper {
  position: relative;
  flex-shrink: 0;
  width: 80px;
  height: 60px;
  border-radius: 6px;
}

.image-skeleton {
  position: absolute;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
  border-radius: 6px;
}

.news-image {
  width: 80px;
  height: 60px;
  overflow: hidden;
  object-fit: cover;
  border-radius: 6px;
  opacity: 1;
  transition: opacity 0.2s ease;

  &.is-loading {
    opacity: 0;
  }
}

.news-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--xs-spacing);
  min-width: 0;
}

.news-title {
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  font-size: var(--s-font-size);
  font-weight: 600;
  color: var(--bolao-c-white);
  -webkit-box-orient: vertical;

  // white-space: nowrap;
}

.news-summary {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  font-size: var(--xs-font-size);
  line-height: 1.4;
  color: var(--bolao-c-grey2);
  -webkit-box-orient: vertical;
}

.news-read-more {
  display: flex;
  gap: 4px;
  align-items: center;
  font-size: var(--xs-font-size);
  color: var(--bolao-c-blue1);
  transition: color 0.15s ease;

  .news-item:hover & {
    color: var(--bolao-c-sky);
  }
}
</style>
