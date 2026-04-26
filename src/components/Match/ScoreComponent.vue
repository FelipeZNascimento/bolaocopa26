<template>
  <div class="outer-score-line">
    <TeamComponent
      :is-clickable="isTeamClickable"
      :is-home-team="true"
      :show-events="isScoreModalOpen"
      :is-winning="match.score.away < match.score.home"
      :events="sortedEvents"
      :team="match.homeTeam"
      :match-status="match.status"
      :score="match.score"
    />
    <TeamComponent
      :is-clickable="isTeamClickable"
      :is-home-team="false"
      :show-events="isScoreModalOpen"
      :is-winning="match.score.away > match.score.home"
      :team="match.awayTeam"
      :match-status="match.status"
      :score="match.score"
      :events="sortedEvents"
    />
  </div>
</template>
<script lang="ts" setup>
import { computed } from "vue";

import type { IBet, IMatch } from "@/stores/matches.types";

import TeamComponent from "./TeamComponent.vue";
const props = withDefaults(
  defineProps<{
    activeUserBet: IBet | null;
    isMatchStarted: boolean;
    isScoreModalOpen?: boolean;
    isTeamClickable?: boolean;
    match: IMatch;
  }>(),
  {
    isScoreModalOpen: false,
    isTeamClickable: false,
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
  align-items: flex-start;
  justify-content: center;
  gap: var(--m-spacing);
}

.outer-score-line {
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: var(--m-spacing);
}
</style>
