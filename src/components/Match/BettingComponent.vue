<template>
  <div style="display: flex">
    <span
      v-for="(BET_VALUE, index) in BETS_VALUES"
      :key="index"
      style="position: relative"
      class="betting-radio-button-container"
    >
      <PrimeRadioButton
        :name="BETS_LABELS[BET_VALUE]"
        :disabled="isLoading || isMatchStarted"
        :value="BET_VALUE"
        v-model="radioButton"
        class="betting-radio-button"
        size="large"
        @change="(e: any) => handleNewBet(e, BET_VALUE)"
        v-tooltip.top="renderTootlip(BET_VALUE)"
      />
      <span class="betting-label">{{ BETS_LABELS[BET_VALUE] }}</span>
    </span>
  </div>
</template>
<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import { ref, watchEffect } from 'vue';

import type { IBet, IMatch } from '@/stores/matches.types';

import { BETS_LABELS, BETS_VALUES, type BetsValues } from '@/constants/bets';
import MatchService from '@/services/match';

const props = defineProps<{
  activeUserBet: IBet | null;
  isMatchStarted: boolean;
  match: IMatch;
}>();

// ------ Refs ------
const radioButtonPrevValue = ref<BetsValues | null>(null);
const radioButton = ref<BetsValues | null>(null);
const isLoading = ref<boolean>(false);

// ------ Initializations ------
const matchService = new MatchService();
const toast = useToast();

// ------ Watch Effect Properties ------
watchEffect(() => (radioButton.value = props.activeUserBet ? props.activeUserBet.value : null));
watchEffect(() => (radioButtonPrevValue.value = props.activeUserBet ? props.activeUserBet.value : null));

function callback(isSuccess: boolean, error?: Error) {
  isLoading.value = false;
  if (isSuccess) {
    radioButtonPrevValue.value = radioButton.value; // Update previous value to current
    toast.add({
      detail: `Aposta ${props.match.away.code} @ ${props.match.home.code} atualizada com sucesso`,
      life: 3000,
      severity: 'success',
      summary: 'Aposta atualizada',
    });
  } else {
    radioButton.value = radioButtonPrevValue.value; // Revert to previous value
    console.error('Error updating bet:', error);
    toast.add({
      detail: `Erro ao atualizar aposta: ${error?.message}`,
      life: 5000,
      severity: 'error',
      summary: 'Erro ao atualizar aposta',
    });
  }
}

function handleNewBet(e: Event, newBet: BetsValues) {
  isLoading.value = true;

  // If nothing changed, do not update the bet
  if (radioButtonPrevValue.value === radioButton.value) {
    callback(true);
  }

  matchService.updateBet(props.match.id, newBet, callback);
}

// ------ Functions ------
function renderTootlip(value: BetsValues) {
  if (value === BETS_VALUES.AWAY_EASY || value === BETS_VALUES.AWAY_HARD) {
    return `${BETS_LABELS[value]} pros ${props.match.away.alias}`;
  } else {
    return `${BETS_LABELS[value]} pros ${props.match.home.alias}`;
  }
}
</script>
<style lang="scss" scoped>
.betting-radio-button-container {
  &:nth-child(2) {
    box-shadow: 1px 0px 0px 0px rgba(grey, 0.75);
    -webkit-box-shadow: 1px 0px 0px 0px rgba(grey, 0.75);
    -moz-box-shadow: 1px 0px 0px 0px rgba(grey, 0.75);
  }
}
.betting-radio-button {
  margin: var(--m-spacing);

  @media (min-width: 1440px) {
    margin: var(--l-spacing);
  }
}

.betting-label {
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateY(-100%) translateX(-50%);
  font-size: var(--xs-font-size);
  color: var(--text-color);
  z-index: 1;
}
</style>
