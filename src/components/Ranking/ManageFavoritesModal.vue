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
    <EmptyFavorites v-else-if="favoriteUsers.length === 0" />
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

import UserService from '@/services/user';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useConfigurationStore } from '@/stores/configuration';
import { useNotificationStore } from '@/stores/notification';
import { useRankingStore } from '@/stores/ranking';

import NameTag from '../NameTag.vue';
import EmptyFavorites from './EmptyFavorites.vue';

const props = defineProps<{
  handleCloseModal: () => void;
  isOpen: boolean;
}>();

// ------ Refs ------
const isVisible = ref(false);

// ------ Initialization ------
const activeProfileStore = useActiveProfileStore();
const rankingStore = useRankingStore();
const configurationStore = useConfigurationStore();
const userService = new UserService();
const notificationStore = useNotificationStore();

// ------ Computed ------
const favorites = computed(() => activeProfileStore.activeProfile?.favorites || []);
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

  userService.updateFavorites([], updateCallback);
}

function removeFavorite(userId: number) {
  if (!activeProfile.value) return;

  const newFavorites = favorites.value.filter((id) => id !== userId);
  userService.updateFavorites(newFavorites, updateCallback);
}

function updateCallback(isSuccess: boolean) {
  if (isSuccess) {
    notificationStore.success('Favoritos atualizados com sucesso', 'success');
    console.log('Favorites updated successfully');
  } else {
    notificationStore.error('Falha ao atualizar favoritos', 'error');
    console.error('Failed to update favorites');
  }
}

// ------ Watches ------
watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
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
</style>
