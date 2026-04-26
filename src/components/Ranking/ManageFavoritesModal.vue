<template>
  <PrimeDialog
    v-model:visible="isVisible"
    dismissable-mask
    modal
    :draggable="false"
    :style="{ width: '900px' }"
    :breakpoints="{ '1280px': '75vw', '575px': '90vw' }"
  >
    <template #header>
      <h3 class="favorites-title">
        <i class="pi pi-star-fill" />
        Favoritos
      </h3>
    </template>

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
        <span class="favorite-name">
          <NameTag
            :is-clickable="true"
            :user="user"
          />
        </span>
        <i
          class="pi pi-trash delete-icon"
          title="Remover favorito"
          @click="removeFavorite(user.id)"
        />
      </div>
    </div>
    <PrimeButton
      v-if="favoriteUsers.length > 0"
      style="margin-top: var(--l-spacing)"
      label="Remover Todos"
      severity="danger"
      icon="pi pi-trash"
      @click="handleClearFavorites"
    />
  </PrimeDialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import type { IUser } from '@/stores/activeProfile.types';

import FavoritesService from '@/services/favorites';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useConfigurationStore } from '@/stores/configuration';
import { useRankingStore } from '@/stores/ranking';

import NameTag from '../NameTag.vue';

const props = defineProps<{
  handleCloseModal: () => void;
  isOpen: boolean;
}>();

// ------ Refs ------
const isVisible = ref(false);
const favorites = ref<number[]>([]);

// ------ Initialization ------
const activeProfileStore = useActiveProfileStore();
const rankingStore = useRankingStore();
const configurationStore = useConfigurationStore();
const favoritesService = new FavoritesService();

// ------ Computed ------
const activeProfile = computed(() => activeProfileStore.activeProfile);
const seasonRanking = computed(() => rankingStore.seasonRanking);
const isLoadingRounds = computed(() => configurationStore.isLoading || rankingStore.isLoadingRounds);
const isLoadingSeason = computed(() => configurationStore.isLoading || rankingStore.isLoadingSeason);
const isLoadingActiveProfile = computed(() => activeProfileStore.isLoading);

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

// ------ Functions ------
function handleClearFavorites() {
  if (!activeProfile.value) return;

  favoritesService.clearAllFavorites(activeProfile.value.id);
  loadFavorites();
  // Trigger event for RankingTable to update
  window.dispatchEvent(new Event('favorites-cleared'));
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

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      loadFavorites();
      isVisible.value = true;
    }
  },
);

watch(isVisible, (newValue) => {
  if (!newValue) {
    props.handleCloseModal();
  }
});
</script>

<style lang="scss" scoped>
.favorites-title {
  display: flex;
  gap: var(--s-spacing);
  align-items: center;
  margin: 0 0 var(--m-spacing) 0;
  font-size: var(--l-font-size);
  font-weight: 600;
  color: var(--bolao-c-gold);
}

.favorites-list {
  display: flex;
  flex-direction: column;
  gap: var(--xs-spacing);
}

.favorite-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  padding: var(--xs-spacing);
  color: var(--bolao-c-white);
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.2);
  }
}

.favorites-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--xxl-spacing);
  color: var(--bolao-c-grey1-t2);
  text-align: center;

  i {
    margin-bottom: var(--m-spacing);
    font-size: 4rem;
  }

  p {
    max-width: 400px;
    margin: var(--xs-spacing) 0;
    font-size: var(--s-font-size);
  }
}
</style>
