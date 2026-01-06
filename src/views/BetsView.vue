<template>
  <div style="display: flex">
    <div class="outer-matches">
      <PaginatorComponent />
      <PrimeMessage v-show="errorConfiguration" class="error-message" severity="error" variant="outlined">
        Ops, houve um problema de comunicação com o servidor.
        <p>
          Certifique-se de que sua conexão está estável e tente novamente. Se o erro persistir, entre em contato com os
          administradores do Bolão.
        </p>
        <p>{{ errorConfiguration }}</p>
      </PrimeMessage>
      <div v-if="isLoading" style="width: 100%">
        <PrimeSkeleton v-for="index in 16" :key="index" class="skeleton-match" />
      </div>
      <PrimeMessage v-else-if="errorMatches" class="error-message" severity="error" variant="outlined">
        Ops, houve um problema de comunicação com o servidor para buscar as partidas.
        <p>
          Certifique-se de que sua conexão está estável e tente novamente. Se o erro persistir, entre em contato com os
          administradores do Bolão.
        </p>
        <p>{{ errorMatches }}</p>
      </PrimeMessage>
      <div class="outer-line-mode">
        <MatchComponent :isBetting="true" v-for="match in matches" :match="match" :key="match.id" />
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
</script>
<style lang="scss" scoped>
.outer-matches {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: var(--m-spacing);
  flex: 1;
}

.outer-line-mode {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--m-spacing);
}

.skeleton-match {
  height: 60px !important;
  margin: var(--s-spacing) 0;
}
</style>
