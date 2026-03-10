<template>
  <div v-if="isMobileOnly" class="outer-mobile-score-line">
    <span
      :class="{
        'outer-mobile-teams-line': !isGridMode || isBetting,
        'outer-mobile-teams-grid': isGridMode,
      }"
    >
      <RibbonComponent v-if="ribbon" :ribbon="ribbon" />
      <TeamComponent
        isAlias
        :isGridMode="isGridMode"
        :isHomeTeam="true"
        :isWinning="match.score.away < match.score.home"
        :team="match.homeTeam"
        :matchStatus="match.status"
        :score="match.score"
      />
      <TeamComponent
        isAlias
        :isGridMode="isGridMode"
        :isHomeTeam="false"
        :isWinning="match.score.away > match.score.home"
        :team="match.awayTeam"
        :matchStatus="match.status"
        :score="match.score"
      />
    </span>
    <!-- <BettingComponent
      v-if="isBetting && !isGridMode"
      :match="match"
      :activeUserBet="activeUserBet"
      :isMatchStarted="isMatchStarted"
    /> -->
  </div>
  <div v-else :class="{ 'outer-score-line': !isGridMode || isBetting, 'outer-score-grid': isGridMode }">
    <TeamComponent
      :isGridMode="isGridMode"
      :isHomeTeam="true"
      :isWinning="match.score.away < match.score.home"
      :team="match.homeTeam"
      :matchStatus="match.status"
      :score="match.score"
    />

    <!-- <BettingComponent
      v-if="isBetting && !isGridMode"
      :match="match"
      :activeUserBet="activeUserBet"
      :isMatchStarted="isMatchStarted"
    /> -->
    <TeamComponent
      :isGridMode="isGridMode"
      :isHomeTeam="false"
      :isWinning="match.score.away > match.score.home"
      :team="match.awayTeam"
      :matchStatus="match.status"
      :score="match.score"
    />
  </div>
</template>
<script lang="ts" setup>
import { isMobileOnly } from '@basitcodeenv/vue3-device-detect';

import type { Ribbon } from '@/constants/bets';
import type { IBet, IMatch } from '@/stores/matches.types';

import RibbonComponent from './RibbonComponent.vue';
import TeamComponent from './TeamComponent.vue';
withDefaults(
  defineProps<{
    activeUserBet: IBet | null;
    isBetting?: boolean;
    isGridMode?: boolean;
    isMatchStarted: boolean;
    match: IMatch;
    ribbon?: Ribbon;
  }>(),
  {
    isBetting: false,
    isGridMode: false,
  },
);
</script>
<style scoped>
.outer-mobile-score-line {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--m-spacing);
  position: relative;
}

.outer-mobile-teams-grid {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
}

.outer-mobile-teams-line {
  display: flex;
  flex: 1;
  width: 100%;
  min-height: 60px;
}

.outer-score-line {
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: var(--m-spacing);
}

.outer-score-grid {
  display: flex;
  flex: 1;
  flex-direction: column;
}
</style>
