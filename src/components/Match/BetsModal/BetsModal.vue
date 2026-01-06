<template>
  <PrimeDialog
    dismissableMask
    modal
    v-model:visible="isVisible"
    :draggable="false"
    :style="{ width: '1024px' }"
    :breakpoints="{ '1280px': '75vw', '575px': '90vw' }"
    contentClass="content-class"
  >
    <template #header>
      <ClockComponent
        :timestamp="match.timestamp"
        :status="match.status"
        :clock="match.clock"
        :ribbon="ribbon"
        :isMatchStarted="isMatchStarted"
      />
    </template>

    <div class="teams-outer">
      <ScoreComponent :match="match" :activeUserBet="match.loggedUserBets" :isMatchStarted="isMatchStarted" />
    </div>
    <div class="bets-outer">
      <BetsColumn
        :bets="match.bets"
        :columnValue="BETS_VALUES.AWAY_EASY"
        :activeUserBet="match.loggedUserBets"
        :correctBets="correctBets"
      />
      <BetsColumn
        :bets="match.bets"
        :columnValue="BETS_VALUES.AWAY_HARD"
        :activeUserBet="match.loggedUserBets"
        :correctBets="correctBets"
      />
      <BetsColumn
        :bets="match.bets"
        :columnValue="BETS_VALUES.HOME_HARD"
        :activeUserBet="match.loggedUserBets"
        :correctBets="correctBets"
      />
      <BetsColumn
        :bets="match.bets"
        :columnValue="BETS_VALUES.HOME_EASY"
        :activeUserBet="match.loggedUserBets"
        :correctBets="correctBets"
      />
    </div>
    <!-- <template #footer>a</template> -->
  </PrimeDialog>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import type { IMatch } from '@/stores/matches.types';

import { BETS_VALUES, type Ribbon } from '@/constants/bets';
import { useClockStore } from '@/stores/clock';
import { type CorrectBets } from '@/util/betsCalculator';

import ClockComponent from '../ClockComponent.vue';
import ScoreComponent from '../ScoreComponent.vue';
import BetsColumn from './BetsColumn.vue';

const props = defineProps<{
  correctBets: CorrectBets;
  handleCloseModal: () => void;
  isOpen: boolean;
  match: IMatch;
  ribbon: null | Ribbon;
}>();

// ------ Initialization ------
const clockStore = useClockStore();
const isVisible = ref(false);

const isMatchStarted = computed(() => {
  return clockStore.currentTimestamp >= props.match.timestamp;
});

watch(
  () => props.isOpen,
  async (newValue) => {
    if (newValue) {
      isVisible.value = true;
    }
  },
);

watch(isVisible, async (newValue) => {
  if (!newValue) {
    props.handleCloseModal();
  }
});
</script>
<style>
.teams-outer {
  display: flex;
  width: 100%;
  height: 60px;
}

.team-column {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
}

.bets-outer {
  display: flex;
  overflow-x: hidden !important;
}

.content-class {
  padding: 0 !important;
  overflow-x: hidden !important;
}
</style>
