<template>
  <div class="outer">
    <ClockComponent
      style="width: 100%"
      :timestamp="parseInt(match.timestamp, 10)"
      :status="match.status"
      :clock="match.timestamp ? clockStore.getFormattedTime(parseInt(match.timestamp, 10)) : null"
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
    <PrimeButton
      :icon="showMatchInfo ? 'pi pi-minus' : 'pi pi-plus'"
      class="match-info-toggle"
      label="Ficha Técnica"
      severity="secondary"
      aria-label="Search"
      size="small"
      @click="toggleMatchInfo"
    />
  </div>
  <MoreInfoDetails
    :match="match"
    :showMatchInfo="showMatchInfo"
  />
</template>
<script lang="ts" setup>
import { ref } from 'vue';

import type { HitLevel } from '@/constants/bets';
import type { IMatch } from '@/stores/matches.types';

import { useClockStore } from '@/stores/clock';

import ClockComponent from '../ClockComponent.vue';
import ScoreComponent from '../ScoreComponent.vue';
import MoreInfoDetails from './MoreInfoDetails.vue';

defineProps<{
  hitLevel: HitLevel | null;
  isMatchStarted: boolean;
  match: IMatch;
}>();

// ------ Initialization ------
const showMatchInfo = ref(false);
const clockStore = useClockStore();

// ------ Functions ------
function toggleMatchInfo() {
  showMatchInfo.value = !showMatchInfo.value;
}
</script>
<style lang="scss" scoped>
.outer {
  display: flex;
  flex-direction: column;
  gap: var(--s-spacing);
  margin: 0 var(--xs-spacing) !important;
}

.match-info-toggle {
  display: flex;
  justify-content: center;
  height: var(--match-list-height-mobile);
  border-radius: var(--border-radius) !important;
}
</style>
