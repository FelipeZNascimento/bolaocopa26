<template>
  <div class="outer">
    <ClockComponent
      style="margin-right: var(--l-spacing)"
      :timestamp="parseInt(match.timestamp, 10)"
      :status="match.status"
      :clock="match.timestamp ? clockStore.getFormattedTime(parseInt(match.timestamp, 10)) : null"
      :hit-level="hitLevel"
      :is-match-started="isMatchStarted"
    />
    <ScoreComponent
      :is-score-modal-open="true"
      :match="match"
      :active-user-bet="match.loggedUserBets"
      :is-team-clickable="true"
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
const clockStore = useClockStore();
const showMatchInfo = ref(false);

function toggleMatchInfo() {
  showMatchInfo.value = !showMatchInfo.value;
}
</script>
<style lang="scss" scoped>
.outer {
  display: flex;
  padding: var(--m-spacing);
  margin: 0 var(--l-spacing) !important;
  background-color: var(--bolao-c-blue3-t2);
  border-radius: var(--border-radius);
}

.match-info-toggle {
  display: flex;
  justify-content: center;
  height: var(--match-list-height);
  margin-left: var(--l-spacing);
  border-radius: var(--border-radius) !important;
}
</style>
