<template>
  <PrimeDialog
    dismissableMask
    modal
    v-model:visible="isVisible"
    :draggable="false"
    :style="{ width: '1024px', height: '70vh', backgroundColor: 'var(--bolao-c-blue4)' }"
    :breakpoints="{ '1280px': '75vw', '575px': '90vw' }"
    contentClass="content-class"
  >
    <template #default>
      <div class="teams-outer">
        <ScoreComponent
          :isScoreModalOpen="true"
          :match="match"
          :activeUserBet="match.loggedUserBets"
          :isMatchStarted="isMatchStarted"
        />

        <ClockComponent
          style="margin-left: var(--l-spacing)"
          :timestamp="match.timestamp"
          :status="match.status"
          :clock="match.timestamp ? clockStore.getFormattedTime(match.timestamp) : null"
          :hitLevel="hitLevel"
          :isMatchStarted="isMatchStarted"
        />
        <PrimeButton
          :icon="showMatchInfo ? 'pi pi-minus' : 'pi pi-plus'"
          class="match-info-toggle"
          label="Info"
          severity=""
          aria-label="Search"
          @click="toggleMatchInfo"
        />
      </div>
      <div>
        <div header="Informações">
          <Transition name="expand">
            <div v-show="showMatchInfo" class="match-info-wrapper">
              <div class="match-info">
                <div class="info-section">
                  <h3><i class="pi pi-building"></i> Estádio</h3>
                  <p class="info-title">{{ match.stadium.name }}</p>
                  <p class="info-detail">{{ match.stadium.city }}, {{ match.stadium.country }}</p>
                  <p class="info-detail">Capacidade: {{ match.stadium.capacity.toLocaleString('pt-BR') }} pessoas</p>
                </div>

                <div class="info-section">
                  <h3><i class="pi pi-user"></i> Árbitro</h3>
                  <p class="info-title">{{ match.referee.name }}</p>
                  <p class="info-detail">{{ match.referee.country }}</p>
                </div>

                <div class="info-section">
                  <h3><i class="pi pi-calendar"></i> Data e Hora</h3>
                  <p class="info-title">{{ formatDate(match.timestamp) }}</p>
                  <p class="info-detail">{{ formatTime(match.timestamp) }}</p>
                </div>

                <div class="info-section">
                  <h3><i class="pi pi-flag"></i> Rodada</h3>
                  <p class="info-title">{{ getRoundName(match.round) }}</p>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <div header="Apostas">
          <div v-if="activeProfileStore.activeProfile" class="favorites-filter">
            <span class="toggle" :class="{ activeToggle: !showFavoritesOnly }" @click="showFavoritesOnly = false">
              <i class="pi pi-list"></i> Todos
            </span>
            <span
              class="toggle"
              :class="{ activeToggle: showFavoritesOnly }"
              :style="{ color: showFavoritesOnly ? 'var(--bolao-c-gold)' : 'var(--bolao-c-grey1-t2)' }"
              @click="showFavoritesOnly = true"
            >
              <i :class="{ 'pi pi-star-fill': showFavoritesOnly, 'pi pi-star': !showFavoritesOnly }"></i> Favoritos
            </span>
          </div>
          <div class="bets-outer">
            <BetsColumn
              :bets="filterBets(match.bets, 'exact')"
              :columnValue="BETS_VALUES.AWAY_EASY"
              :activeUserBet="filterBets(match.loggedUserBets ? [match.loggedUserBets] : null, 'exact')"
              :hitLevel="HIT_LEVELS.exactScore"
            />
            <BetsColumn
              :bets="filterBets(match.bets, 'oneScore')"
              :columnValue="BETS_VALUES.AWAY_EASY"
              :activeUserBet="filterBets(match.loggedUserBets ? [match.loggedUserBets] : null, 'oneScore')"
              :hitLevel="HIT_LEVELS.oneScore"
            />
            <BetsColumn
              :bets="filterBets(match.bets, 'winnerOnly')"
              :columnValue="BETS_VALUES.AWAY_EASY"
              :activeUserBet="filterBets(match.loggedUserBets ? [match.loggedUserBets] : null, 'winnerOnly')"
              :hitLevel="HIT_LEVELS.winnerOnly"
            />
            <BetsColumn
              :bets="filterBets(match.bets, 'miss')"
              :columnValue="BETS_VALUES.AWAY_EASY"
              :activeUserBet="filterBets(match.loggedUserBets ? [match.loggedUserBets] : null, 'miss')"
              :hitLevel="HIT_LEVELS.miss"
            />
          </div>
        </div>
      </div>
    </template>

    <!-- <template #footer>a</template> -->
  </PrimeDialog>
</template>
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

import type { IBet, IMatch } from '@/stores/matches.types';

import { BETS_VALUES, HIT_LEVELS, type HitLevel } from '@/constants/bets';
import { ROUNDS } from '@/constants/rounds';
import FavoritesService from '@/services/favorites';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useClockStore } from '@/stores/clock';

import ClockComponent from '../ClockComponent.vue';
import ScoreComponent from '../ScoreComponent.vue';
import BetsColumn from './BetsColumn.vue';

const props = defineProps<{
  handleCloseModal: () => void;
  hitLevel: HitLevel | null;
  isOpen: boolean;
  match: IMatch;
}>();

// ------ Initialization ------
const clockStore = useClockStore();
const activeProfileStore = useActiveProfileStore();
const favoritesService = new FavoritesService();
const isVisible = ref(false);
const showFavoritesOnly = ref(false);
const favorites = ref<number[]>([]);
const showMatchInfo = ref(false);

onMounted(() => {
  loadFavorites();
  window.addEventListener('favorites-cleared', loadFavorites);
});

onUnmounted(() => {
  window.removeEventListener('favorites-cleared', loadFavorites);
});

// ------ Computed Properties ------
const isMatchStarted = computed(() => {
  return clockStore.currentTimestamp >= props.match.timestamp;
});

// ------ Functions ------
function filterBets(bets: IBet[] | null, hitLevel: HitLevel) {
  if (!bets) return [];

  let filteredBets = bets.filter((bet) => {
    const homeScoreMatch = bet.scoreHome === props.match.score.home;
    const awayScoreMatch = bet.scoreAway === props.match.score.away;

    if (hitLevel === 'exact') {
      return homeScoreMatch && awayScoreMatch;
    }

    // Determine the winner/outcome of the bet and actual match
    const betHomeWon = bet.scoreHome > bet.scoreAway;
    const betAwayWon = bet.scoreAway > bet.scoreHome;
    const betDraw = bet.scoreHome === bet.scoreAway;

    const actualHomeWon = props.match.score.home > props.match.score.away;
    const actualAwayWon = props.match.score.away > props.match.score.home;
    const actualDraw = props.match.score.home === props.match.score.away;

    const gotWinnerRight = (betHomeWon && actualHomeWon) || (betAwayWon && actualAwayWon) || (betDraw && actualDraw);

    if (hitLevel === 'oneScore' && gotWinnerRight) {
      return (homeScoreMatch && !awayScoreMatch) || (!homeScoreMatch && awayScoreMatch);
    }

    if (hitLevel === 'winnerOnly' && gotWinnerRight) {
      // Got the winner right but not exact score or one score
      return !homeScoreMatch && !awayScoreMatch;
    }

    if (hitLevel === 'miss') {
      // Didn't get the winner right
      return !gotWinnerRight;
    }

    return false;
  });

  // Apply favorites filter if enabled
  if (showFavoritesOnly.value && activeProfileStore.activeProfile) {
    filteredBets = filteredBets.filter(
      (bet) => isFavoriteUser(bet.user.id) || bet.user.id === activeProfileStore.activeProfile?.id,
    );
  }

  return filteredBets;
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    year: 'numeric',
  });
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getRoundName(round: number): string {
  const roundObj = ROUNDS.find((r) => r.num === round);
  return roundObj ? roundObj.display : `Rodada ${round}`;
}

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

function toggleMatchInfo() {
  showMatchInfo.value = !showMatchInfo.value;
}

// ------ Watches ------
watch(
  () => props.isOpen,
  async (newValue) => {
    if (newValue) {
      isVisible.value = true;
    }
  },
);

watch(isVisible, async (newValue) => {
  if (!newValue) {
    props.handleCloseModal();
  }
});

watch(
  () => activeProfileStore.activeProfile,
  (newProfile) => {
    if (newProfile) {
      loadFavorites();
    }
  },
);

watch(favorites, (newFavorites) => {
  // If favorites filter is on but there are no favorites, turn off the filter
  if (showFavoritesOnly.value && newFavorites.length === 0) {
    showFavoritesOnly.value = false;
  }
});
</script>
<style lang="scss" scoped>
.teams-outer {
  display: flex;
  padding: var(--m-spacing);
  background-color: var(--bolao-c-blue3-t2);
  border-radius: var(--border-radius);
}

.toggle {
  cursor: pointer;
  transition: 0.2s;
  color: var(--bolao-c-grey1-t2);
}

.activeToggle {
  color: var(--bolao-c-white);
}

.team-column {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
}

.bets-outer {
  display: flex;
  overflow-x: hidden !important;
}

.content-class {
  padding: 0 !important;
  padding-left: var(--l-spacing) !important;
  overflow-x: hidden !important;
  scrollbar-gutter: stable;
  justify-items: center;
}

.favorites-filter {
  display: flex;
  justify-content: center;
  gap: var(--m-spacing);
  padding: var(--s-spacing);
}

.match-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--l-spacing);
  padding: var(--l-spacing) 0;
}

.info-section {
  background-color: var(--bolao-c-blue3-t2);
  padding: var(--m-spacing);
  border-radius: var(--border-radius);
}

.info-section h3 {
  color: var(--bolao-c-gold);
  font-size: 0.9rem;
  margin-bottom: var(--m-spacing);
  display: flex;
  align-items: center;
  gap: var(--s-spacing);
}

.info-section .info-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--bolao-c-white);
  margin-bottom: var(--s-spacing);
}

.info-section .info-detail {
  color: var(--bolao-c-grey1-t2);
  font-size: 0.9rem;
  margin-bottom: var(--xs-spacing);
}

.match-info-toggle {
  display: flex;
  justify-content: center;
  margin-left: var(--l-spacing);
  border-radius: var(--border-radius) !important;
  height: var(--match-list-height);
}

.match-info-wrapper {
  overflow: hidden;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.4s ease;
  max-height: 500px;
  opacity: 1;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
