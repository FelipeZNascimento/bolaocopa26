<template>
  <div class="outer-score-line">
    <TeamComponent
      :is-home-team="true"
      :show-events="isScoreModalOpen"
      :is-winning="isHomeTeamWinning"
      :events="sortedEvents"
      :match="match"
      :is-demo="isDemo"
      :is-mini="isMini"
      :hit-level="hitLevel"
    />
    <TeamComponent
      :is-home-team="false"
      :show-events="isScoreModalOpen"
      :is-winning="isAwayTeamWinning"
      :match="match"
      :events="sortedEvents"
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

import { PENALTIES } from '@/constants/match';

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
  }>(),
  { isDemo: false, isMini: false, isScoreModalOpen: false },
);

const isHomeTeamWinning = computed(() => {
  if (PENALTIES.includes(props.match.status)) {
    return props.match.score.homePenalties > props.match.score.awayPenalties;
  }

  return props.match.score.home > props.match.score.away;
});

const isAwayTeamWinning = computed(() => {
  if (PENALTIES.includes(props.match.status)) {
    return props.match.score.awayPenalties > props.match.score.homePenalties;
  }

  return props.match.score.away > props.match.score.home;
});

const sortedEvents = computed(() => {
  return [...props.match.events].sort((a, b) => {
    const parseGametime = (gametime: string) => {
      const match = gametime.match(/^(\d+)(?:\+(\d+))?'/);
      if (!match) return 0;
      const minutes = parseInt(match[1], 10);
      const added = match[2] ? parseInt(match[2], 10) / 100 : 0;
      return minutes + added;
    };

    return parseGametime(a.gametime) - parseGametime(b.gametime);
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
