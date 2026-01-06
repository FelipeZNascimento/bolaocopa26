<template>
  <PrimeDialog
    v-if="team"
    dismissableMask
    modal
    v-model:visible="isVisible"
    :draggable="false"
    :style="{ width: '1024px' }"
    :breakpoints="{ '1280px': '75vw', '575px': '90vw' }"
    contentClass="content-class"
  >
    <div class="teams-outer">
      <TeamComponent isScoreless :isGridMode="false" :team="team" :matchStatus="MATCH_STATUS.FINAL" />
    </div>
    <div class="bets-outer" v-if="teamWithExtras && team">
      <ExtrasBetsModalColumn
        :isCorrect="isCorrect(team.id, 'wildcard')"
        title="Wild Card"
        :users="getUsersFromTeamWithExtras('wildcard')"
      />
      <ExtrasBetsModalColumn
        title="Divisão"
        :users="getUsersFromTeamWithExtras('division')"
        :isCorrect="isCorrect(team.id, 'division')"
      />
      <ExtrasBetsModalColumn
        title="Conferência"
        :users="getUsersFromTeamWithExtras('conference')"
        :isCorrect="isCorrect(team.id, 'conference')"
      />
      <ExtrasBetsModalColumn
        title="Super Bowl"
        :users="getUsersFromTeamWithExtras('superbowl')"
        :isCorrect="isCorrect(team.id, 'superbowl')"
      />
    </div>
  </PrimeDialog>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import type { ITeamWithExtrasBet, TConference, TExtrasTeam } from '@/stores/extraBet.types';

import TeamComponent from '@/components/Match/TeamComponent.vue';
import { EXTRA_BETS_VALUES } from '@/constants/bets';
import { MATCH_STATUS } from '@/constants/match_status';
import { useExtraBetStore } from '@/stores/extraBet';

import ExtrasBetsModalColumn from './ExtrasBetsModalColumn.vue';

const props = defineProps<{
  handleCloseModal: () => void;
  team: null | TExtrasTeam;
  teamWithExtras: ITeamWithExtrasBet[];
}>();

// ------ Initialization ------

const extraBetStore = useExtraBetStore();

// ------ Refs ------

const isVisible = ref(false);

// ------ Computed Properties ------

const extraBetsResults = computed(() => extraBetStore.extraBetsResults);

// ------ Functions ------

function getUsersFromTeamWithExtras(type: 'conference' | 'division' | 'superbowl' | 'wildcard') {
  if (!props.team) {
    return [];
  }
  const conference: TConference = props.team.conference;

  if (type === 'conference') {
    const filtered = props.teamWithExtras
      .filter((bet) => props.team && bet.type === EXTRA_BETS_VALUES[conference])
      .map((bet) => bet.user)
      .sort((a, b) => a.name.localeCompare(b.name));
    return filtered;
  } else if (type === 'division') {
    const divisions = [
      EXTRA_BETS_VALUES[`${conference}_EAST`],
      EXTRA_BETS_VALUES[`${conference}_NORTH`],
      EXTRA_BETS_VALUES[`${conference}_SOUTH`],
      EXTRA_BETS_VALUES[`${conference}_WEST`],
    ];
    const filtered = props.teamWithExtras
      .filter((bet) => divisions.includes(bet.type))
      .map((bet) => bet.user)
      .sort((a, b) => a.name.localeCompare(b.name));
    return filtered;
  } else if (type === 'superbowl') {
    const filtered = props.teamWithExtras
      .filter((bet) => bet.type === EXTRA_BETS_VALUES.SUPERBOWL)
      .map((bet) => bet.user)
      .sort((a, b) => a.name.localeCompare(b.name));
    return filtered;
  } else if (type === 'wildcard') {
    const filtered = props.teamWithExtras
      .filter((bet) => props.team && bet.type === EXTRA_BETS_VALUES[`${conference}_WILDCARD`])
      .map((bet) => bet.user)
      .sort((a, b) => a.name.localeCompare(b.name));
    return filtered;
  }

  return [];
}

function isCorrect(teamId: number, type: 'conference' | 'division' | 'superbowl' | 'wildcard') {
  if (props.team === null || extraBetsResults.value === null) return false;

  const conference: TConference = props.team.conference;

  if (type === 'conference') {
    const teams = extraBetsResults.value.find((bet) => props.team && bet.type === EXTRA_BETS_VALUES[conference])?.teams;
    return teams?.some((team) => team.id === teamId) ?? false;
  } else if (type === 'division') {
    const divisions = [
      EXTRA_BETS_VALUES[`${conference}_EAST`],
      EXTRA_BETS_VALUES[`${conference}_NORTH`],
      EXTRA_BETS_VALUES[`${conference}_SOUTH`],
      EXTRA_BETS_VALUES[`${conference}_WEST`],
    ];
    const teams = extraBetsResults.value.filter((bet) => divisions.includes(bet.type)).flatMap((bet) => bet.teams);
    return teams?.some((team) => team.id === teamId) ?? false;
  } else if (type === 'superbowl') {
    const teams = extraBetsResults.value.find((bet) => bet.type === EXTRA_BETS_VALUES.SUPERBOWL)?.teams;
    return teams?.some((team) => team.id === teamId) ?? false;
  } else if (type === 'wildcard') {
    const teams = extraBetsResults.value
      .filter((bet) => props.team && bet.type === EXTRA_BETS_VALUES[`${conference}_WILDCARD`])
      .flatMap((bet) => bet.teams);
    return teams?.some((team) => team.id === teamId) ?? false;
  }

  return false;
}

// test();

watch(
  () => props.team,
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
