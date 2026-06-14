<template>
  <div
    v-if="isMobile && !isDemo"
    style="display: flex; gap: var(--xs-spacing); justify-content: center; justify-content: space-between"
  >
    <ClockComponent
      :hit-level="hitLevel"
      :timestamp="match.timestamp"
      :status="match.status"
      :is-match-started="isMatchStarted"
      :is-mini="isMini"
      :points-awarded="match.pointsAwarded"
      :gametime="match.gametime"
      @click="handleMatchClick"
      @keydown.enter="handleMatchClick"
    />
    <div
      class="match-connector"
      aria-hidden="true"
    />
    <div
      class="more-info"
      role="button"
      tabindex="0"
      :aria-label="$t('match.moreInfo')"
      @click="handleMatchClick"
      @keydown.enter="handleMatchClick"
      @keydown.space.prevent="handleMatchClick"
    >
      {{ t('common.seeMore') }} <i class="pi pi-plus-circle" />
    </div>
  </div>
  <div
    class="outer-match line"
    :class="{ clickable: isMatchStarted, 'is-mini': isMini }"
  >
    <ClockComponent
      v-if="!isMobile && !isDemo"
      :hit-level="hitLevel"
      :timestamp="match.timestamp"
      :status="match.status"
      :is-match-started="isMatchStarted"
      :is-mini="isMini"
      :points-awarded="match.pointsAwarded"
      :gametime="match.gametime"
      @click="handleMatchClick"
      @keydown.enter="handleMatchClick"
    />
    <ScoreComponent
      :match="match"
      :active-user-bet="match.loggedUserBets ?? null"
      :is-match-started="isMatchStarted"
      :hit-level="hitLevel"
      :is-mini="isMini"
      :is-demo="isDemo"
    />
    <div
      v-if="!isDemo && !isMobile"
      class="more-info"
      role="button"
      tabindex="0"
      :aria-label="$t('match.moreInfo')"
      @click="handleMatchClick"
      @keydown.enter="handleMatchClick"
      @keydown.space.prevent="handleMatchClick"
    >
      <i class="pi pi-plus-circle" />
    </div>
    <div
      v-if="isStatusSweeping"
      aria-hidden="true"
      class="status-sweep"
      :style="{ '--sweep-color': sweepColor }"
    />
  </div>
  <MoreInfoModal
    :match="match"
    :is-open="isMoreInfoModalOpen"
    :hit-level="hitLevel"
    :handle-close-modal="handleCloseModal"
  />
</template>
<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import type { IMatch } from '@/stores/matches.types';

import { HIT_LEVELS } from '@/constants/bets';
import { MATCH_STATUS, type TMatchStatus } from '@/constants/match';
import { useViewport } from '@/services/viewport';
import { useClockStore } from '@/stores/clock';

import ClockComponent from './ClockComponent.vue';
import MoreInfoModal from './MatchInfoModal/MatchInfoModal.vue';
import ScoreComponent from './ScoreComponent.vue';

const props = withDefaults(
  defineProps<{
    isDemo?: boolean;
    isMatchClickable?: boolean;
    isMini?: boolean;
    match: IMatch;
  }>(),
  {
    isDemo: false,
    isMatchClickable: false,
    isMini: false,
  },
);

// ------ Refs ------
const isMoreInfoModalOpen = ref(false);
const isStatusSweeping = ref(false);
const sweepColor = ref('');

// ------ Initialization ------
const clockStore = useClockStore();
const { isMobile } = useViewport();
const { t } = useI18n();

// ------ Computed Properties ------
// const correctBets = { bullseye: [], half: [] };
// const correctBets = computed(() => calculateCorrectBets(props.match.away.score, props.match.home.score));
const isMatchStarted = computed(() => {
  return clockStore.currentTimestamp >= props.match.timestamp;
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

function getStatusSweepColor(status: TMatchStatus): string {
  if ([MATCH_STATUS.FIRST_HALF, MATCH_STATUS.PENALTIES, MATCH_STATUS.SECOND_HALF].includes(status)) {
    return 'var(--bolao-c-mint)';
  }

  if (
    [
      MATCH_STATUS.AWAITING_EXTRA_TIME,
      MATCH_STATUS.AWAITING_PENALTIES,
      MATCH_STATUS.HALFTIME,
      MATCH_STATUS.HALFTIME_EXTRA_TIME,
    ].includes(status)
  ) {
    return 'var(--bolao-c-gold)';
  }

  if ([MATCH_STATUS.FINAL, MATCH_STATUS.FINAL_EXTRA_TIME, MATCH_STATUS.FINAL_PENALTIES].includes(status)) {
    return 'var(--color-contrast)';
  }

  return 'var(--bolao-c-red)';
}

function handleCloseModal() {
  isMoreInfoModalOpen.value = false;
}

// ------ Functions ------
function handleMatchClick() {
  isMoreInfoModalOpen.value = true;
}

// ------ Watches ------
watch(
  () => props.match.status,
  (newStatus) => {
    sweepColor.value = getStatusSweepColor(newStatus);
    isStatusSweeping.value = true;
    setTimeout(() => {
      isStatusSweeping.value = false;
    }, 800);
  },
);
</script>
<style lang="scss" scoped>
.outer-match {
  position: relative;
  display: flex;
  gap: var(--m-spacing);
  opacity: 1;

  &.is-mini {
    gap: var(--xs-spacing);
    height: unset;
  }

  @media (width <=768px) {
    gap: var(--xs-spacing);
    margin-bottom: var(--m-spacing);
  }
}

.match-connector {
  flex: 1;
  align-self: center;
  height: 1px;
  margin: 0 var(--xxs-spacing);
  background-image: repeating-linear-gradient(
    to right,
    color-mix(in srgb, var(--bolao-c-grey4) 20%, transparent) 0,
    color-mix(in srgb, var(--bolao-c-grey4) 20%, transparent) 3px,
    transparent 3px,
    transparent 9px
  );
}

.more-info {
  position: relative;
  display: flex;
  gap: var(--s-spacing);
  align-items: center;
  justify-content: center;
  justify-content: space-around;
  min-width: 60px;
  padding: var(--s-spacing);
  overflow: hidden;
  font-weight: 600;
  cursor: pointer;
  background:
    linear-gradient(
      150deg,
      color-mix(in srgb, var(--color-main) 28%, transparent) 0%,
      color-mix(in srgb, var(--color-main) 5%, transparent) 100%
    ),
    var(--bolao-c-white-t1);
  border-radius: var(--border-radius);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--color-main) 55%, transparent),
    inset 0 0 0 1px color-mix(in srgb, var(--color-main) 18%, transparent),
    inset 0 -2px 0 rgb(0 0 0 / 8%),
    0 2px 8px rgb(0 0 0 / 12%);
  transition:
    box-shadow 0.2s ease,
    transform 0.15s ease;

  &::before {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    content: '';
    background: radial-gradient(
      ellipse at 50% 140%,
      color-mix(in srgb, var(--color-anchor) 35%, transparent) 0%,
      transparent 65%
    );
    border-radius: var(--border-radius);
    opacity: 0;
    transition: opacity 0.25s ease;
  }

  i {
    position: relative;
    z-index: 1;
    font-size: var(--l-font-size);
    color: var(--color-contrast);
    transition:
      color 0.2s ease,
      transform 0.2s ease;
  }

  span {
    position: relative;
    z-index: 1;
    white-space: nowrap;
  }

  &:hover {
    box-shadow:
      inset 0 1px 0 color-mix(in srgb, var(--color-main) 65%, transparent),
      inset 0 0 0 1px color-mix(in srgb, var(--color-anchor) 45%, transparent),
      inset 0 -2px 0 rgb(0 0 0 / 8%),
      0 6px 18px rgb(0 0 0 / 22%);
    transform: translateY(-2px);

    &::before {
      opacity: 1;
    }

    i {
      color: var(--color-anchor);
      transform: scale(1.2);
    }
  }

  &:active {
    box-shadow:
      inset 0 1px 0 color-mix(in srgb, var(--color-main) 40%, transparent),
      inset 0 0 0 1px color-mix(in srgb, var(--color-main) 12%, transparent),
      inset 0 -1px 0 rgb(0 0 0 / 5%),
      0 1px 3px rgb(0 0 0 / 10%);
    transform: scale(0.96);
  }

  @media (hover: none) {
    &:active {
      transform: scale(0.93);
    }
  }

  @media (width <=768px) {
    min-width: 48px;
    min-height: 30px;
    padding: var(--xs-spacing) var(--m-spacing);
    font-size: var(--xxs-font-size);

    i {
      font-size: var(--m-font-size);
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

.status-sweep {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: var(--sweep-color, transparent);
  transform-origin: left;
}

@media (prefers-reduced-motion: no-preference) {
  @keyframes status-sweep {
    0% {
      opacity: 1;
      transform: scaleX(0);
    }

    70% {
      opacity: 1;
      transform: scaleX(1);
    }

    100% {
      opacity: 0;
      transform: scaleX(1);
    }
  }

  .status-sweep {
    animation: status-sweep 800ms ease-out forwards;
  }
}
</style>
