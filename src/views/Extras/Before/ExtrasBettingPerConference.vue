<template>
  <ExtrasBettingTable
    v-for="(division, index) in divisionsObj"
    :key="index"
    :title="`${conference} ${division}`"
    :teams="conferenceTeams[division]"
    :selectedChampion="selectedDivisionChampions[conference][division]"
    :selectedWildcards="selectedWildcards"
    :handleSelectChampion="handleSelectChampion"
    :handleSelectWildcard="handleSelectWildcard"
  />
</template>
<script setup lang="ts">
import { computed } from 'vue';

import type { TConference, TDivision, TDivisionChampions, TExtrasTeam } from '@/stores/extraBet.types';

import { useExtraBetStore } from '@/stores/extraBet';
import ExtrasBettingTable from '@/views/Extras/Before/ExtrasBettingTable.vue';

const props = defineProps<{
  conference: TConference;
  handleSelectChampion: (conference: TConference, division: TDivision, team: TExtrasTeam) => void;
  handleSelectWildcard: (conference: TConference, team: TExtrasTeam) => void;
  selectedDivisionChampions: TDivisionChampions;
  selectedWildcards: TExtrasTeam[];
}>();

// ------ Initialization ------
const extraBetStore = useExtraBetStore();
const divisionsObj: TDivision[] = ['North', 'East', 'South', 'West'];

// ------ Computed Properties ------
const conferenceTeams = computed(() => {
  if (props.conference === 'NFC') {
    return {
      East: extraBetStore.nfcTeams.East,
      North: extraBetStore.nfcTeams.North,
      South: extraBetStore.nfcTeams.South,
      West: extraBetStore.nfcTeams.West,
    };
  } else {
    return {
      East: extraBetStore.afcTeams.East,
      North: extraBetStore.afcTeams.North,
      South: extraBetStore.afcTeams.South,
      West: extraBetStore.afcTeams.West,
    };
  }
});
</script>
