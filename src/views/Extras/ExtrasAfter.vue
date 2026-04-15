<template>
  <div class="outer-extras">
    <h1>Extras</h1>
    <h2>Minhas Apostas</h2>
    <PrimeSkeleton
      v-if="isLoadingConfig || isLoadingExtras"
      class="skeleton-outer"
    />
    <ExtraBetsTeamCard
      v-else
      :extra-bets="activeProfileExtraBets"
    />
    <PrimeDivider />
    <h2>Resultados</h2>
    <PrimeSkeleton
      v-if="isLoadingConfig || isLoadingExtras"
      class="skeleton-outer"
    />
    <ExtraBetsTeamCard
      v-else
      :results="extraBetsResults"
    />
    <PrimeDivider />

    <h2>Apostas Gerais</h2>
    <PrimeSelectButton
      v-model="selectedToggle"
      :allow-empty="false"
      size="large"
      :options="buttonOptions"
      data-key="value"
      style="margin-bottom: var(--m-spacing)"
    >
      <template #option="slotProps">
        <span>{{ slotProps.option.label }}</span>
      </template>
    </PrimeSelectButton>
    <PrimeSkeleton
      v-if="isLoadingConfig || isLoadingExtras"
      class="skeleton-outer"
    />
    <div
      v-else
      style="display: flex; flex-direction: row; flex-wrap: wrap; gap: 20px; justify-content: center"
    >
      <PrimeCard
        v-for="(item, index) in selectedExtras"
        :key="index"
        class="all-bets-card"
      >
        <template #header>
          <div class="header-container">
            <img
              :src="`https://assets.omegafox.me/copa/countries_flags/${item.team.isoCode.toLowerCase()}.png`"
              :alt="`${item.team.name} Shield`"
            >
            <div class="header-overlay">
              {{ isPlayerWithExtras(item) ? item.player.name : item.team.name }}
            </div>
          </div>
        </template>
        <template #title>
          <p style="text-align: center">
            {{ filterBetsByType(item.bets, selectedToggle.value).length }} Apostas
          </p>
        </template>
        <template #footer>
          <div style="display: flex; justify-content: center">
            <PrimeButton
              label="Detalhes"
              icon="pi pi-plus-circle"
              severity="secondary"
              variant="outlined"
              class="w-full"
              @click="() => handleSelection(item)"
            />
          </div>
        </template>
      </PrimeCard>
    </div>
  </div>
  <!-- Modals -->
  <ExtraBetsModal
    :is-open="isModalOpen"
    :player="selectedPlayer"
    :team="selectedTeam"
    :handle-close-modal="handleCloseExtraBetsModal"
    :selected-bet-type="selectedToggle.value"
  />
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';

import type { IExtraBet, IPlayerWithExtras, ITeamWithExtras } from '@/stores/extraBet.types';
import type { IPlayer, ITeam } from '@/stores/teams.types';

import {
  EXTRA_BETS_LABELS,
  EXTRA_BETS_VALUES,
  type TEXTRA_BETS_LABELS,
  type TEXTRA_BETS_VALUES,
} from '@/constants/bets';
import ExtraBetService from '@/services/extra_bet';
import { useConfigurationStore } from '@/stores/configuration';
import { useExtraBetStore } from '@/stores/extraBet';

import ExtraBetsModal from './After/ExtraBetsModal.vue';
import ExtraBetsTeamCard from './After/ExtraBetsTeamCard.vue';

// ------ Services & Stores ------
const extraBetService = new ExtraBetService();

// ------ Types & Interfaces ------
interface IToggleOption {
  label: TEXTRA_BETS_LABELS;
  value: TEXTRA_BETS_VALUES;
}

// ------ Refs ------
const selectedTeam = ref<null | { bets: IExtraBet[]; team: ITeam }>(null);
const selectedPlayer = ref<IPlayer | null>(null);
const selectedToggle = ref<IToggleOption>({
  label: EXTRA_BETS_LABELS[EXTRA_BETS_VALUES.CHAMPION],
  value: EXTRA_BETS_VALUES.CHAMPION,
});
const buttonOptions = ref<IToggleOption[]>([
  { label: EXTRA_BETS_LABELS[EXTRA_BETS_VALUES.CHAMPION], value: EXTRA_BETS_VALUES.CHAMPION },
  { label: EXTRA_BETS_LABELS[EXTRA_BETS_VALUES.TOP_SCORER], value: EXTRA_BETS_VALUES.TOP_SCORER },
  { label: EXTRA_BETS_LABELS[EXTRA_BETS_VALUES.OFFENSE], value: EXTRA_BETS_VALUES.OFFENSE },
  { label: EXTRA_BETS_LABELS[EXTRA_BETS_VALUES.DEFENSE], value: EXTRA_BETS_VALUES.DEFENSE },
  { label: EXTRA_BETS_LABELS[EXTRA_BETS_VALUES.BEST_PLAYER], value: EXTRA_BETS_VALUES.BEST_PLAYER },
]);

// ------ Initialization ------
const configurationStore = useConfigurationStore();
const extraBetStore = useExtraBetStore();
extraBetService.fetch();

// ------ Computed Properties ------
const isLoadingExtras = computed(() => extraBetStore.isLoading);
const isLoadingConfig = computed(() => configurationStore.isLoading);
const extraBetsResults = computed(() => extraBetStore.results);
const activeProfileExtraBets = computed(() => extraBetStore.loggedUserBets);
const extraBetsByTeam = computed(() => extraBetStore.extraBetsByTeam);
const topScorersByPlayer = computed(() => extraBetStore.topScorerBetsByPlayer);

const selectedExtras = computed<IPlayerWithExtras[] | ITeamWithExtras[]>(() => {
  if (selectedToggle.value.value === EXTRA_BETS_VALUES.TOP_SCORER) {
    return [...topScorersByPlayer.value].sort((a, b) => a.player.name.localeCompare(b.player.name));
  }

  return extraBetsByTeam.value
    .filter((team) => team.bets.some((bet) => bet.extraType === selectedToggle.value.value))
    .sort((a, b) => a.team.name.localeCompare(b.team.name));
});
const isModalOpen = computed(() => selectedTeam.value !== null || selectedPlayer.value !== null);

function filterBetsByType(bets: IExtraBet[], extraType: TEXTRA_BETS_VALUES) {
  return bets
    .filter((bet) => bet.extraType === extraType)
    .sort((a, b) => a.user.nickname.localeCompare(b.user.nickname));
}

function handleCloseExtraBetsModal() {
  selectedPlayer.value = null;
  selectedTeam.value = null;
}

function handleSelection(item: IPlayerWithExtras | ITeamWithExtras) {
  if (isPlayerWithExtras(item)) {
    selectedPlayer.value = item.player;
  } else {
    selectedPlayer.value = null;
  }
  selectedTeam.value = item;
}

function isPlayerWithExtras(item: IPlayerWithExtras | ITeamWithExtras): item is IPlayerWithExtras {
  return 'player' in item;
}
</script>
<style lang="scss" scoped>
.all-bets-card {
  overflow: hidden;
  width: 160px;

  .header-container {
    width: 100%;
    height: 140px;
    position: relative;
  }

  .header-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    text-align: center;
    font-size: var(--m-font-size);
    padding: 4px;
    font-weight: bold;
  }

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
}

.outer-extras {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: var(--m-spacing);
  padding: var(--l-spacing) 160px;
  flex: 1;

  @media (max-width: 767px) {
    padding: var(--xxl-spacing) var(--s-spacing);
  }
}

.skeleton-outer {
  width: 100%;
  min-height: 200px;
}
</style>
