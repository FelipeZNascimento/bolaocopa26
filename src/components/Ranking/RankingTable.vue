<template>
  <div class="ranking-header">
    <div class="button-container">
      <PrimeButtonGroup>
        <PrimeButton
          label="Geral"
          class="toggle"
          :class="{ activeToggle: !isRound }"
          @click="isRound = false"
          :size="isMobile ? 'small' : 'normal'"
        />
        <PrimeButton
          :label="`Rodada ${selectedRound}`"
          class="toggle"
          :class="{ activeToggle: isRound }"
          @click="isRound = true"
          :size="isMobile ? 'small' : 'normal'"
        />
      </PrimeButtonGroup>
      <PrimeButtonGroup>
        <PrimeButton
          label="Todos"
          class="toggle"
          icon="pi pi-list"
          :class="{ activeToggle: !showFavoritesOnly }"
          @click="showFavoritesOnly = false"
          :size="isMobile ? 'small' : 'normal'"
        />
        <PrimeButton
          label="Favoritos"
          :icon="showFavoritesOnly ? 'pi pi-star-fill' : 'pi pi-star'"
          class="toggle"
          :class="{ activeToggle: showFavoritesOnly }"
          @click="showFavoritesOnly = true"
          :size="isMobile ? 'small' : 'normal'"
        />
      </PrimeButtonGroup>
    </div>
  </div>

  <PrimeDataTable
    class="prime-data-table"
    :value="filteredRankingData"
    :size="isDesktop ? rowSpacingConfig : 'small'"
    :loading="isLoading"
    scrollable
    scroll-height="flex"
    striped-rows
    row-hover
  >
    <PrimeColumn field="score.position" header="Posição" sortable>
      <template #body="slotProps">
        <div
          class="row"
          :class="{
            'active-user-row': isActiveProfile(slotProps.data.user.id),
            'top-10-row': slotProps.data.score.position <= 10,
          }"
        >
          <div class="outer-position">
            <div
              v-if="!isActiveProfile(slotProps.data.user.id)"
              class="badge"
              :class="
                slotProps.data.user.isOnline ? 'badgeOnline' : 'badgeOffline'
              "
            />
            <div class="position-number">
              {{
                slotProps.data.score.position < 10
                  ? `0${slotProps.data.score.position}`
                  : slotProps.data.score.position
              }}
            </div>
            <div
              v-tooltip.top="
                `Variação no ranking geral: ${getPositionVariation(slotProps.data) > 0 ? '+' : ''}${getPositionVariation(slotProps.data)}`
              "
              class="position-variation"
              :class="{
                'variation-up': getPositionVariation(slotProps.data) > 0,
                'variation-down': getPositionVariation(slotProps.data) < 0,
                'variation-same': getPositionVariation(slotProps.data) === 0,
              }"
            >
              <i
                v-if="getPositionVariation(slotProps.data) > 0"
                class="pi pi-arrow-up"
              />
              <i
                v-else-if="getPositionVariation(slotProps.data) < 0"
                class="pi pi-arrow-down"
              />
              <i v-else class="pi pi-minus" />
              <span class="variation-value">
                {{ Math.abs(getPositionVariation(slotProps.data)) }}
              </span>
            </div>
            <div class="name-container">
              <NameTag
                :is-short="columnConfig === 'complete'"
                :user="slotProps.data.user"
                :is-clickable="true"
              />
            </div>
          </div>
        </div>
      </template>
    </PrimeColumn>
    <PrimeColumn
      field="score.points"
      :header="isDesktop ? 'Pontos' : 'Pts.'"
      style="text-align: center"
      sortable
    />
    <PrimeColumn field="score.exacts" sortable style="text-align: center">
      <template #header>
        <div class="flexHeader">
          <i class="pi pi-trophy" />
          Acerto
        </div>
      </template>
    </PrimeColumn>
    <PrimeColumn
      v-if="columnConfig === 'complete'"
      field="score.oneScores"
      style="text-align: center"
      sortable
    >
      <template #header>
        <div class="flexHeader">
          <i class="pi pi-verified" />
          Parcial
        </div>
      </template>
    </PrimeColumn>
    <PrimeColumn
      v-if="columnConfig === 'complete'"
      field="score.winnersOnly"
      style="text-align: center"
      sortable
    >
      <template #header>
        <div class="flexHeader">
          <i class="pi pi-check-circle" />
          Mínimo
        </div>
      </template>
    </PrimeColumn>
    <PrimeColumn
      v-if="columnConfig === 'complete' && isDesktop"
      field="score.misses"
      style="text-align: center"
      sortable
    >
      <template #header>
        <div class="flexHeader">
          <i class="pi pi-times" />
          Erros
        </div>
      </template>
    </PrimeColumn>
    <PrimeColumn
      v-if="columnConfig === 'complete'"
      field="score.percentage"
      style="text-align: center"
      sortable
    >
      <template #header>
        <div class="flexHeader">
          <i class="pi pi-percentage" />
          {{ isDesktop ? "Aproveitamento" : "Aprov." }}
        </div>
      </template>
    </PrimeColumn>
    <PrimeColumn
      v-if="columnConfig === 'complete' && !isMobile"
      field="score.extras.points"
      style="text-align: center"
      sortable
    >
      <template #header>
        <div class="flexHeader">
          <i class="pi pi-plus" />
          Extras
        </div>
      </template>
    </PrimeColumn>
  </PrimeDataTable>
  <div
    v-if="!isLoading && showFavoritesOnly && filteredRankingData.length === 0"
    class="centralized-content"
  >
    <p>Nenhum favorito adicionado.</p>
    <p>
      Para adicionar alguém aos seus favoritos, clique no usuário e ative a
      estrela no topo das estatísticas.
    </p>
  </div>
  <div
    v-if="showFavoritesOnly && !isLoading && filteredRankingData.length > 0"
    class="centralized-content"
  >
    <PrimeButton
      label="Gerenciar favoritos"
      @click="isFavoritesModalOpen = true"
    />
  </div>
  <PrimeMessage
    v-if="error"
    class="error-message"
    severity="error"
    variant="outlined"
  >
    Ops, houve um problema de comunicação com o servidor para buscar o ranking.
    <p>
      Certifique-se de que sua conexão está estável e tente novamente. Se o erro
      persistir, entre em contato com os administradores do Bolão.
    </p>
    <p>{{ error }}</p>
  </PrimeMessage>

  <!-- Modals -->
  <ManageFavoritesModal
    :is-open="isFavoritesModalOpen"
    :handle-close-modal="handleCloseFavoritesModal"
  />
  <UserTrackingModal
    :is-open="isUserTrackingModalOpen"
    :is-user-active="activeProfile?.id === selectedUser?.id"
    :selected-user="selectedUser"
    :handle-close-modal="
      () => ((isUserTrackingModalOpen = false), (selectedUser = null))
    "
  />
</template>
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

import type { IUser } from "@/stores/activeProfile.types";
import type {
  TColumnsValue,
  TRowSpacingValue,
} from "@/stores/configuration.types";
import type { IRankingLine } from "@/stores/ranking.types";

import NameTag from "@/components/NameTag.vue";
import ManageFavoritesModal from "@/components/Ranking/ManageFavoritesModal.vue";
import FavoritesService from "@/services/favorites";
import { useViewport } from "@/services/viewport";
import { useActiveProfileStore } from "@/stores/activeProfile";
import { useConfigurationStore } from "@/stores/configuration";
import { useRankingStore } from "@/stores/ranking";

import UserTrackingModal from "../UserTrackingModal.vue";

defineProps<{
  columnConfig: TColumnsValue;
  rowSpacingConfig: TRowSpacingValue;
}>();

// ------ Refs ------
const isUserTrackingModalOpen = ref<boolean>(false);
const selectedUser = ref<IUser | null>(null);
const favorites = ref<number[]>([]);
const isRound = ref(false);
const showFavoritesOnly = ref(false);
const isFavoritesModalOpen = ref(false);

// ------ Initialization ------
const favoritesService = new FavoritesService();
const configurationStore = useConfigurationStore();
const rankingStore = useRankingStore();
const activeProfileStore = useActiveProfileStore();
const { isDesktop, isMobile } = useViewport();

onMounted(() => {
  loadFavorites();
  // Listen for favorites-cleared event from ConfigModal
  window.addEventListener("favorites-cleared", loadFavorites);
});

onBeforeUnmount(() => {
  // Clean up event listener
  window.removeEventListener("favorites-cleared", loadFavorites);
});

// ------ Computed Properties ------
const activeProfile = computed(() => activeProfileStore.activeProfile);
const isLoadingRounds = computed(
  () => configurationStore.isLoading || rankingStore.isLoadingRounds,
);
const isLoadingSeason = computed(
  () => configurationStore.isLoading || rankingStore.isLoadingSeason,
);
const isLoading = computed(() =>
  isRound.value ? isLoadingRounds.value : isLoadingSeason.value,
);
const errorRounds = computed(() => rankingStore.errorRounds);
const errorSeason = computed(() => rankingStore.errorSeason);
const error = computed(() =>
  isRound.value ? errorRounds.value : errorSeason.value,
);
const seasonRanking = computed(() => rankingStore.seasonRanking);
const selectedRoundRanking = computed(
  () =>
    rankingStore.roundsRanking?.find(
      (roundRanking) => roundRanking.round === selectedRound.value,
    )?.ranking || [],
);
const selectedRanking = computed(() =>
  isRound.value ? selectedRoundRanking.value : seasonRanking.value,
);
const selectedRound = computed(() => configurationStore.selectedRound);

const filteredRankingData = computed(() => {
  if (!showFavoritesOnly.value) {
    return selectedRanking.value;
  }

  if (showFavoritesOnly.value && favorites.value.length === 0) {
    return []; // If showFavoritesOnly is true but there are no favorites, return empty array
  }

  return selectedRanking.value.filter((rankingLine) => {
    const isFavorite = favorites.value.includes(rankingLine.user.id);
    const isLoggedInUser =
      activeProfile.value && rankingLine.user.id === activeProfile.value.id;
    return isFavorite || isLoggedInUser;
  });
});

// ------ Functions ------
function getPositionVariation(data: IRankingLine): number {
  return isRound.value
    ? data.accumulatedScore.positionVariation
    : data.score.positionVariation;
}

function handleCloseFavoritesModal() {
  isFavoritesModalOpen.value = false;
}

function isActiveProfile(userId: number): boolean {
  return activeProfile.value?.id === userId;
}

function loadFavorites() {
  if (!activeProfile.value) {
    favorites.value = [];
    return;
  }
  favorites.value = favoritesService.getFavorites(activeProfile.value.id);
}

// ------ Watches ------
watch(
  () => activeProfile.value,
  (newProfile) => {
    if (newProfile) {
      loadFavorites();
    }
  },
);

watch(isUserTrackingModalOpen, (newValue) => {
  if (!newValue) {
    // Reload favorites when modal closes (in case it was updated)
    loadFavorites();
    // Notify other components that favorites may have changed
    window.dispatchEvent(new Event("favorites-cleared"));
  }
});

watch(
  () => showFavoritesOnly.value,
  () => {
    loadFavorites();
  },
);
</script>
<style lang="scss" scoped>
:deep(tr) {
  td {
    padding: 0 !important;
  }
}

:deep(.p-datatable-wrapper) {
  overflow-y: auto;
}

.ranking-header {
  display: flex;
  flex: 0;
  align-items: center;
  justify-content: center;
  padding: var(--l-spacing) 0;
  font-size: var(--s-font-size);
  color: var(--bolao-c-grey1-t2);
}

.button-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--m-spacing);
  align-items: center;
  justify-content: center;
}

.row {
  display: flex;
  flex-direction: row;
  padding: var(--xs-spacing) var(--s-spacing);

  @media (width <= 1024px) {
    padding: var(--xxs-spacing) 0;
    font-size: var(--xs-font-size);
  }
}

.prime-data-table {
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  min-height: 0;

  // max-height: 500px;

  @media (width <= 1024px) {
    width: 100vw;
    max-height: 100vh;
    overflow-x: auto;
    font-size: 12px;
  }
}

.top-10-row {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-white) 20%, transparent) 0%,
    color-mix(in srgb, var(--bolao-c-white) 10%, transparent) 75%,
    transparent 100%
  );
  box-shadow: inset 3px 0 0 var(--bolao-c-white);
}

.active-user-row {
  font-weight: bold;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-green) 60%, transparent) 0%,
    color-mix(in srgb, var(--bolao-c-green) 30%, transparent) 75%,
    transparent 100%
  );
  box-shadow: inset 3px 0 0 var(--bolao-c-green);
}

.outer-position {
  position: relative;
  display: flex;
  gap: var(--xs-spacing);
  align-items: center;
  padding: var(--xs-spacing) 0;
  padding-right: var(--s-spacing);
  padding-left: var(--s-spacing);
  border-radius: 4px;
  transition: all 0.2s;
}

.position-number {
  width: 35px;
  padding-left: var(--s-spacing);
  font-weight: 600;
}

.position-variation {
  display: inline-flex;
  gap: 2px;
  align-items: center;
  justify-content: center;
  width: 30px;
  padding: 2px 4px;
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
  background-color: color-mix(in srgb, var(--bolao-c-black) 60%, transparent);
  border-radius: 4px;

  i {
    font-size: 9px;
  }

  .variation-value {
    font-size: 10px;
  }

  &.variation-up {
    color: var(--bolao-c-white);
    background-color: color-mix(in srgb, var(--bolao-c-mint) 60%, transparent);
  }

  &.variation-down {
    color: var(--bolao-c-white);
    background-color: color-mix(in srgb, var(--bolao-c-red) 60%, transparent);
  }

  &.variation-same {
    color: var(--bolao-c-white);
    opacity: 0.6;
  }
}

%badge {
  position: absolute;
  top: 50%;
  left: 5px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  transform: translateY(-50%);
}

.badge {
  @extend %badge;
}

.badgeOnline {
  @extend %badge;

  color: var(--bolao-c-mint);
  background-color: var(--bolao-c-mint);

  &::after {
    position: absolute;
    top: 0;
    left: 0;
    width: 6px;
    height: 6px;
    content: "";
    border: 1px solid;
    border-radius: 50%;
    animation: ripple 2s infinite ease-in-out;
  }
}

.badgeOffline {
  @extend %badge;

  color: var(--bolao-c-red);
  background-color: var(--bolao-c-grey3);
  opacity: 0.2;
}

.name-container {
  position: relative;
}

.centralized-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--xxl-spacing);
  color: var(--bolao-c-grey1-t2);
  text-align: center;
}

.toggle {
  color: var(--bolao-c-white);
  background-color: var(--bolao-c-blue-d2);
  transition: 0.2s;

  &:hover {
    color: var(--bolao-c-blue);
  }
}

.activeToggle {
  background-color: var(--bolao-c-blue);
}

.flexHeader {
  display: flex;
  gap: var(--xs-spacing);
  align-items: center;
  justify-content: center;

  // width: 100%;

  @media (width <= 1024px) {
    flex-direction: column;
  }
}

.table-header {
  @media (width <= 1024px) {
    font-size: var(--xxs-font-size) !important;
  }
}
</style>
