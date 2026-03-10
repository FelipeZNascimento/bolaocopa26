<template>
  <PrimeDataTable :value="filteredRankingData" :size="rowSpacingConfig" :loading="isLoading" stripedRows>
    <PrimeColumn field="score.position" header="" sortable>
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
              :class="slotProps.data.user.isOnline ? 'badgeOnline' : 'badgeOffline'"
            ></div>
            <div class="position-number">
              {{
                slotProps.data.score.position < 10 ? `0${slotProps.data.score.position}` : slotProps.data.score.position
              }}
            </div>
            <div
              class="position-variation"
              :class="{
                'variation-up': slotProps.data.score.positionVariation > 0,
                'variation-down': slotProps.data.score.positionVariation < 0,
                'variation-same': slotProps.data.score.positionVariation === 0,
              }"
              v-tooltip.top="
                `Variação de posição: ${slotProps.data.score.positionVariation > 0 ? '+' : ''}${slotProps.data.score.positionVariation}`
              "
            >
              <i v-if="slotProps.data.score.positionVariation > 0" class="pi pi-arrow-up"></i>
              <i v-else-if="slotProps.data.score.positionVariation < 0" class="pi pi-arrow-down"></i>
              <i v-else class="pi pi-minus"></i>
              <span class="variation-value">
                {{ Math.abs(slotProps.data.score.positionVariation) }}
              </span>
            </div>
            <div class="name-container">
              <i
                v-if="isFavoriteUser(slotProps.data.user.id)"
                class="pi pi-star-fill favorite-badge"
                v-tooltip.top="'Favorito'"
              ></i>
              <IconAndName
                class="clickable"
                :isShort="columnConfig === 'complete'"
                :name="slotProps.data.user.nickname"
                :isActive="activeProfile?.id === slotProps.data.user.id"
                @click="() => handleUserClick(slotProps.data.user)"
              />
            </div>
          </div>
        </div>
      </template>
    </PrimeColumn>
    <PrimeColumn field="score.points" header="Pts" style="text-align: center" sortable></PrimeColumn>
    <PrimeColumn field="score.exacts" sortable style="text-align: center">
      <template #header>
        <i v-tooltip.top="'Na mosca'" class="pi pi-bullseye"></i>
      </template>
    </PrimeColumn>
    <PrimeColumn
      v-if="isRound && columnConfig === 'complete'"
      field="score.oneScores"
      sortable
      style="text-align: center"
    >
      <template #header>
        <i v-tooltip.top="'Vencedor correto'" class="pi pi-check"></i>
      </template>
    </PrimeColumn>
    <PrimeColumn v-if="columnConfig === 'complete'" field="score.percentage" sortable>
      <template #header>
        <i v-tooltip.top="'Aproveitamento'" class="pi pi-percentage"></i>
      </template>
    </PrimeColumn>
    <PrimeColumn v-if="!isRound && columnConfig === 'complete'" field="score.extras.points" sortable>
      <template #header> <i v-tooltip.top="'Extras'" class="pi pi-plus"></i> </template>
    </PrimeColumn>
  </PrimeDataTable>
  <PrimeMessage v-if="error" class="error-message" severity="error" variant="outlined">
    Ops, houve um problema de comunicação com o servidor para buscar o ranking.
    <p>
      Certifique-se de que sua conexão está estável e tente novamente. Se o erro persistir, entre em contato com os
      administradores do Bolão.
    </p>
    <p>{{ error }}</p>
  </PrimeMessage>
  <UserTrackingModal
    :isOpen="isUserTrackingModalOpen"
    :isUserActive="activeProfile?.id === selectedUser?.id"
    :selectedUser="selectedUser"
    :handleCloseModal="() => ((isUserTrackingModalOpen = false), (selectedUser = null))"
  />
</template>
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import type { IUser } from '@/stores/activeProfile.types';
import type { TColumnsValue, TRowSpacingValue } from '@/stores/configuration.types';
import type { IRankingLine } from '@/stores/ranking.types';

import IconAndName from '@/components/IconAndName.vue';
import FavoritesService from '@/services/favorites';

import UserTrackingModal from './UserTrackingModal.vue';

const props = defineProps<{
  activeProfile: IUser | null;
  columnConfig: TColumnsValue;
  error: Error | null;
  isLoading: boolean;
  isRound: boolean;
  rankingData: IRankingLine[];
  rowSpacingConfig: TRowSpacingValue;
  showFavoritesOnly: boolean;
}>();

const emit = defineEmits<{
  'update:showFavoritesOnly': [value: boolean];
}>();

// ------ Refs ------
const isUserTrackingModalOpen = ref<boolean>(false);
const selectedUser = ref<IUser | null>(null);
const favorites = ref<number[]>([]);

// ------ Initialization ------
const favoritesService = new FavoritesService();

onMounted(() => {
  loadFavorites();
  // Listen for favorites-cleared event from ConfigModal
  window.addEventListener('favorites-cleared', loadFavorites);
});

onBeforeUnmount(() => {
  // Clean up event listener
  window.removeEventListener('favorites-cleared', loadFavorites);
});

// ------ Computed Properties ------
const filteredRankingData = computed(() => {
  if (!props.showFavoritesOnly || favorites.value.length === 0) {
    return props.rankingData;
  }

  return props.rankingData.filter((rankingLine) => {
    const isFavorite = favorites.value.includes(rankingLine.user.id);
    const isLoggedInUser = props.activeProfile && rankingLine.user.id === props.activeProfile.id;
    return isFavorite || isLoggedInUser;
  });
});

// ------ Functions ------
function handleUserClick(user: IUser) {
  isUserTrackingModalOpen.value = true;
  selectedUser.value = user;
}

function isActiveProfile(userId: number): boolean {
  return props.activeProfile?.id === userId;
}

function isFavoriteUser(userId: number): boolean {
  return favorites.value.includes(userId);
}

function loadFavorites() {
  if (!props.activeProfile) {
    favorites.value = [];
    return;
  }
  favorites.value = favoritesService.getFavorites(props.activeProfile.id);
}

// ------ Watches ------
watch(
  () => props.activeProfile,
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
    window.dispatchEvent(new Event('favorites-cleared'));
  }
});

watch(
  () => props.showFavoritesOnly,
  () => {
    loadFavorites();
  },
);

watch(favorites, (newFavorites) => {
  // If favorites filter is on but there are no favorites, turn off the filter
  if (props.showFavoritesOnly && newFavorites.length === 0) {
    emit('update:showFavoritesOnly', false);
  }
});
</script>
<style lang="scss" scoped>
:deep(tr) {
  td {
    padding: 0 !important;
  }
}
.row {
  display: flex;
  flex-direction: row;
  padding: var(--xs-spacing) var(--s-spacing);
}

.top-10-row {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--color-contrast) 10%, transparent) 0%,
    color-mix(in srgb, var(--color-contrast) 5%, transparent) 75%,
    transparent 100%
  );
  box-shadow: inset 3px 0 0 var(--bolao-c-blue3-t3);
}

.active-user-row {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--color-contrast) 20%, transparent) 0%,
    color-mix(in srgb, var(--color-contrast) 10%, transparent) 75%,
    transparent 100%
  );
  box-shadow: inset 3px 0 0 var(--bolao-c-mint);
  font-weight: bold;
}

.outer-position {
  display: flex;
  gap: var(--xs-spacing);
  align-items: center;
  position: relative;
  padding: var(--xs-spacing) 0;
  padding-left: var(--s-spacing);
  padding-right: var(--s-spacing);
  border-radius: 4px;
  transition: all 0.2s;
}

.position-number {
  font-weight: 600;
  width: 35px;
  padding-left: var(--s-spacing);
}

.position-variation {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font-size: 11px;
  line-height: 1;
  font-weight: 600;
  padding: 2px 4px;
  border-radius: 4px;
  background-color: color-mix(in srgb, var(--color-contrast) 15%, transparent);
  width: 30px;

  i {
    font-size: 9px;
  }

  .variation-value {
    font-size: 10px;
  }

  &.variation-up {
    color: var(--bolao-c-mint);
    background-color: color-mix(in srgb, var(--bolao-c-mint) 20%, transparent);
  }

  &.variation-down {
    color: var(--bolao-c-red);
    background-color: color-mix(in srgb, var(--bolao-c-red) 20%, transparent);
  }

  &.variation-same {
    color: var(--color-text);
    opacity: 0.6;
  }
}

.badge {
  position: absolute;
  left: 0px;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;

  &Online {
    @extend .badge;
    background-color: var(--bolao-c-mint);
    color: var(--bolao-c-mint);

    &::after {
      position: absolute;
      top: 0;
      left: 0;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      animation: ripple 2s infinite ease-in-out;
      border: 1px solid;
      content: '';
    }
  }

  &Offline {
    @extend .badge;

    background-color: var(--bolao-c-grey3);
    color: var(--bolao-c-red);
    opacity: 0.2;
  }
}

.name-container {
  position: relative;
}

.favorite-badge {
  position: absolute;
  top: -4px;
  left: -2px;
  font-size: 0.6rem;
  color: var(--bolao-c-gold);
  z-index: 1;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}

.clickable {
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    opacity: 0.8;
    text-decoration: underline;
  }
}
</style>
