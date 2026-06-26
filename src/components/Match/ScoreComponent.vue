<template>
  <div class="outer-score-line">
    <TeamComponent
      :is-home-team="true"
      :show-events="isScoreModalOpen"
      :is-winner="isHomeTeamWinner"
      :events="showEvents ? sortedEvents : []"
      :match="match"
      :is-demo="isDemo"
      :is-mini="isMini"
      :hit-level="hitLevel"
    />
    <TeamComponent
      :is-home-team="false"
      :show-events="isScoreModalOpen"
      :is-winner="isAwayTeamWinner"
      :match="match"
      :events="showEvents ? sortedEvents : []"
      :is-demo="isDemo"
      :is-mini="isMini"
      :hit-level="hitLevel"
    />
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';

import type { THitLevel } from '@/constants/bets';
import type { IBet, IMatch } from '@/stores/matches.types';

import { FINISHED_GAME } from '@/constants/match';

import TeamComponent from './TeamComponent.vue';
const props = withDefaults(
  defineProps<{
    activeUserBet: IBet | null;
    hitLevel?: null | THitLevel;
    isDemo?: boolean;
    isMatchStarted: boolean;
    isMini?: boolean;
    isScoreModalOpen?: boolean;
    match: IMatch;
    showEvents?: boolean;
  }>(),
  { isDemo: false, isMini: false, isScoreModalOpen: false, showEvents: false },
);

const isHomeTeamWinner = computed(() => {
  if (FINISHED_GAME.includes(props.match.status)) {
    if (props.match.score.home === props.match.score.away) {
      return props.match.score.homePenalties > props.match.score.awayPenalties;
    }
    return props.match.score.home > props.match.score.away;
  }

  return null;
});

const isAwayTeamWinner = computed(() => {
  if (FINISHED_GAME.includes(props.match.status)) {
    if (props.match.score.home === props.match.score.away) {
      return props.match.score.homePenalties < props.match.score.awayPenalties;
    }
    return props.match.score.home < props.match.score.away;
  }

  return null;
});

const sortedEvents = computed(() => {
  return [...props.match.events].sort((a, b) => {
    return a.gametime.localeCompare(b.gametime);
  });
});
</script>
<style scoped>
.outer-mobile-score-line {
  display: flex;
  flex: 1;
  gap: var(--m-spacing);
  align-items: flex-start;
  justify-content: center;
}

.outer-score-line {
  display: flex;
  flex: 1;
  gap: var(--xs-spacing);
  align-items: flex-start;
  justify-content: center;

  @media (width <=768px) {
    gap: var(--xs-spacing);
  }
}
</style>
