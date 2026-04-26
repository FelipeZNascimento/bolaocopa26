<template>
  <div
    class="outer-match line"
    :class="{ clickable: isMatchClickable }"
    @click="handleMatchClick"
  >
    <ScoreComponent
      :is-team-clickable="isTeamClickable"
      :match="match"
      :active-user-bet="match.loggedUserBets ?? null"
      :is-match-started="isMatchStarted"
      :hit-level="hitLevel"
    />
    <ClockComponent
      v-if="isDesktop && !isDemo"
      :hit-level="hitLevel"
      :timestamp="match.timestamp"
      :status="match.status"
      :is-match-started="isMatchStarted"
    />
  </div>
  <BetsModal
    :match="match"
    :is-open="isBetsModalOpen"
    :hit-level="hitLevel"
    :handle-close-modal="handleCloseModal"
  />
</template>
<script lang="ts" setup>
import { computed, ref } from "vue";

import type { IMatch } from "@/stores/matches.types";

import { HIT_LEVELS } from "@/constants/bets";
import { useViewport } from "@/services/viewport";
import { useClockStore } from "@/stores/clock";

import BetsModal from "./BetsModal/BetsModal.vue";
import ClockComponent from "./ClockComponent.vue";
import ScoreComponent from "./ScoreComponent.vue";

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
const isBetsModalOpen = ref(false);

// ------ Initialization ------
const clockStore = useClockStore();
const { isDesktop } = useViewport();

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

  const homeScoreMatch =
    props.match.loggedUserBets.scoreHome === props.match.score.home;
  const awayScoreMatch =
    props.match.loggedUserBets.scoreAway === props.match.score.away;

  if (homeScoreMatch && awayScoreMatch) {
    return HIT_LEVELS.exactScore;
  }

  // Determine the winner/outcome of the bet and actual match
  const betHomeWon =
    props.match.loggedUserBets.scoreHome > props.match.loggedUserBets.scoreAway;
  const betAwayWon =
    props.match.loggedUserBets.scoreAway > props.match.loggedUserBets.scoreHome;
  const betDraw =
    props.match.loggedUserBets.scoreHome ===
    props.match.loggedUserBets.scoreAway;

  const actualHomeWon = props.match.score.home > props.match.score.away;
  const actualAwayWon = props.match.score.away > props.match.score.home;
  const actualDraw = props.match.score.home === props.match.score.away;

  const gotWinnerRight =
    (betHomeWon && actualHomeWon) ||
    (betAwayWon && actualAwayWon) ||
    (betDraw && actualDraw);
  if (gotWinnerRight) {
    if (
      (homeScoreMatch && !awayScoreMatch) ||
      (!homeScoreMatch && awayScoreMatch)
    ) {
      return HIT_LEVELS.oneScore;
    }
    return HIT_LEVELS.winnerOnly;
  }

  return HIT_LEVELS.miss;
});

function handleCloseModal() {
  isBetsModalOpen.value = false;
}

// ------ Functions ------
function handleMatchClick() {
  if (!props.isMatchClickable || props.isDemo) {
    return;
  }
  isBetsModalOpen.value = true;
}
</script>
<style scoped>
.outer-match {
  display: flex;
  gap: var(--m-spacing);
  opacity: 1;
}

.clickable {
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    opacity: 0.6;
  }
}

.line {
  width: 100%;
  min-height: 60px;
}
</style>
