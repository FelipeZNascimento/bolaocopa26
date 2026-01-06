<!-- <template>&nbsp;</template> -->
<template>
  <div class="outer-extras">
    <h1>Extras</h1>
    <PrimeSelectButton :allowEmpty="false" size="small" v-model="selectedToggle" :options="buttonOptions" />
    <div v-if="isLoading" class="extras-betting-table-skeleton-outer">
      <PrimeSkeleton class="skeleton" />
      <PrimeSkeleton class="skeleton" />
    </div>
    <div v-else-if="selectedToggle === 'Playoffs'" class="outer-extras-tables">
      <ExtrasBettingPlayoffs
        :selectedConferenceChampions="selectedConferenceChampions"
        :selectedSuperBowl="selectedSuperBowl"
        :handleSelectChampion="handleSelectChampion"
        :handleSelectSuperBowl="handleSelectSuperBowl"
      />
    </div>
    <div v-else class="outer-extras-tables">
      <ExtrasBettingPerConference
        :conference="selectedToggle"
        :conferenceTeams="selectedToggle === 'AFC' ? afcTeams : nfcTeams"
        :selectedDivisionChampions="selectedDivisionChampions"
        :selectedWildcards="selectedWildcards[selectedToggle]"
        :handleSelectChampion="handleSelectChampion"
        :handleSelectWildcard="handleSelectWildcard"
      />
    </div>
  </div>
  <ExtrasBettingCounter
    alignment="left"
    conference="AFC"
    :selectedConferenceChampion="selectedConferenceChampions.AFC"
    :selectedDivisionChampions="selectedDivisionChampions.AFC"
    :selectedWildcards="selectedWildcards.AFC"
    :selectedSuperBowlWinner="selectedSuperBowl"
  />
  <ExtrasBettingCounter
    alignment="right"
    conference="NFC"
    :selectedConferenceChampion="selectedConferenceChampions.NFC"
    :selectedDivisionChampions="selectedDivisionChampions.NFC"
    :selectedWildcards="selectedWildcards.NFC"
    :selectedSuperBowlWinner="selectedSuperBowl"
  />
</template>
<script setup lang="ts">
import { useToast } from 'primevue';
import { computed, ref, watchEffect } from 'vue';

import type {
  TConference,
  TConferenceChampions,
  TDivision,
  TDivisionChampions,
  TExtrasBeforeToggle,
  TExtrasTeam,
  TWildcards,
} from '@/stores/extraBet.types';

import { EXTRA_BETS_VALUES } from '@/constants/bets';
import ExtraBetService from '@/services/extra_bet';
import { useExtraBetStore } from '@/stores/extraBet';

import ExtrasBettingCounter from './Before/ExtrasBettingCounter.vue';
import ExtrasBettingPerConference from './Before/ExtrasBettingPerConference.vue';
import ExtrasBettingPlayoffs from './Before/ExtrasBettingPlayoffs.vue';

// ------ Refs ------
const selectedToggle = ref<TExtrasBeforeToggle>('AFC');
const buttonOptions = ref<TExtrasBeforeToggle[]>(['AFC', 'NFC', 'Playoffs']);
const selectedConferenceChampions = ref<TConferenceChampions>({
  AFC: null,
  NFC: null,
});
const selectedDivisionChampions = ref<TDivisionChampions>({
  AFC: {
    East: null,
    North: null,
    South: null,
    West: null,
  },
  NFC: {
    East: null,
    North: null,
    South: null,
    West: null,
  },
});
const selectedWildcards = ref<TWildcards>({
  AFC: [],
  NFC: [],
});
const selectedSuperBowl = ref<null | TExtrasTeam>(null);

// ------ Initialization ------
const extraBetService = new ExtraBetService();
const extraBetStore = useExtraBetStore();
const toast = useToast();

// ------ Computed Properties ------
const isLoading = computed(() => extraBetStore.isLoading);
const loggedUserBets = computed(() => extraBetStore.loggedUserBets);
const afcTeams = computed(() => {
  return {
    East: extraBetStore.afcTeams.East,
    North: extraBetStore.afcTeams.North,
    South: extraBetStore.afcTeams.South,
    West: extraBetStore.afcTeams.West,
  };
});

const nfcTeams = computed(() => {
  return {
    East: extraBetStore.nfcTeams.East,
    North: extraBetStore.nfcTeams.North,
    South: extraBetStore.nfcTeams.South,
    West: extraBetStore.nfcTeams.West,
  };
});

// ------ Watch Effects ------
watchEffect(() => {
  selectedConferenceChampions.value.AFC =
    loggedUserBets.value?.bets.find((bet) => bet.type === EXTRA_BETS_VALUES.AFC)?.teams[0] || null;
  selectedConferenceChampions.value.NFC =
    loggedUserBets.value?.bets.find((bet) => bet.type === EXTRA_BETS_VALUES.NFC)?.teams[0] || null;
  selectedDivisionChampions.value.AFC.East =
    loggedUserBets.value?.bets.find((bet) => bet.type === EXTRA_BETS_VALUES.AFC_EAST)?.teams[0] || null;
  selectedDivisionChampions.value.AFC.North =
    loggedUserBets.value?.bets.find((bet) => bet.type === EXTRA_BETS_VALUES.AFC_NORTH)?.teams[0] || null;
  selectedDivisionChampions.value.AFC.South =
    loggedUserBets.value?.bets.find((bet) => bet.type === EXTRA_BETS_VALUES.AFC_SOUTH)?.teams[0] || null;
  selectedDivisionChampions.value.AFC.West =
    loggedUserBets.value?.bets.find((bet) => bet.type === EXTRA_BETS_VALUES.AFC_WEST)?.teams[0] || null;
  selectedDivisionChampions.value.NFC.East =
    loggedUserBets.value?.bets.find((bet) => bet.type === EXTRA_BETS_VALUES.NFC_EAST)?.teams[0] || null;
  selectedDivisionChampions.value.NFC.North =
    loggedUserBets.value?.bets.find((bet) => bet.type === EXTRA_BETS_VALUES.NFC_NORTH)?.teams[0] || null;
  selectedDivisionChampions.value.NFC.South =
    loggedUserBets.value?.bets.find((bet) => bet.type === EXTRA_BETS_VALUES.NFC_SOUTH)?.teams[0] || null;
  selectedDivisionChampions.value.NFC.West =
    loggedUserBets.value?.bets.find((bet) => bet.type === EXTRA_BETS_VALUES.NFC_WEST)?.teams[0] || null;
  selectedWildcards.value.AFC =
    loggedUserBets.value?.bets.find((bet) => bet.type === EXTRA_BETS_VALUES.AFC_WILDCARD)?.teams || [];
  selectedWildcards.value.NFC =
    loggedUserBets.value?.bets.find((bet) => bet.type === EXTRA_BETS_VALUES.NFC_WILDCARD)?.teams || [];
  selectedSuperBowl.value =
    loggedUserBets.value?.bets.find((bet) => bet.type === EXTRA_BETS_VALUES.SUPERBOWL)?.teams[0] || null;
});

// ------ Functions ------

function fillSelectedFromStore() {
  selectedConferenceChampions.value.AFC =
    loggedUserBets.value?.bets.find((bet) => bet.type === EXTRA_BETS_VALUES.AFC)?.teams[0] || null;
  selectedConferenceChampions.value.NFC =
    loggedUserBets.value?.bets.find((bet) => bet.type === EXTRA_BETS_VALUES.NFC)?.teams[0] || null;
  selectedDivisionChampions.value.AFC.East =
    loggedUserBets.value?.bets.find((bet) => bet.type === EXTRA_BETS_VALUES.AFC_EAST)?.teams[0] || null;
  selectedDivisionChampions.value.AFC.North =
    loggedUserBets.value?.bets.find((bet) => bet.type === EXTRA_BETS_VALUES.AFC_NORTH)?.teams[0] || null;
  selectedDivisionChampions.value.AFC.South =
    loggedUserBets.value?.bets.find((bet) => bet.type === EXTRA_BETS_VALUES.AFC_SOUTH)?.teams[0] || null;
  selectedDivisionChampions.value.AFC.West =
    loggedUserBets.value?.bets.find((bet) => bet.type === EXTRA_BETS_VALUES.AFC_WEST)?.teams[0] || null;
  selectedDivisionChampions.value.NFC.East =
    loggedUserBets.value?.bets.find((bet) => bet.type === EXTRA_BETS_VALUES.NFC_EAST)?.teams[0] || null;
  selectedDivisionChampions.value.NFC.North =
    loggedUserBets.value?.bets.find((bet) => bet.type === EXTRA_BETS_VALUES.NFC_NORTH)?.teams[0] || null;
  selectedDivisionChampions.value.NFC.South =
    loggedUserBets.value?.bets.find((bet) => bet.type === EXTRA_BETS_VALUES.NFC_SOUTH)?.teams[0] || null;
  selectedDivisionChampions.value.NFC.West =
    loggedUserBets.value?.bets.find((bet) => bet.type === EXTRA_BETS_VALUES.NFC_WEST)?.teams[0] || null;
  selectedWildcards.value.AFC =
    loggedUserBets.value?.bets.find((bet) => bet.type === EXTRA_BETS_VALUES.AFC_WILDCARD)?.teams || [];
  selectedWildcards.value.NFC =
    loggedUserBets.value?.bets.find((bet) => bet.type === EXTRA_BETS_VALUES.NFC_WILDCARD)?.teams || [];
  selectedSuperBowl.value =
    loggedUserBets.value?.bets.find((bet) => bet.type === EXTRA_BETS_VALUES.SUPERBOWL)?.teams[0] || null;
}

function handleSelectChampion(conference: TConference, division: TDivision, team: TExtrasTeam) {
  if (selectedToggle.value === 'Playoffs') {
    // If the clicked conference champion is the currently selected, remove it
    if (selectedConferenceChampions.value[conference]?.id === team.id) {
      selectedConferenceChampions.value = {
        ...selectedConferenceChampions.value,
        [conference]: null,
      };
    } else {
      selectedConferenceChampions.value = {
        ...selectedConferenceChampions.value,
        [conference]: team,
      };
    }
  } else {
    // Add/replace current selected conference champion
    if (selectedDivisionChampions.value[conference][division]?.id === team.id) {
      selectedDivisionChampions.value = {
        ...selectedDivisionChampions.value,
        [conference]: {
          ...selectedDivisionChampions.value?.[conference],
          [division]: null,
        },
      };
    } else {
      selectedDivisionChampions.value = {
        ...selectedDivisionChampions.value,
        [conference]: {
          ...selectedDivisionChampions.value?.[conference],
          [division]: team,
        },
      };
    }
  }

  triggerUpdate();
}

function handleSelectSuperBowl(team: TExtrasTeam) {
  if (selectedSuperBowl.value?.id === team.id) {
    selectedSuperBowl.value = null;
  } else {
    selectedSuperBowl.value = team;
  }

  triggerUpdate();
}

function handleSelectWildcard(conference: TConference, team: TExtrasTeam) {
  const currentWildcards = selectedWildcards.value[conference];
  if (currentWildcards.find((t) => t.id === team.id)) {
    // If the clicked wild card is in the current selected wild cards, remove it
    selectedWildcards.value = {
      ...selectedWildcards.value,
      [conference]: currentWildcards.filter((t) => t.id !== team.id),
    };

    triggerUpdate();
  } else if (selectedWildcards.value[conference].length < 3) {
    // If there's still space for wild cards, add it
    selectedWildcards.value = {
      ...selectedWildcards.value,
      [conference]: [...currentWildcards, team],
    };

    triggerUpdate();
  } else {
    // If the user is trying to add a 4th wild card, trigger toast
    toast.add({
      detail: `Para escolher uma nova equipe, remova a aposta numa das equipes já selecionadas`,
      life: 5000,
      severity: 'info',
      summary: 'Máximo de 3 wild cards por Conferência',
    });
  }
}

function triggerUpdate() {
  const updateObject = {
    [EXTRA_BETS_VALUES.AFC]: selectedConferenceChampions.value.AFC?.id || null,
    [EXTRA_BETS_VALUES.AFC_EAST]: selectedDivisionChampions.value.AFC.East?.id || null,
    [EXTRA_BETS_VALUES.AFC_NORTH]: selectedDivisionChampions.value.AFC.North?.id || null,
    [EXTRA_BETS_VALUES.AFC_SOUTH]: selectedDivisionChampions.value.AFC.South?.id || null,
    [EXTRA_BETS_VALUES.AFC_WEST]: selectedDivisionChampions.value.AFC.West?.id || null,
    [EXTRA_BETS_VALUES.AFC_WILDCARD]: selectedWildcards.value.AFC.map((team) => team.id),
    [EXTRA_BETS_VALUES.NFC]: selectedConferenceChampions.value.NFC?.id || null,
    [EXTRA_BETS_VALUES.NFC_EAST]: selectedDivisionChampions.value.NFC.East?.id || null,
    [EXTRA_BETS_VALUES.NFC_NORTH]: selectedDivisionChampions.value.NFC.North?.id || null,
    [EXTRA_BETS_VALUES.NFC_SOUTH]: selectedDivisionChampions.value.NFC.South?.id || null,
    [EXTRA_BETS_VALUES.NFC_WEST]: selectedDivisionChampions.value.NFC.West?.id || null,
    [EXTRA_BETS_VALUES.NFC_WILDCARD]: selectedWildcards.value.NFC.map((team) => team.id),
    [EXTRA_BETS_VALUES.SUPERBOWL]: selectedSuperBowl.value?.id || null,
  };

  extraBetService.update(updateObject, updateCallback);
}

function updateCallback(isSuccess: boolean, error?: Error) {
  if (isSuccess) {
    toast.add({
      life: 3000,
      severity: 'success',
      summary: 'Aposta extra atualizada',
    });
  } else {
    // Revert to previous values
    fillSelectedFromStore();

    console.error('Error updating bet:', error);
    toast.add({
      detail: `${error?.message}`,
      life: 5000,
      severity: 'error',
      summary: 'Erro ao atualizar aposta',
    });
  }
}
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

.extras-betting-table-skeleton-outer {
  display: flex;
  gap: var(--l-spacing);
  width: 100%;

  @media (max-width: 767px) {
    flex-direction: column;
  }

  .skeleton {
    min-width: 400px;
    width: 400px;
    height: 400px !important;

    @media (max-width: 767px) {
      width: 100% !important;
      min-width: 100% !important;
    }
  }
}
</style>
