<template>
  <FloatingButtons :selectedRound="selectedRound" />
  <div style="display: flex">
    <div class="outer-matches">
      <PaginatorComponent />
      <ErrorChecker />
      <div class="outer-line">
        <MatchesSkeleton
          v-if="isLoading"
          :is-loading="isLoading"
        />
        <MatchesList
          v-else
          :matches="matches"
          :selected-round="selectedRound"
        />
      </div>
    </div>
    <RankingComponent
      v-if="isDesktop && rankingPosition === 'active'"
      :is-full-page="false"
    />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';

import ErrorChecker from '@/components/ErrorChecker.vue';
import MatchesSkeleton from '@/components/MatchesSkeleton.vue';
import PaginatorComponent from '@/components/PaginatorComponent.vue';
import RankingComponent from '@/components/Ranking/RankingComponent.vue';
import { useViewport } from '@/services/viewport';
import { useConfigurationStore } from '@/stores/configuration';
import { useMatchesStore } from '@/stores/matches';
import FloatingButtons from '@/views/Matches/FloatingButtons.vue';
import MatchesList from '@/views/Matches/MatchesList.vue';

// ------ Initialization ------
const configurationStore = useConfigurationStore();
const matchesStore = useMatchesStore();
const { isDesktop } = useViewport();

// ------ Computed Properties ------
const isConfigurationLoading = computed(() => configurationStore.isLoading);
const isMatchesLoading = computed(() => matchesStore.isLoading);
const matches = computed(() => matchesStore.matches);
const isLoading = computed(() => isConfigurationLoading.value || isMatchesLoading.value);
const rankingPosition = computed(() => configurationStore.rankingPosition);
const selectedRound = computed(() => configurationStore.selectedRound);
</script>
<style scoped lang="scss">
.outer-matches {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--m-spacing);
  align-items: flex-start;

  @media (width <= 1024px) {
    margin-bottom: 80px;
  }
}

.outer-line {
  position: relative;
  z-index: 1;
  display: flex;
  flex-flow: row wrap;
  gap: var(--l-spacing);
  align-items: flex-start;
  width: 100%;
  padding: 0 var(--xl-spacing) var(--xl-spacing) var(--xl-spacing);

  @media (width <= 1024px) {
    padding: var(--xs-spacing);
  }
}
</style>
