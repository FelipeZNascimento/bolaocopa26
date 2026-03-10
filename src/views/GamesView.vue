<template>
  <div style="display: flex">
    <div class="outer-matches">
      <PaginatorComponent />
      <ErrorChecker />
      <div :class="{ 'outer-line-mode': view === 'lines', 'outer-grid-mode': view === 'grid' }">
        <MatchesSkeleton v-if="isLoading" :isLoading="isLoading" :view="view" />
        <GroupedMatches v-else :matches="matches" :view="view" :selectedRound="selectedRound" />
      </div>
    </div>
    <RankingComponent v-if="isDesktop && rankingPosition === 'active'" />
  </div>
</template>
<script setup lang="ts">
import { isDesktop } from '@basitcodeenv/vue3-device-detect';
import { computed } from 'vue';

import ErrorChecker from '@/components/ErrorChecker.vue';
import GroupedMatches from '@/components/GroupedMatches.vue';
import MatchesSkeleton from '@/components/MatchesSkeleton.vue';
import PaginatorComponent from '@/components/PaginatorComponent.vue';
import RankingComponent from '@/components/Ranking/RankingComponent.vue';
import { useConfigurationStore } from '@/stores/configuration';
import { useMatchesStore } from '@/stores/matches';

// ------ Initialization ------
const configurationStore = useConfigurationStore();
const matchesStore = useMatchesStore();

// ------ Computed Properties ------
const isConfigurationLoading = computed(() => configurationStore.isLoading);
const isMatchesLoading = computed(() => matchesStore.isLoading);
const matches = computed(() => matchesStore.matches);
const isLoading = computed(() => isConfigurationLoading.value || isMatchesLoading.value);
const rankingPosition = computed(() => configurationStore.rankingPosition);
const view = computed(() => configurationStore.gamesView);
const selectedRound = computed(() => configurationStore.selectedRound);
</script>
<style scoped lang="scss">
.outer-matches {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--m-spacing);
  flex: 1;
}

.outer-line-mode {
  padding: var(--xl-spacing);
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--l-spacing);
  width: 100%;
  position: relative;
  z-index: 1;
}

.outer-grid-mode {
  /* padding: 0 var(--m-spacing); */
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: var(--xl-spacing);
  position: relative;
  z-index: 1;
}
</style>
