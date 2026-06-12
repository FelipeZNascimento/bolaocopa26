<template>
  <div header="Apostas">
    <div
      v-if="activeProfile && isMatchStarted"
      class="favorites-filter"
    >
      <span
        class="toggle"
        :class="{ activeToggle: !showFavoritesOnly }"
        @click="showFavoritesOnly = false"
      >
        <i class="pi pi-list" /> {{ t('ranking.toggle.all') }}
      </span>
      <span
        class="toggle"
        :class="{ activeToggle: showFavoritesOnly }"
        :style="{
          color: showFavoritesOnly ? 'var(--bolao-c-gold)' : 'var(--bolao-c-grey1-t2)',
        }"
        @click="showFavoritesOnly = true"
      >
        <i
          :class="{
            'pi pi-star-fill': showFavoritesOnly,
            'pi pi-star': !showFavoritesOnly,
          }"
        />
        {{ t('ranking.toggle.favorites') }}
      </span>
    </div>
    <div
      v-if="isMatchStarted"
      class="bets-outer"
    >
      <BetsFeed
        :bets="betsWithOutcome"
        :points-awarded="props.match.pointsAwarded"
      />
    </div>
    <div
      v-else
      class="no-bets-message"
    >
      <p v-if="countdown">{{ t('moreInfoModal.countdownMessage', { countdown }) }}</p>
      <i class="pi pi-clock" />
      <p>{{ t('moreInfoModal.betsAvailable') }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type { IBet, IMatch } from '@/stores/matches.types';

import { HIT_LEVELS, type THitLevel } from '@/constants/bets';
import UserService from '@/services/user.ts';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useClockStore } from '@/stores/clock';

import type { BetWithOutcome } from './BetsFeed.vue';

import BetsFeed from './BetsFeed.vue';

const props = defineProps<{
  match: IMatch;
}>();

// ------ Initialization ------
const clockStore = useClockStore();
const activeProfileStore = useActiveProfileStore();
const showFavoritesOnly = ref(false);
const { t } = useI18n();
const userService = new UserService();

// const betsFeedRef = ref<any>(null);

// function refresh() {
//   betsFeedRef.value?.refresh?.();
// }

// defineExpose({
//   refresh,
// });

// ------ Computed ------
const activeProfile = computed(() => activeProfileStore.activeProfile);
const isMatchStarted = computed(() => {
  return clockStore.currentTimestamp >= props.match.timestamp;
});

const countdown = computed(() => {
  return clockStore.getCountdown(props.match.timestamp);
});

const betsWithOutcome = computed(() => {
  const levels: THitLevel[] = [HIT_LEVELS.exactScore, HIT_LEVELS.oneScore, HIT_LEVELS.winnerOnly, HIT_LEVELS.miss];
  const result: BetWithOutcome[] = [];

  for (const level of levels) {
    const levelBets = filterBets(props.match.bets, level);
    const activeUserBets = filterBets(props.match.loggedUserBets ? [props.match.loggedUserBets] : null, level);
    const activeIds = new Set(activeUserBets.map((b) => b.id));

    for (const bet of activeUserBets) {
      result.push({
        ...bet,
        hitLevel: level,
        isActiveUser: true,
      });
    }
    for (const bet of levelBets) {
      if (!activeIds.has(bet.id)) {
        result.push({
          ...bet,
          hitLevel: level,
          isActiveUser: false,
        });
      }
    }
  }

  return result;
});

function filterBets(bets: IBet[] | null, hitLevel: THitLevel) {
  if (!bets) return [];

  const filteredBets = bets.filter((bet) => {
    if (showFavoritesOnly.value && activeProfile.value) {
      if (!isFavorite(bet.user.id) && bet.user.id !== activeProfile.value.id) {
        return false;
      }
    }

    const homeScoreMatch = bet.scoreHome === props.match.score.home;
    const awayScoreMatch = bet.scoreAway === props.match.score.away;

    if (hitLevel === 'exact') {
      return homeScoreMatch && awayScoreMatch;
    }

    // Determine the winner/outcome of the bet and actual match
    if (
      bet.scoreHome === null ||
      bet.scoreAway === null ||
      props.match.score.home === null ||
      props.match.score.away === null
    ) {
      // If any score is null, we can't determine the outcome, so we consider it a miss
      return hitLevel === 'miss';
    }

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

  return filteredBets;
}

function isFavorite(userId: number): boolean {
  return userService.isFavorite(userId);
}
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
  width: 100%;
  overflow-x: hidden !important;
}

.favorites-filter {
  display: flex;
  gap: var(--m-spacing);
  justify-content: center;
  padding: var(--s-spacing);
}

.no-bets-message {
  display: flex;
  flex-direction: column;
  gap: var(--m-spacing);
  align-items: center;
  justify-content: center;
  padding: var(--xl-spacing) var(--l-spacing);
  text-align: center;

  i {
    font-size: var(--xxl-font-size);
    color: var(--bolao-c-grey1-t2);
  }

  p {
    margin: 0;
    font-size: var(--m-font-size);
    line-height: 1.6;
    color: var(--bolao-c-grey1-t2);
  }
}
</style>
