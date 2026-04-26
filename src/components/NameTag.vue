<template>
  <div
    class="outer"
    :class="{ 'outer-short': isShort }"
    @click="handleUserClick"
  >
    <i
      v-if="isFavorite()"
      v-tooltip.top="'Favorito'"
      class="pi pi-star-fill favorite-badge"
    />
    <span
      class="username"
      :class="{ active: activeProfile?.id === user.id, clickable: isClickable }"
    >
      {{ user.nickname }}
    </span>
  </div>
  <UserTrackingModal
    :is-open="isUserTrackingModalOpen"
    :is-user-active="activeProfile?.id === user?.id"
    :selected-user="user"
    :handle-close-modal="() => (isUserTrackingModalOpen = false)"
  />
</template>
<script lang="ts" setup>
import { computed, ref } from "vue";

import type { IUser } from "@/stores/activeProfile.types";

import UserTrackingModal from "@/components/UserTrackingModal.vue";
import FavoritesService from "@/services/favorites";
import { useActiveProfileStore } from "@/stores/activeProfile";

const props = withDefaults(
  defineProps<{
    isClickable?: boolean;
    isShort?: boolean;
    user: Pick<IUser, "id" | "nickname">;
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
  min-width: 0;
  max-width: 100%;

  .username {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.outer {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  max-width: 100%;
}

.usericon {
  width: 20px;
}

.active {
  font-weight: bold;
}

.favorite-badge {
  z-index: 1;
  padding-right: var(--xs-spacing);
  font-size: var(--xs-font-size);
  color: var(--bolao-c-gold);
  cursor: pointer;
  filter: drop-shadow(0 1px 2px rgb(0 0 0 / 30%));
}

.username {
  font-size: var(--s-font-size);

  @media (width <= 768px) {
    font-size: var(--xs-font-size);
  }
}

.clickable {
  text-decoration: underline dotted;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    text-decoration: underline;
    opacity: 0.8;
  }
}
</style>
