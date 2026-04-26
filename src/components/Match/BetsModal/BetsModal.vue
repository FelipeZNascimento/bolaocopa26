<template>
  <PrimeDialog
    v-model:visible="isVisible"
    dismissable-mask
    modal
    :draggable="false"
    :style="{
      width: '1024px',
      height: '70vh',
      backgroundColor: 'var(--bolao-c-blue4)',
    }"
    :breakpoints="{ '1024px': '90vw', '575px': '95vw' }"
    content-class="content-class"
  >
    <template #header>
      <div
        style="
          display: flex;
          gap: var(--s-spacing);
          justify-content: center;
          align-items: center;
          width: 100%;
        "
      >
        <span v-if="!isMobile && match">
          {{ clockStore.getRoundName(match.round) }} -
        </span>
        <img
          class="team-shield-image"
          :src="`https://assets.omegafox.me/copa/countries_flags/${match.homeTeam.isoCode.toLowerCase()}.png`"
          :alt="`${match.homeTeam.name} Shield`"
          style="height: 20px"
        />
        {{
          match
            ? `${match.homeTeam.abbreviation} ${match.score?.home ?? 0} x ${match.score?.away ?? 0} ${match.awayTeam.abbreviation}`
            : ""
        }}
        <img
          class="team-shield-image"
          :src="`https://assets.omegafox.me/copa/countries_flags/${match.awayTeam.isoCode.toLowerCase()}.png`"
          :alt="`${match.awayTeam.name} Shield`"
          style="height: 20px"
        />
      </div>
    </template>
    <template #default>
      <BetsModalMobileView
        v-if="isMobile"
        :match="match"
        :hit-level="hitLevel"
        :is-match-started="isMatchStarted"
      />
      <BetsModalDesktopView
        v-else
        :match="match"
        :hit-level="hitLevel"
        :is-match-started="isMatchStarted"
      />
      <div>
        <div header="Apostas">
          <div v-if="activeProfileStore.activeProfile" class="favorites-filter">
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
              :style="{
                color: showFavoritesOnly
                  ? 'var(--bolao-c-gold)'
                  : 'var(--bolao-c-grey1-t2)',
              }"
              @click="showFavoritesOnly = true"
            >
              <i
                :class="{
                  'pi pi-star-fill': showFavoritesOnly,
                  'pi pi-star': !showFavoritesOnly,
                }"
              />
              Favoritos
            </span>
          </div>
          <div class="bets-outer">
            <BetsColumn
              :bets="filterBets(match.bets, 'exact')"
              :column-value="BETS_VALUES.AWAY_EASY"
              :active-user-bet="
                filterBets(
                  match.loggedUserBets ? [match.loggedUserBets] : null,
                  'exact',
                )
              "
              :hit-level="HIT_LEVELS.exactScore"
            />
            <BetsColumn
              :bets="filterBets(match.bets, 'oneScore')"
              :column-value="BETS_VALUES.AWAY_EASY"
              :active-user-bet="
                filterBets(
                  match.loggedUserBets ? [match.loggedUserBets] : null,
                  'oneScore',
                )
              "
              :hit-level="HIT_LEVELS.oneScore"
            />
            <BetsColumn
              :bets="filterBets(match.bets, 'winnerOnly')"
              :column-value="BETS_VALUES.AWAY_EASY"
              :active-user-bet="
                filterBets(
                  match.loggedUserBets ? [match.loggedUserBets] : null,
                  'winnerOnly',
                )
              "
              :hit-level="HIT_LEVELS.winnerOnly"
            />
            <BetsColumn
              :bets="filterBets(match.bets, 'miss')"
              :column-value="BETS_VALUES.AWAY_EASY"
              :active-user-bet="
                filterBets(
                  match.loggedUserBets ? [match.loggedUserBets] : null,
                  'miss',
                )
              "
              :hit-level="HIT_LEVELS.miss"
            />
          </div>
        </div>
      </div>
    </template>
  </PrimeDialog>
</template>
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";

import type { IBet, IMatch } from "@/stores/matches.types";

import { BETS_VALUES, HIT_LEVELS, type HitLevel } from "@/constants/bets";
import FavoritesService from "@/services/favorites";
import { useViewport } from "@/services/viewport";
import { useActiveProfileStore } from "@/stores/activeProfile";
import { useClockStore } from "@/stores/clock";

import BetsColumn from "./BetsColumn.vue";
import BetsModalDesktopView from "./BetsModalDesktopView.vue";
import BetsModalMobileView from "./BetsModalMobileView.vue";

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
const { isMobile } = useViewport();

onMounted(() => {
  loadFavorites();
  window.addEventListener("favorites-cleared", loadFavorites);
  window.addEventListener("favorites-updated", loadFavorites);
});

onUnmounted(() => {
  window.removeEventListener("favorites-cleared", loadFavorites);
  window.removeEventListener("favorites-updated", loadFavorites);
});

// ------ Computed Properties ------
const isMatchStarted = computed(() => {
  return clockStore.currentTimestamp >= props.match.timestamp;
});

// ------ Functions ------
function filterBets(bets: IBet[] | null, hitLevel: HitLevel) {
  if (!bets) return [];

  const filteredBets = bets.filter((bet) => {
    if (showFavoritesOnly.value && activeProfileStore.activeProfile) {
      if (
        !isFavoriteUser(bet.user.id) &&
        bet.user.id !== activeProfileStore.activeProfile?.id
      ) {
        return false;
      }
    }

    const homeScoreMatch = bet.scoreHome === props.match.score.home;
    const awayScoreMatch = bet.scoreAway === props.match.score.away;

    if (hitLevel === "exact") {
      return homeScoreMatch && awayScoreMatch;
    }

    // Determine the winner/outcome of the bet and actual match
    const betHomeWon = bet.scoreHome > bet.scoreAway;
    const betAwayWon = bet.scoreAway > bet.scoreHome;
    const betDraw = bet.scoreHome === bet.scoreAway;

    const actualHomeWon = props.match.score.home > props.match.score.away;
    const actualAwayWon = props.match.score.away > props.match.score.home;
    const actualDraw = props.match.score.home === props.match.score.away;

    const gotWinnerRight =
      (betHomeWon && actualHomeWon) ||
      (betAwayWon && actualAwayWon) ||
      (betDraw && actualDraw);

    if (hitLevel === "oneScore" && gotWinnerRight) {
      return (
        (homeScoreMatch && !awayScoreMatch) ||
        (!homeScoreMatch && awayScoreMatch)
      );
    }

    if (hitLevel === "winnerOnly" && gotWinnerRight) {
      // Got the winner right but not exact score or one score
      return !homeScoreMatch && !awayScoreMatch;
    }

    if (hitLevel === "miss") {
      // Didn't get the winner right
      return !gotWinnerRight;
    }

    return false;
  });

  return filteredBets;
}

function isFavoriteUser(userId: number): boolean {
  return favorites.value.includes(userId);
}

function loadFavorites() {
  if (!activeProfileStore.activeProfile) {
    favorites.value = [];
    return;
  }
  favorites.value = favoritesService.getFavorites(
    activeProfileStore.activeProfile.id,
  );
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
.toggle {
  color: var(--bolao-c-grey1-t2);
  cursor: pointer;
  transition: 0.2s;
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

.favorites-filter {
  display: flex;
  gap: var(--m-spacing);
  justify-content: center;
  padding: var(--s-spacing);
}
</style>

<style lang="scss">
/* Unscoped styles for PrimeDialog content customization */
.content-class {
  padding: 0 !important;
  scrollbar-gutter: stable;
}
</style>
