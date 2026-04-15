<template>
  <div
    v-if="isMobileOnly"
    class="outer-mobile-score-line"
  >
    <span class="outer-mobile-teams-line">
      <TeamComponent
        is-alias
        :is-betting="isBetting"
        :is-home-team="true"
        :is-winning="match.score.away < match.score.home"
        :events="sortedEvents"
        :team="match.homeTeam"
        :match-status="match.status"
        :score="match.score"
      />
      <TeamComponent
        is-alias
        :is-betting="isBetting"
        :is-home-team="false"
        :is-winning="match.score.away > match.score.home"
        :events="sortedEvents"
        :team="match.awayTeam"
        :match-status="match.status"
        :score="match.score"
      />
    </span>
  </div>
  <div
    v-else
    class="outer-score-line"
  >
    <TeamComponent
      :is-betting="isBetting"
      :is-home-team="true"
      :is-score-modal-open="isScoreModalOpen"
      :is-winning="match.score.away < match.score.home"
      :events="sortedEvents"
      :team="match.homeTeam"
      :match-status="match.status"
      :score="match.score"
    />
    <TeamComponent
      :is-betting="isBetting"
      :is-home-team="false"
      :is-score-modal-open="isScoreModalOpen"
      :is-winning="match.score.away > match.score.home"
      :team="match.awayTeam"
      :match-status="match.status"
      :score="match.score"
      :events="sortedEvents"
    />
  </div>
</template>
<script lang="ts" setup>
import { isMobileOnly } from '@basitcodeenv/vue3-device-detect';
import { computed } from 'vue';

import type { IBet, IMatch } from '@/stores/matches.types';

import TeamComponent from './TeamComponent.vue';
const props = withDefaults(
  defineProps<{
    activeUserBet: IBet | null;
    isBetting?: boolean;
    isMatchStarted: boolean;
    isScoreModalOpen?: boolean;
    match: IMatch;
  }>(),
  {
    isBetting: false,
    isScoreModalOpen: false,
  },
);

const sortedEvents = computed(() => {
  return [...props.match.events].sort((a, b) => {
    const parseGametime = (gametime: string) => {
      const match = gametime.match(/^(\d+)(?:\+(\d+))?'/);
      if (!match) return 0;
      const minutes = parseInt(match[1], 10);
      const added = match[2] ? parseInt(match[2], 10) / 100 : 0;
      return minutes + added;
    };
    return parseGametime(a.event.gametime) - parseGametime(b.event.gametime);
  });
});
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
  align-items: flex-start;
  justify-content: center;
  gap: var(--m-spacing);
}
</style>
