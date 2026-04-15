<template>
  <div :class="{ 'outer-ranking': !isModal }">
    <div class="ranking-header">
      <span
        class="toggle"
        :class="{ activeToggle: !isRoundRanking }"
        @click="isRoundRanking = false"
      >Geral</span>
      <span
        class="toggle"
        :class="{ activeToggle: isRoundRanking }"
        @click="isRoundRanking = true"
      >Rodada {{ selectedRound }}</span>
      <PrimeDivider layout="vertical" />
      <span
        class="toggle"
        :class="{ activeToggle: !showFavoritesOnly }"
        @click="showFavoritesOnly = false"
      >
        <i class="pi pi-list" /> Todos
      </span>
      <span
        class="toggle"
        :class="{ activeToggle: showFavoritesOnly }"
        :style="{ color: showFavoritesOnly ? 'var(--bolao-c-gold)' : '' }"
        @click="showFavoritesOnly = true"
      >
        <i :class="{ 'pi pi-star-fill': showFavoritesOnly, 'pi pi-star': !showFavoritesOnly }" /> Favoritos
      </span>
      <PrimeDivider layout="vertical" />
      <span
        class="toggle"
        @click="
          isRoundRanking = false;
          showFavoritesOnly = false;
        "
      >
        <i class="pi pi-filter-slash" />
      </span>
    </div>
    <div class="ranking-container">
      <RankingTable
        v-model:show-favorites-only="showFavoritesOnly"
        :is-round="isRoundRanking"
        :is-loading="isRoundRanking ? isLoadingRounds : isLoadingSeason"
        :ranking-data="isRoundRanking ? selectedRoundRanking : seasonRanking"
        column-config="compact"
        row-spacing-config="small"
        :active-profile="activeProfile"
        :error="isRoundRanking ? errorSeason : errorRounds"
      />
    </div>
    <RouterLink
      to="/ranking"
      class="see-full-ranking-link"
    >
      <PrimeButton
        icon="pi pi-plus"
        class="match-info-toggle"
        label="Ranking completo"
        severity="secondary"
        aria-label="Ranking completo"
      />
    </RouterLink>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

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

// if activeProfile becomes empty, showFavoritesOnly should be set to false to avoid showing empty ranking
watch(activeProfile, (newValue) => {
  if (!newValue) {
    showFavoritesOnly.value = false;
  }
});
</script>
<style scoped>
.outer-ranking {
  top: 10vh;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  position: sticky;
  border-left: 1px solid var(--color-background-mute);
  min-width: 310px;
  max-height: calc(80vh);
  box-shadow: var(--drop-shadow);
  border-radius: var(--border-radius);
  background-color: var(--bolao-c-navbar);
}

.ranking-container {
  max-height: calc(100% - 50px);
  overflow-y: auto;
  scrollbar-gutter: stable;
  width: 100%;
  flex: 1;
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
  padding: var(--s-spacing) var(--xl-spacing);
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
  &:hover {
    color: var(--bolao-c-white);
  }
}

.activeToggle {
  color: var(--bolao-c-white);
}

.error-message {
  width: 90%;
  margin: var(--xl-spacing);
}

.see-full-ranking-link {
  padding: var(--l-spacing) 0;
  flex: 0;
}
</style>
