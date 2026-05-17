<template>
  <div
    class="outer"
    :class="{ scrolled: isScrolled }"
  >
    <div class="ranking-container">
      <RankingTable
        column-config="compact"
        row-spacing-config="small"
        :is-full-page="isFullPage"
      />
    </div>
    <RouterLink
      to="/ranking"
      class="see-full-ranking-link"
    >
      <PrimeButton
        class="match-info-toggle"
        :label="t('ranking.completeRankingButton')"
        severity="secondary"
        :aria-label="t('ranking.completeRankingButton')"
      />
    </RouterLink>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { useViewport } from '@/services/viewport';
import { useActiveProfileStore } from '@/stores/activeProfile';

import RankingTable from './RankingTable.vue';

withDefaults(
  defineProps<{
    isFullPage?: boolean;
  }>(),
  { isFullPage: true },
);

// ------ Refs ------
const showFavoritesOnly = ref(false);
const isScrolled = ref(false);

// ------ Initialization ------
const activeProfileStore = useActiveProfileStore();
const { isDesktop } = useViewport();
const { t } = useI18n();

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

// ------ Computed Properties  ------
const activeProfile = computed(() => activeProfileStore.activeProfile);

// ------ Functions  ------
const handleScroll = () => {
  if (!isDesktop) {
    return;
  }

  isScrolled.value = window.scrollY > 100;
};

// if activeProfile becomes empty, showFavoritesOnly should be set to false to avoid showing empty ranking
watch(activeProfile, (newValue) => {
  if (!newValue) {
    showFavoritesOnly.value = false;
  }
});
</script>
<style scoped>
.outer {
  position: sticky;
  top: 80px;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 440px;
  min-width: 310px;
  height: 80vh;
  background-color: var(--bolao-c-navbar);
  border-left: 1px solid var(--color-background-mute);
  border-radius: var(--border-radius);
  box-shadow: var(--drop-shadow);
  transition:
    top 0.3s ease,
    height 0.3s ease;

  &.scrolled {
    top: 20px;
    height: calc(100vh - 40px);
  }
}

.ranking-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  max-height: calc(100% - 50px);
  overflow-y: auto;
}

.close {
  position: absolute;
  top: var(--s-spacing);
  right: var(--s-spacing);
  font-size: var(--l-font-size);
  color: var(--color-text);
  cursor: pointer;
}

.see-full-ranking-link {
  flex: 0;
  padding: var(--l-spacing) 0;
}
</style>
