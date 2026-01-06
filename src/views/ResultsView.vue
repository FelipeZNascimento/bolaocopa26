<template>
  <div class="outer-results">
    <div class="outer-matches">
      <PrimeMessage v-show="errorConfiguration" class="error-message" severity="error" variant="outlined">
        Ops, houve um problema de comunicação com o servidor.
        <p>
          Certifique-se de que sua conexão está estável e tente novamente. Se o erro persistir, entre em contato com os
          administradores do Bolão.
        </p>
        <p>{{ errorConfiguration }}</p>
      </PrimeMessage>
      <PaginatorComponent />
      <PrimeMessage v-show="errorMatches" class="error-message" severity="error" variant="outlined">
        Ops, houve um problema de comunicação com o servidor para buscar as partidas.
        <p>
          Certifique-se de que sua conexão está estável e tente novamente. Se o erro persistir, entre em contato com os
          administradores do Bolão.
        </p>
        <p>{{ errorMatches }}</p>
      </PrimeMessage>
      <div :class="{ 'outer-line-mode': view === 'lines', 'outer-grid-mode': view === 'grid' }">
        <span
          :class="{
            'outer-skeleton-line': view === 'lines',
            'outer-skeleton-grid': view === 'grid',
          }"
          v-if="isLoading"
        >
          <PrimeSkeleton
            v-for="index in 16"
            :key="index"
            :class="{
              'skeleton-match-line': view === 'lines',
              'skeleton-match-grid': view === 'grid',
            }"
          />
        </span>
        <MatchComponent v-else v-for="match in matches" :isGridMode="view === 'grid'" :match="match" :key="match.id" />
      </div>
    </div>
    <RankingComponent v-if="isDesktop && rankingPosition === 'active'" />
  </div>
</template>
<script setup lang="ts">
import { isDesktop } from '@basitcodeenv/vue3-device-detect';
import { computed } from 'vue';

import MatchComponent from '@/components/Match/MatchComponent.vue';
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
const errorConfiguration = computed(() => configurationStore.error);
const errorMatches = computed(() => matchesStore.error);
const view = computed(() => configurationStore.resultsView);
</script>
<style scoped>
.outer-results {
  display: flex;
}

.outer-matches {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--m-spacing);
  flex: 1;
}

.outer-line-mode {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--m-spacing);
  width: 100%;
}

.outer-grid-mode {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: var(--xl-spacing);
}

.error-message {
  width: 100%;
  margin: var(--xl-spacing) 0;
}

.outer-skeleton-line {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--m-spacing);
}

.outer-skeleton-grid {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: var(--m-spacing);
  align-items: flex-start;
  justify-content: center;
}

.skeleton-match-line {
  height: 60px !important;
  width: 100% !important;
}

.skeleton-match-grid {
  height: 150px !important;

  @media (max-width: 1023px) {
    width: 170px !important;
  }

  @media (min-width: 1024px) {
    width: 250px !important;
  }
}
</style>
