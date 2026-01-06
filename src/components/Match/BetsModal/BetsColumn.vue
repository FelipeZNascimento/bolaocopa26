<template>
  <div
    class="bets-column"
    :class="{
      'green-bg': isBullseyeColumn,
      'blue-bg': isHalfBetColumn,
      'red-bg': isMissColumn,
    }"
  >
    <p class="bets-column-header">{{ BETS_LABELS[columnValue] }}</p>
    <!-- Render active user bet first -->
    <div class="bets-line" v-if="activeUserBet && activeUserBet?.value === columnValue" :key="activeUserBet.id">
      <IconAndName
        v-if="!isMobile"
        isActive
        :color="activeUserBet.user.color"
        :name="activeUserBet.user.name"
        :icon="activeUserBet.user.icon"
      />
      <span v-else>{{ activeUserBet.user.name }}</span>
    </div>
    <!-- Render remaining bets -->
    <div class="bets-line" v-for="bet in bets.filter((bet) => bet.value === columnValue)" :key="bet.id">
      <IconAndName v-if="!isMobile" :color="bet.user.color" :name="bet.user.name" :icon="bet.user.icon" />
      <span v-else>{{ bet.user.name }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { isMobile } from '@basitcodeenv/vue3-device-detect';
import { computed } from 'vue';

import type { IBet } from '@/stores/matches.types';

import IconAndName from '@/components/IconAndName.vue';
import { BETS_LABELS, type BetsValues } from '@/constants/bets';
import { type CorrectBets, isBullseye, isHalfBet } from '@/util/betsCalculator';

const props = defineProps<{
  activeUserBet: IBet | null;
  bets: IBet[];
  columnValue: BetsValues;
  correctBets: CorrectBets;
}>();

// ------ Computed Properties ------
const isBullseyeColumn = computed(() => props.activeUserBet && isBullseye(props.correctBets, props.columnValue));
const isHalfBetColumn = computed(() => props.activeUserBet && isHalfBet(props.correctBets, props.columnValue));
const isMissColumn = computed(() => !isBullseyeColumn.value && !isHalfBetColumn.value);
</script>

<style lang="scss" scoped>
.bets-column {
  display: flex;
  flex: 1 0 0;
  min-width: 0;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  border: 1px solid var(--bolao-c-grey1-t1);
  padding: var(--xs-spacing);
}

.green-bg {
  background-color: var(--bolao-c-green-t1);
}

.blue-bg {
  background-color: var(--bolao-c-blue-t1);
}

.red-bg {
  background-color: var(--bolao-c-red-t1);
}

.bets-column-header {
  text-align: center;
  width: 100%;
  font-size: var(--m-font-size);
  font-weight: bold;
}

.bets-line {
  display: flex;
  padding: var(--xxs-spacing) 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
}
</style>
