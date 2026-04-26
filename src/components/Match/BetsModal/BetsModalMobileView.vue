<template>
  <div class="outer">
    <ClockComponent
      style="width: 100%"
      :timestamp="match.timestamp"
      :status="match.status"
      :clock="
        match.timestamp ? clockStore.getFormattedTime(match.timestamp) : null
      "
      :hit-level="hitLevel"
      :is-match-started="isMatchStarted"
    />
    <ScoreComponent
      :is-score-modal-open="true"
      :is-team-clickable="true"
      :match="match"
      :active-user-bet="match.loggedUserBets"
      :is-match-started="isMatchStarted"
    />
  </div>
</template>
<script lang="ts" setup>
import type { HitLevel } from "@/constants/bets";
import type { IMatch } from "@/stores/matches.types";

import { useClockStore } from "@/stores/clock";

import ClockComponent from "../ClockComponent.vue";
import ScoreComponent from "../ScoreComponent.vue";

defineProps<{
  hitLevel: HitLevel | null;
  isMatchStarted: boolean;
  match: IMatch;
}>();

// ------ Initialization ------
const clockStore = useClockStore();
</script>
<style lang="scss" scoped>
.outer {
  display: flex;
  flex-direction: column;
  gap: var(--m-spacing);
  margin: 0 var(--xs-spacing) !important;
}
</style>
