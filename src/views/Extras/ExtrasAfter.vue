<template>
  <div class="outer-extras">
    <div v-if="activeProfile" style="text-align: center">
      <h1>Extras</h1>
      <h2>Minhas Apostas</h2>
      <PrimeSkeleton
        v-if="isLoadingConfig || isLoadingExtras"
        class="skeleton-outer"
      />
      <ExtraBetsTeamCard v-else :extra-bets="activeProfileExtraBets" />
      <PrimeDivider />
    </div>
    <h2>Resultados</h2>
    <PrimeSkeleton
      v-if="isLoadingConfig || isLoadingExtras"
      class="skeleton-outer"
    />
    <ExtraBetsTeamCard v-else :results="extraBetsResults" />
    <PrimeDivider />

    <h2>Apostas Gerais</h2>
    <div
      style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center"
    >
      <PrimeButton
        v-for="item in buttonOptions"
        :key="item.value"
        :label="item.label"
        variant="outlined"
        size="small"
        :severity="
          selectedToggle.value === item.value ? 'primary' : 'secondary'
        "
        @click="selectedToggle.value = item.value"
        rounded
      />
    </div>
    <PrimeSkeleton
      v-if="isLoadingConfig || isLoadingExtras"
      class="skeleton-outer"
    />
    <div v-else class="cards-container">
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
            />
            <div class="header-overlay">
              {{ isPlayerWithExtras(item) ? item.player.name : item.team.name }}
            </div>
          </div>
        </template>
        <template #content>
          <p class="card-content">
            {{ filterBetsByType(item.bets, selectedToggle.value).length }}
            Apostas
          </p>
        </template>
        <template #footer>
          <div style="display: flex; justify-content: center">
            <PrimeButton
              label="Ver Mais"
              icon="pi pi-plus-circle"
              severity="secondary"
              variant="outlined"
              class="details-button"
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
import { computed, ref } from "vue";

import type {
  IExtraBet,
  IPlayerWithExtras,
  ITeamWithExtras,
} from "@/stores/extraBet.types";
import type { IPlayer, ITeam } from "@/stores/teams.types";

import {
  EXTRA_BETS_LABELS,
  EXTRA_BETS_VALUES,
  type TEXTRA_BETS_LABELS,
  type TEXTRA_BETS_VALUES,
} from "@/constants/bets";
import ExtraBetService from "@/services/extra_bet";
import { useActiveProfileStore } from "@/stores/activeProfile";
import { useConfigurationStore } from "@/stores/configuration";
import { useExtraBetStore } from "@/stores/extraBet";

import ExtraBetsModal from "./After/ExtraBetsModal.vue";
import ExtraBetsTeamCard from "./After/ExtraBetsTeamCard.vue";

// ------ Services & Stores ------
const extraBetService = new ExtraBetService();
const activeProfileStore = useActiveProfileStore();

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
  {
    label: EXTRA_BETS_LABELS[EXTRA_BETS_VALUES.CHAMPION],
    value: EXTRA_BETS_VALUES.CHAMPION,
  },
  {
    label: EXTRA_BETS_LABELS[EXTRA_BETS_VALUES.TOP_SCORER],
    value: EXTRA_BETS_VALUES.TOP_SCORER,
  },
  {
    label: EXTRA_BETS_LABELS[EXTRA_BETS_VALUES.OFFENSE],
    value: EXTRA_BETS_VALUES.OFFENSE,
  },
  {
    label: EXTRA_BETS_LABELS[EXTRA_BETS_VALUES.DEFENSE],
    value: EXTRA_BETS_VALUES.DEFENSE,
  },
  {
    label: EXTRA_BETS_LABELS[EXTRA_BETS_VALUES.BEST_PLAYER],
    value: EXTRA_BETS_VALUES.BEST_PLAYER,
  },
]);

// ------ Initialization ------
const configurationStore = useConfigurationStore();
const extraBetStore = useExtraBetStore();
extraBetService.fetch();

// ------ Computed Properties ------
const isLoadingExtras = computed(() => extraBetStore.isLoading);
const isLoadingConfig = computed(() => configurationStore.isLoading);
const extraBetsResults = computed(() => extraBetStore.results);
const activeProfileExtraBets = computed(() => extraBetStore.activeProfileBets);
const activeProfile = computed(() => activeProfileStore.activeProfile);
const extraBetsByTeam = computed(() => extraBetStore.extraBetsByTeam);
const topScorersByPlayer = computed(() => extraBetStore.topScorerBetsByPlayer);

const selectedExtras = computed<IPlayerWithExtras[] | ITeamWithExtras[]>(() => {
  if (selectedToggle.value.value === EXTRA_BETS_VALUES.TOP_SCORER) {
    return [...topScorersByPlayer.value].sort((a, b) =>
      a.player.name.localeCompare(b.player.name),
    );
  }

  return extraBetsByTeam.value
    .filter((team) =>
      team.bets.some((bet) => bet.extraType === selectedToggle.value.value),
    )
    .sort((a, b) => a.team.name.localeCompare(b.team.name));
});
const isModalOpen = computed(
  () => selectedTeam.value !== null || selectedPlayer.value !== null,
);

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

function isPlayerWithExtras(
  item: IPlayerWithExtras | ITeamWithExtras,
): item is IPlayerWithExtras {
  return "player" in item;
}
</script>
<style lang="scss" scoped>
.cards-container {
  display: flex;
  flex-flow: row wrap;
  gap: var(--m-spacing);
  justify-content: center;
  max-width: 100vw;
}

.all-bets-card {
  width: 160px;
  overflow: hidden;
  font-size: var(--m-font-size);

  @media (width <= 768px) {
    width: 80px;
    font-size: var(--s-font-size);
  }

  .header-container {
    position: relative;
    width: 100%;
    height: 140px;

    @media (width <= 768px) {
      height: 70px;
    }
  }

  .header-overlay {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    padding: var(--xs-spacing);
    font-weight: bold;
    color: white;
    text-align: center;
    background: rgb(0 0 0 / 50%);

    @media (width <= 768px) {
      padding: var(--xxxs-spacing);
    }
  }

  .card-content {
    padding: var(--m-spacing) 0;
    text-align: center;

    @media (width <= 768px) {
      font-size: var(--xs-font-size);
    }
  }

  .details-button {
    // text-align: center;
    padding: var(--s-spacing);

    @media (width <= 768px) {
      font-size: var(--xxs-font-size);
    }
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.outer-extras {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--m-spacing);
  align-items: center;
  justify-content: space-between;
  padding: var(--l-spacing) 160px;

  @media (width <= 768px) {
    padding: var(--xxl-spacing) var(--s-spacing);
  }
}

.skeleton-outer {
  width: 100%;
  min-height: 200px;
}

:deep(.p-card-body) {
  padding: var(--xs-spacing);
}
</style>
