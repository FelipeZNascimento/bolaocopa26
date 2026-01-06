<template>
  <ExtrasResultTable
    v-for="(division, index) in divisionsObj"
    :key="index"
    :title="`${conference} ${division}`"
    :conference="conference"
    :teams="conferenceTeams[conference][division]"
  />
</template>
<script setup lang="ts">
import { computed } from 'vue';

import type { TConference, TDivision } from '@/stores/matches.types';

import { useExtraBetStore } from '@/stores/extraBet';

import ExtrasResultTable from './ExtrasAfterUserTable.vue';

defineProps<{
  conference: TConference;
}>();

// ------ Initialization ------
const divisionsObj: TDivision[] = ['North', 'East', 'South', 'West'];
const extraBetStore = useExtraBetStore();

// ------ Computed Properties ------
const conferenceTeams = computed(() => {
  return {
    AFC: {
      East: extraBetStore.afcTeams.East,
      North: extraBetStore.afcTeams.North,
      South: extraBetStore.afcTeams.South,
      West: extraBetStore.afcTeams.West,
    },
    NFC: {
      East: extraBetStore.nfcTeams.East,
      North: extraBetStore.nfcTeams.North,
      South: extraBetStore.nfcTeams.South,
      West: extraBetStore.nfcTeams.West,
    },
  };
});
</script>
<style lang="scss" scoped>
.outer-extras {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: var(--m-spacing);
  padding: var(--l-spacing) 160px;
  flex: 1;

  @media (max-width: 767px) {
    padding: var(--xxl-spacing) var(--s-spacing);
  }
}

.outer-extras-tables {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--l-spacing);
}
</style>
