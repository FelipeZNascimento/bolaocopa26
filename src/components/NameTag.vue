<template>
  <div class="outer" :class="{ 'outer-short': isShort }" @click="handleUserClick">
    <i v-if="isFavorite()" class="pi pi-star-fill favorite-badge" v-tooltip.top="'Favorito'"></i>
    <span class="username" :class="{ active: activeProfile?.id === user.id, clickable: isClickable }">
      {{ user.nickname }}
    </span>
  </div>
  <UserTrackingModal
    :isOpen="isUserTrackingModalOpen"
    :isUserActive="activeProfile?.id === user?.id"
    :selectedUser="user"
    :handleCloseModal="() => (isUserTrackingModalOpen = false)"
  />
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';

import type { IUser } from '@/stores/activeProfile.types';

import UserTrackingModal from '@/components/UserTrackingModal.vue';
import FavoritesService from '@/services/favorites';
import { useActiveProfileStore } from '@/stores/activeProfile';

const props = withDefaults(
  defineProps<{
    isClickable?: boolean;
    isShort?: boolean;
    user: Pick<IUser, 'id' | 'nickname'>;
  }>(),
  {
    isClickable: false,
    isShort: false,
  },
);
// ------ Refs ------
const isUserTrackingModalOpen = ref<boolean>(false);

// ------ Initialization ------
const favoritesService = new FavoritesService();
const activeProfileStore = useActiveProfileStore();

// ------ Computed ------
const activeProfile = computed(() => activeProfileStore.activeProfile);

// ------ Functions ------
function handleUserClick() {
  if (!props.isClickable) {
    return;
  }

  isUserTrackingModalOpen.value = true;
}

function isFavorite(): boolean {
  if (!activeProfile.value) {
    return false;
  }

  return favoritesService.isFavorite(activeProfile.value.id, props.user.id);
}
</script>
<style lang="scss" scoped>
.outer-short {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 120px;
}

.outer {
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: row;
  padding: 0 var(--s-spacing);
}

.usericon {
  width: 20px;
}

.active {
  font-weight: bold;
}

.favorite-badge {
  // position: absolute;
  // top: -4px;
  // left: -2px;
  font-size: var(--xs-font-size);
  color: var(--bolao-c-gold);
  padding-right: var(--xs-spacing);
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
