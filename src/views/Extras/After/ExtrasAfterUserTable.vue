<template>
  <div class="outer-extras-result-table">
    <PrimeDataTable tableClass="extras-table" :value="teams" dataKey="id" size="small" showGridlines>
      <template v-if="title" #header>
        <div>
          <h2>{{ title }}</h2>
        </div>
      </template>
      <PrimeColumn field="name">
        <template #header>
          <div class="team-line-outer" style="width: 100%">
            <div style="flex: 1">&nbsp;</div>
            <div class="spacer" v-tooltip.top="'Wild Card'">WC</div>
            <div class="spacer" v-tooltip.top="'Campeão Divisão'">Div</div>
            <div class="spacer" v-tooltip.top="'Campeão Conferência'">Conf</div>
            <div class="spacer" v-tooltip.top="'Vencedor Super Bowl'">SB</div>
          </div>
        </template>
        <template #body="slotProps">
          <div class="team-line-outer">
            <TeamComponent
              isScoreless
              :isAlias="true"
              :isGridMode="false"
              :team="slotProps.data"
              :matchStatus="MATCH_STATUS.FINAL"
            />
            <div
              class="spacer"
              :class="{
                highlight: isHighlighted(wildcardResults, slotProps.data.id),
              }"
            >
              <i
                v-if="wildcardBets.find((team) => team.id === slotProps.data.id)"
                class="pi pi-star-fill star-icon orange-star"
                v-tooltip.top="'Wild Card'"
              ></i>
            </div>
            <div
              class="spacer"
              :class="{
                highlight: isHighlighted(divisionResults, slotProps.data.id),
              }"
            >
              <i
                v-if="divisionBets.find((team) => team.id === slotProps.data.id)"
                class="pi pi-crown crown-icon golden-crown"
                v-tooltip.top="'Campeão Divisão'"
              ></i>
            </div>
            <div
              class="spacer"
              :class="{
                highlight: isHighlighted(conferenceResults, slotProps.data.id),
              }"
            >
              <i
                v-if="conferenceBets.find((team) => team.id === slotProps.data.id)"
                class="pi pi-sparkles sparkles-icon blue-sparkles"
                v-tooltip.top="'Campeão Conferência'"
              ></i>
            </div>
            <div
              class="spacer"
              :class="{
                highlight: isHighlighted(superbowlResults, slotProps.data.id),
              }"
            >
              <i
                v-if="superbowlBet.find((team) => team.id === slotProps.data.id)"
                class="pi pi-trophy trophy-icon mint-trophy"
                v-tooltip.top="'Super Bowl'"
              ></i>
            </div>
          </div>
        </template>
      </PrimeColumn>
    </PrimeDataTable>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, type Ref, watch } from 'vue';

import type { IExtraBetBet, TExtrasTeam } from '@/stores/extraBet.types';
import type { ITeam, TConference } from '@/stores/matches.types';

import TeamComponent from '@/components/Match/TeamComponent.vue';
import { EXTRA_BETS_VALUES } from '@/constants/bets';
import { MATCH_STATUS } from '@/constants/match_status';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useExtraBetStore } from '@/stores/extraBet';

const props = defineProps<{
  conference: TConference;
  teams: TExtrasTeam[];
  title?: string;
}>();

// ------ Refs ------

const wildcardBets = ref<ITeam[]>([]);
const divisionBets = ref<ITeam[]>([]);
const conferenceBets = ref<ITeam[]>([]);
const superbowlBet = ref<ITeam[]>([]);
const wildcardResults = ref<ITeam[]>([]);
const divisionResults = ref<ITeam[]>([]);
const conferenceResults = ref<ITeam[]>([]);
const superbowlResults = ref<ITeam[]>([]);

// ------ Initialization ------
const extraBetStore = useExtraBetStore();
const activeProfileStore = useActiveProfileStore();

// ------ Computed Properties ------
const extraBetsResults = computed(() => extraBetStore.extraBetsResults);
const loggedUserBets = computed(() => extraBetStore.loggedUserBets);
const activeProfile = computed(() => activeProfileStore.activeProfile);

// ------ Functions ------
function findConferenceChampions(betsArray: IExtraBetBet[], referenceVar: Ref<ITeam[]>) {
  if (!betsArray) return [];
  const conferenceChampions: ITeam[] = [];

  betsArray.forEach((bet) => {
    const betType = bet.type;
    if (betType === EXTRA_BETS_VALUES.AFC || betType === EXTRA_BETS_VALUES.NFC) {
      conferenceChampions.push(...bet.teams);
    }
  });

  referenceVar.value = [...conferenceChampions];
}

function findDivisionChampions(betsArray: IExtraBetBet[], referenceVar: Ref<ITeam[]>) {
  if (!betsArray) return [];
  const divisionChampions: ITeam[] = [];

  betsArray.forEach((bet) => {
    const betType = bet.type;
    if (
      betType === EXTRA_BETS_VALUES.AFC_NORTH ||
      betType === EXTRA_BETS_VALUES.AFC_EAST ||
      betType === EXTRA_BETS_VALUES.AFC_SOUTH ||
      betType === EXTRA_BETS_VALUES.AFC_WEST ||
      betType === EXTRA_BETS_VALUES.NFC_NORTH ||
      betType === EXTRA_BETS_VALUES.NFC_EAST ||
      betType === EXTRA_BETS_VALUES.NFC_SOUTH ||
      betType === EXTRA_BETS_VALUES.NFC_WEST
    ) {
      divisionChampions.push(...bet.teams);
    }
  });

  referenceVar.value = [...divisionChampions];
}

function findSuperBowlWinner(betsArray: IExtraBetBet[], referenceVar: Ref<ITeam[]>) {
  if (!betsArray) return [];
  const superbowlWinner: ITeam[] = [];

  betsArray.forEach((bet) => {
    const betType = bet.type;
    if (betType === EXTRA_BETS_VALUES.SUPERBOWL) {
      superbowlWinner.push(...bet.teams);
    }
  });

  referenceVar.value = [...superbowlWinner];
}

function findWildcardBets(betsArray: IExtraBetBet[], referenceVar: Ref<ITeam[]>) {
  if (!betsArray) return [];

  if (props.conference === 'AFC') {
    const wildcardTeams = betsArray.find((bet) => bet.type === EXTRA_BETS_VALUES.AFC_WILDCARD)?.teams;
    referenceVar.value = wildcardTeams || [];
  } else {
    const wildcardTeams = betsArray.find((bet) => bet.type === EXTRA_BETS_VALUES.NFC_WILDCARD)?.teams;
    referenceVar.value = wildcardTeams || [];
  }
}

function isHighlighted(winnersList: ITeam[], teamId: number) {
  return winnersList.find((winner) => winner.id === teamId);
}

findWildcardBets(loggedUserBets.value?.bets ?? [], wildcardBets);
findWildcardBets(extraBetsResults.value ?? [], wildcardResults);
findDivisionChampions(loggedUserBets.value?.bets ?? [], divisionBets);
findDivisionChampions(extraBetsResults.value ?? [], divisionResults);
findConferenceChampions(loggedUserBets.value?.bets ?? [], conferenceBets);
findConferenceChampions(extraBetsResults.value ?? [], conferenceResults);
findSuperBowlWinner(loggedUserBets.value?.bets ?? [], superbowlBet);
findSuperBowlWinner(extraBetsResults.value ?? [], superbowlResults);

watch(activeProfile, () => {
  if (!activeProfile.value) {
    wildcardBets.value = [];
    divisionBets.value = [];
    conferenceBets.value = [];
    superbowlBet.value = [];
  }
});
</script>
<style lang="scss">
.outer-extras-result-table {
  min-width: 500px;
  width: 500px;
  display: flex;
  align-items: center;
  flex-direction: column;

  @media (max-width: 767px) {
    width: 100%;
    min-width: 100%;
  }

  .extras-table {
    @media (max-width: 767px) {
      min-width: 100%;
      width: 100%;
    }

    @media (min-width: 768px) {
      min-width: 500px;
    }
  }

  .team-line-outer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: var(--xs-spacing);
  }

  .p-datatable {
    width: 100%;
    overflow-x: hidden !important;
  }

  .p-datatable-header-cell {
    padding: 0 !important;
  }

  .p-datatable-tbody > tr > td {
    padding: 0 !important;
  }

  .spacer {
    height: 40px;
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .crown-icon,
  .star-icon,
  .trophy-icon,
  .sparkles-icon {
    transition: all 0.2s;
    color: var(--color-text);
  }

  .golden-crown,
  .orange-star,
  .mint-trophy,
  .blue-sparkles {
    color: var(--color-text);
    padding: var(--s-spacing);
    font-size: var(--l-font-size);
  }

  .golden-crown {
    color: var(--bolao-c-gold);
  }

  .orange-star {
    color: var(--bolao-c-orange);
  }

  .mint-trophy {
    color: var(--bolao-c-mint);
  }

  .blue-sparkles {
    color: var(--bolao-c-sky);
  }

  .highlight {
    box-shadow: 0px 0px 1px 1px rgba(white, 0.75) inset;
    -webkit-box-shadow: 0px 0px 1px 2px rgba(white, 0.75) inset;
    -moz-box-shadow: 0px 0px 1px 1px rgba(white, 0.75) inset;
    background-color: var(--bolao-c-mint-t1);
  }
}
</style>
