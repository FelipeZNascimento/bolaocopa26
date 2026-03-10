<template>
  <div :class="{ 'outer-ranking': !isModal }">
    <div class="ranking-header">
      <span class="toggle" :class="{ activeToggle: !isRoundRanking }" @click="isRoundRanking = false">Geral</span>
      <span class="toggle" :class="{ activeToggle: isRoundRanking }" @click="isRoundRanking = true">Rodada</span>
      <PrimeDivider layout="vertical" />
      <span class="toggle" :class="{ activeToggle: !showFavoritesOnly }" @click="showFavoritesOnly = false">
        <i class="pi pi-list"></i> Todos
      </span>
      <span
        class="toggle"
        :class="{ activeToggle: showFavoritesOnly }"
        :style="{ color: showFavoritesOnly ? 'var(--bolao-c-gold)' : 'var(--bolao-c-grey1-t2)' }"
        @click="showFavoritesOnly = true"
      >
        <i :class="{ 'pi pi-star-fill': showFavoritesOnly, 'pi pi-star': !showFavoritesOnly }"></i> Favoritos
      </span>
      <PrimeDivider layout="vertical" />
      <span
        class="toggle"
        @click="
          isRoundRanking = false;
          showFavoritesOnly = false;
        "
      >
        <i class="pi pi-filter-slash"></i>
      </span>
    </div>
    <div class="ranking-container">
      <RankingTable
        :isRound="isRoundRanking"
        :isLoading="isRoundRanking ? isLoadingRounds : isLoadingSeason"
        :rankingData="isRoundRanking ? selectedRoundRanking : seasonRanking"
        :columnConfig="columnsOption"
        :rowSpacingConfig="rowSpacing"
        :activeProfile="activeProfile"
        :error="isRoundRanking ? errorSeason : errorRounds"
        v-model:showFavoritesOnly="showFavoritesOnly"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';

import { useActiveProfileStore } from '@/stores/activeProfile';
import { useConfigurationStore } from '@/stores/configuration';
import { useRankingStore } from '@/stores/ranking';

import RankingTable from './RankingTable.vue';

withDefaults(
  defineProps<{
    isModal?: boolean;
  }>(),
  {
    isModal: false,
  },
);

// ------ Refs ------
const isRoundRanking = ref(false);
const showFavoritesOnly = ref(false);

// ------ Initialization ------
const configurationStore = useConfigurationStore();
const rankingStore = useRankingStore();
const activeProfileStore = useActiveProfileStore();

// ------ Computed Properties  ------
const columnsOption = computed(() => rankingStore.columnsOption);
const rowSpacing = computed(() => rankingStore.rowSpacing);
const errorRounds = computed(() => rankingStore.errorRounds);
const errorSeason = computed(() => rankingStore.errorSeason);
const isLoadingRounds = computed(() => configurationStore.isLoading || rankingStore.isLoadingRounds);
const selectedRound = computed(() => configurationStore.selectedRound);
const isLoadingSeason = computed(() => configurationStore.isLoading || rankingStore.isLoadingSeason);
const seasonRanking = computed(() => rankingStore.seasonRanking);
const selectedRoundRanking = computed(
  () => rankingStore.roundsRanking?.find((roundRanking) => roundRanking.round === selectedRound.value)?.ranking || [],
);
const activeProfile = computed(() => activeProfileStore.activeProfile);
</script>
<style scoped>
.outer-ranking {
  top: 15vh;
  right: 0;

  position: sticky;
  border-left: 1px solid var(--color-background-mute);
  min-width: 310px;
  max-height: calc(80vh);
  box-shadow: var(--drop-shadow);
  border-radius: var(--border-radius);
  /* padding-bottom: var(--l-spacing); */
  background-color: var(--bolao-c-blue3-t2);
}

.ranking-container {
  max-height: calc(100% - 50px);
  overflow-y: auto;
  scrollbar-gutter: stable;
}

.outer-position {
  display: flex;
  gap: var(--s-spacing);
}

.ranking-header {
  display: flex;
  gap: var(--s-spacing);
  justify-content: center;
  align-items: center;
  padding: var(--s-spacing) 0;
  font-size: var(--s-font-size);
  height: 50px;
  color: var(--bolao-c-grey1-t2);
}

.skeleton-ranking-line {
  /* width: 100%; */
  height: 40px !important;
  margin: var(--xs-spacing) 0;
}

.toggle {
  cursor: pointer;
  transition: 0.2s;
}

.activeToggle {
  color: var(--bolao-c-white);
}

.error-message {
  width: 90%;
  margin: var(--xl-spacing);
}
</style>
