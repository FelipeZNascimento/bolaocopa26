<template>
  <div
    class="bets-column"
    :class="{
      'green-bg': isExactColumn,
      'blue-bg': isOneScoreColumn,
      'orange-bg': isWinnerOnlyColumn,
      'red-bg': isMissColumn,
    }"
  >
    <p class="bets-column-header">{{ HIT_LEVELS_LABELS[props.hitLevel] }}</p>
    <!-- Render active user bet first -->
    <div class="bets-line active" v-for="bet in activeUserBet" :key="bet.id">
      <div class="nickname">
        {{ bet.user.nickname }}
      </div>
      <div class="scores">{{ bet.scoreHome }} x {{ bet.scoreAway }}</div>
    </div>
    <!-- Render remaining bets -->
    <div class="bets-line" v-for="bet in bets" :key="bet.id">
      <div class="nickname">
        <i v-if="isFavoriteUser(bet.user.id)" class="pi pi-star-fill favorite-badge" v-tooltip.top="'Favorito'"></i>
        {{ bet.user.nickname }}
      </div>
      <div class="scores">{{ bet.scoreHome }} x {{ bet.scoreAway }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

import type { IBet } from '@/stores/matches.types';

import { HIT_LEVELS_LABELS, type HitLevel } from '@/constants/bets';
import FavoritesService from '@/services/favorites';
import { useActiveProfileStore } from '@/stores/activeProfile';

const props = defineProps<{
  activeUserBet: IBet[];
  bets: IBet[];
  hitLevel: HitLevel;
}>();

// ------ Initialization ------
const activeProfileStore = useActiveProfileStore();
const favoritesService = new FavoritesService();
const favorites = ref<number[]>([]);

onMounted(() => {
  loadFavorites();
  window.addEventListener('favorites-cleared', loadFavorites);
});

onUnmounted(() => {
  window.removeEventListener('favorites-cleared', loadFavorites);
});

// ------ Computed Properties ------
const isExactColumn = computed(() => props.hitLevel === 'exact');
const isOneScoreColumn = computed(() => props.hitLevel === 'oneScore');
const isWinnerOnlyColumn = computed(() => props.hitLevel === 'winnerOnly');
const isMissColumn = computed(() => props.hitLevel === 'miss');

// ------ Functions ------
function isFavoriteUser(userId: number): boolean {
  return favorites.value.includes(userId);
}

function loadFavorites() {
  if (!activeProfileStore.activeProfile) {
    favorites.value = [];
    return;
  }
  favorites.value = favoritesService.getFavorites(activeProfileStore.activeProfile.id);
}

// ------ Watches ------
watch(
  () => activeProfileStore.activeProfile,
  (newProfile) => {
    if (newProfile) {
      loadFavorites();
    }
  },
);
</script>

<style lang="scss" scoped>
.bets-column {
  display: flex;
  flex: 1 0 0;
  min-width: 0;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  border: 1px solid var(--bolao-c-grey1-t1);
  padding: var(--xs-spacing);
}

.active {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-white) 20%, transparent) 0%,
    color-mix(in srgb, var(--bolao-c-white) 10%, transparent) 75%,
    transparent 100%
  );
  box-shadow: inset 3px 0 0 var(--bolao-c-white);

  .nickname,
  .scores {
    font-weight: bold;
    color: var(--bolao-c-white);
  }
}

.green-bg {
  background-color: var(--bolao-c-green-t2);
}

.blue-bg {
  background-color: var(--bolao-c-blue-t2);
}

.orange-bg {
  background-color: var(--bolao-c-orange-t2);
}

.red-bg {
  background-color: var(--bolao-c-red-t2);
}

.bets-column-header {
  text-align: center;
  width: 100%;
  font-size: var(--m-font-size);
  font-weight: bold;
}

.bets-line {
  display: flex;
  padding: var(--xxs-spacing) var(--s-spacing);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
}

.nickname {
  position: relative;
  flex: 3;
  overflow: hidden;
  text-overflow: ellipsis;
}

.favorite-badge {
  font-size: 0.6rem;
  color: var(--bolao-c-gold);
  z-index: 1;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}

.scores {
  flex: 1;
  text-align: right;
}
</style>
