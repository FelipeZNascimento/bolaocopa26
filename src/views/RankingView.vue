<template>
  <PaginatorComponent />
  <div class="outer">
    <div class="ranking-outer">
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
      <RankingTable
        v-model:show-favorites-only="showFavoritesOnly"
        :is-round="isRoundRanking"
        :is-loading="isRoundRanking ? isLoadingRounds : isLoadingSeason"
        :ranking-data="isRoundRanking ? selectedRoundRanking : seasonRanking"
        column-config="complete"
        row-spacing-config="normal"
        :active-profile="activeProfile"
        :error="isRoundRanking ? errorSeason : errorRounds"
      />
    </div>
    <div class="favorites-outer">
      <div class="favorites-panel">
        <h3 class="favorites-title">
          <i class="pi pi-star-fill" />
          Favoritos
        </h3>
        <div v-if="isLoadingActiveProfile || isLoadingRounds || isLoadingSeason">
          <PrimeSkeleton style="width: 100%; height: 200px" />
        </div>
        <div
          v-else-if="favoriteUsers.length === 0"
          class="favorites-empty"
        >
          <i class="pi pi-info-circle" />
          <p>Nenhum favorito adicionado</p>
          <p>Para adicionar alguém aos seus favoritos, clique no usuário e ative a estrela no topo das estatísticas.</p>
        </div>
        <div
          v-else
          class="favorites-list"
        >
          <div
            v-for="user in favoriteUsers"
            :key="user.id"
            class="favorite-item"
          >
            <span class="favorite-name">{{ user.nickname }}</span>
            <i
              class="pi pi-trash delete-icon"
              title="Remover favorito"
              @click="removeFavorite(user.id)"
            />
          </div>
        </div>
        <PrimeButton
          style="margin-top: var(--l-spacing)"
          label="Remover Todos"
          severity="danger"
          icon="pi pi-trash"
          @click="handleClearFavorites"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import type { IUser } from '@/stores/activeProfile.types';

import PaginatorComponent from '@/components/PaginatorComponent.vue';
import RankingTable from '@/components/Ranking/RankingTable.vue';
import FavoritesService from '@/services/favorites';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useConfigurationStore } from '@/stores/configuration';
import { useNotificationStore } from '@/stores/notification';
import { useRankingStore } from '@/stores/ranking';

// ------ Refs ------
const isRoundRanking = ref(false);
const showFavoritesOnly = ref(false);
const favorites = ref<number[]>([]);

// ------ Initialization ------
const configurationStore = useConfigurationStore();
const rankingStore = useRankingStore();
const activeProfileStore = useActiveProfileStore();
const favoritesService = new FavoritesService();
const notificationStore = useNotificationStore();

onMounted(() => {
  loadFavorites();

  // Listen for favorites-cleared event from ConfigModal
  window.addEventListener('favorites-cleared', loadFavorites);
});

onBeforeUnmount(() => {
  // Clean up event listener
  window.removeEventListener('favorites-cleared', loadFavorites);
});

// ------ Computed Properties  ------
const errorRounds = computed(() => rankingStore.errorRounds);
const errorSeason = computed(() => rankingStore.errorSeason);
const isLoadingRounds = computed(() => configurationStore.isLoading || rankingStore.isLoadingRounds);
const selectedRound = computed(() => configurationStore.selectedRound);
const isLoadingSeason = computed(() => configurationStore.isLoading || rankingStore.isLoadingSeason);
const isLoadingActiveProfile = computed(() => activeProfileStore.isLoading);
const seasonRanking = computed(() => rankingStore.seasonRanking);
const selectedRoundRanking = computed(
  () => rankingStore.roundsRanking?.find((roundRanking) => roundRanking.round === selectedRound.value)?.ranking || [],
);
const activeProfile = computed(() => activeProfileStore.activeProfile);

const favoriteUsers = computed(() => {
  if (favorites.value.length === 0 || seasonRanking.value.length === 0) {
    return [];
  }

  // Map favorite IDs to user objects from ranking data
  return favorites.value
    .map((userId) => {
      const rankingLine = seasonRanking.value.find((line) => line.user.id === userId);
      return rankingLine ? rankingLine.user : null;
    })
    .filter((user): user is IUser => user !== null);
});

// ------ Functions  ------
function handleClearFavorites() {
  if (activeProfile.value) {
    favoritesService.clearAllFavorites(activeProfile.value.id);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('favorites-cleared'));
  }
  notificationStore.success('Todos os favoritos foram removidos');
}
function loadFavorites() {
  if (!activeProfile.value) {
    favorites.value = [];
    return;
  }
  favorites.value = favoritesService.getFavorites(activeProfile.value.id);
}

function removeFavorite(userId: number) {
  if (!activeProfile.value) return;

  favoritesService.removeFavorite(activeProfile.value.id, userId);
  loadFavorites();
  // Trigger event for RankingTable to update
  window.dispatchEvent(new Event('favorites-cleared'));
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
</script>
<style lang="scss" scoped>
.outer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  padding: var(--m-spacing);
  gap: var(--xxl-spacing);
}
.ranking-outer {
  display: flex;
  flex: 2;
  flex-direction: column;
  align-items: center;
  margin-top: var(--xxl-spacing);
  box-shadow: var(--drop-shadow);
  border-radius: var(--border-radius);
  padding-bottom: var(--xl-spacing);
  background-color: var(--bolao-c-blue4);
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

.favorites-outer {
  display: flex;
  flex: 1;
  justify-content: center;
  margin-top: var(--xxl-spacing);
  height: 100%;
  position: sticky;
  top: 10vh;
  right: 0;
}

.favorites-panel {
  width: 100%;
  background-color: var(--bolao-c-blue4);
  border-radius: var(--border-radius);
  box-shadow: var(--drop-shadow);
  padding: var(--m-spacing);
  text-align: center;
}

.favorites-title {
  display: flex;
  align-items: center;
  gap: var(--s-spacing);
  margin: 0 0 var(--m-spacing) 0;
  font-size: var(--l-font-size);
  font-weight: 600;
  color: var(--bolao-c-gold);
}

.favorites-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s-spacing);
  padding: var(--xl-spacing) var(--m-spacing);
  color: var(--bolao-c-grey1-t2);
  text-align: center;

  i {
    font-size: var(--xl-font-size);
  }

  p {
    margin: 0;
    font-size: var(--s-font-size);
  }
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

.favorites-list {
  display: flex;
  flex-direction: column;
  gap: var(--xs-spacing);
}

.favorite-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--s-spacing) var(--m-spacing);
  background-color: var(--bolao-c-blue2-t2);
  border-radius: 4px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--bolao-c-blue2);
  }
}

.favorite-name {
  font-size: var(--m-font-size);
  font-weight: 500;
  color: var(--bolao-c-white);
}

.delete-icon {
  color: var(--bolao-c-white);
  cursor: pointer;
  transition: transform 0.2s ease;
  padding: var(--xs-spacing);

  &:hover {
    transform: scale(1.2);
  }
}
</style>
