<template>
  <div
    class="outer-match line"
    :class="{ clickable: isMatchStarted }"
  >
    <ClockComponent
      v-if="isDesktop && !isDemo"
      :hit-level="hitLevel"
      :timestamp="parseInt(match.timestamp, 10)"
      :status="match.status"
      :is-match-started="isMatchStarted"
    />
    <ScoreComponent
      :is-team-clickable="isTeamClickable"
      :match="match"
      :active-user-bet="match.loggedUserBets ?? null"
      :is-match-started="isMatchStarted"
      :hit-level="hitLevel"
    />
    <div
      class="more-info"
      @click="handleMatchClick"
    >
      <i class="pi pi-plus-circle" />
      <span v-if="!isMobile">Ver Mais</span>
    </div>
  </div>
  <MoreInfoModal
    :match="match"
    :is-open="isMoreInfoModalOpen"
    :hit-level="hitLevel"
    :handle-close-modal="handleCloseModal"
  />
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';

import type { IMatch } from '@/stores/matches.types';

import { HIT_LEVELS } from '@/constants/bets';
import { useViewport } from '@/services/viewport';
import { useClockStore } from '@/stores/clock';

import ClockComponent from './ClockComponent.vue';
import MoreInfoModal from './MoreInfoModal/MoreInfoModal.vue';
import ScoreComponent from './ScoreComponent.vue';

const props = withDefaults(
  defineProps<{
    isDemo?: boolean;
    isMatchClickable?: boolean;
    isTeamClickable?: boolean;
    match: IMatch;
  }>(),
  {
    isDemo: false,
    isMatchClickable: false,
    isTeamClickable: false,
  },
);

// ------ Refs ------
const isMoreInfoModalOpen = ref(false);

// ------ Initialization ------
const clockStore = useClockStore();
const { isDesktop, isMobile } = useViewport();

// ------ Computed Properties ------
// const correctBets = { bullseye: [], half: [] };
// const correctBets = computed(() => calculateCorrectBets(props.match.away.score, props.match.home.score));
const isMatchStarted = computed(() => {
  return clockStore.currentTimestamp >= parseInt(props.match.timestamp, 10);
});

const hitLevel = computed(() => {
  if (!props.match.loggedUserBets || !isMatchStarted.value) {
    return null;
  }

  const homeScoreMatch = props.match.loggedUserBets.scoreHome === props.match.score.home;
  const awayScoreMatch = props.match.loggedUserBets.scoreAway === props.match.score.away;

  if (homeScoreMatch && awayScoreMatch) {
    return HIT_LEVELS.exactScore;
  }

  if (props.match.loggedUserBets.scoreHome === null || props.match.loggedUserBets.scoreAway === null) {
    return HIT_LEVELS.miss;
  }

  // Determine the winner/outcome of the bet and actual match
  const betHomeWon = props.match.loggedUserBets.scoreHome > props.match.loggedUserBets.scoreAway;
  const betAwayWon = props.match.loggedUserBets.scoreAway > props.match.loggedUserBets.scoreHome;
  const betDraw = props.match.loggedUserBets.scoreHome === props.match.loggedUserBets.scoreAway;

  const actualHomeWon = props.match.score.home > props.match.score.away;
  const actualAwayWon = props.match.score.away > props.match.score.home;
  const actualDraw = props.match.score.home === props.match.score.away;

  const gotWinnerRight = (betHomeWon && actualHomeWon) || (betAwayWon && actualAwayWon) || (betDraw && actualDraw);
  if (gotWinnerRight) {
    if ((homeScoreMatch && !awayScoreMatch) || (!homeScoreMatch && awayScoreMatch)) {
      return HIT_LEVELS.oneScore;
    }
    return HIT_LEVELS.winnerOnly;
  }

  return HIT_LEVELS.miss;
});

function handleCloseModal() {
  isMoreInfoModalOpen.value = false;
}

// ------ Functions ------
function handleMatchClick() {
  isMoreInfoModalOpen.value = true;
}
</script>
<style lang="scss" scoped>
.outer-match {
  display: flex;
  gap: var(--m-spacing);
  opacity: 1;

  @media (width <=768px) {
    gap: var(--xs-spacing);
  }
}

.more-info {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--xxs-spacing);
  align-items: center;
  justify-content: center;
  padding: var(--s-spacing);
  font-size: var(--xs-font-size);
  font-weight: 600;
  cursor: pointer;
  background-color: var(--bolao-c-white-t1);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
  transition: all 0.2s ease;

  i {
    font-size: var(--m-font-size);
    transition: transform 0.2s ease;
  }

  span {
    white-space: nowrap;
  }

  &:hover {
    box-shadow: 0 4px 8px rgb(0 0 0 / 20%);
    transform: translateY(-1px);

    i {
      transform: scale(1.1);
    }
  }

  @media (width <=768px) {
    min-width: 48px;
    min-height: 48px;
    padding: var(--xs-spacing);
    font-size: var(--xxs-font-size);
    color: #fff;

    i {
      font-size: var(--l-font-size);
      color: #fff;
      filter: drop-shadow(0 1px 2px rgb(0 0 0 / 20%));
    }
  }
}

.line {
  width: 100%;
  height: var(--match-list-height);

  @media (width <=768px) {
    height: var(--match-list-height-mobile);
  }
}
</style>
