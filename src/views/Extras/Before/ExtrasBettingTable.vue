<template>
  <div class="outer-extras-betting-table">
    <PrimeDataTable tableClass="extras-table" :value="teams" dataKey="id" size="small" showGridlines>
      <template #header>
        <div>
          <h2>{{ title }}</h2>
        </div>
      </template>
      <PrimeColumn field="name">
        <template #body="slotProps">
          <TeamComponent
            class="team-component"
            isScoreless
            :isAlias="true"
            :isGridMode="false"
            :team="slotProps.data"
            :matchStatus="MATCH_STATUS.FINAL"
          />
        </template>
      </PrimeColumn>
      <PrimeColumn v-if="handleSelectWildcard" class="wildcard-column" header="Wild Card">
        <template #body="slotProps">
          <div v-if="isUpdating">
            <i class="pi pi-spin pi-spinner"></i>
          </div>
          <div
            v-else
            class="icon-outer"
            @click="() => handleSelectWildcard && handleSelectWildcard(slotProps.data.conference, slotProps.data)"
          >
            <i
              class="pi star-icon"
              :class="
                selectedWildcards?.find((t) => t.id === slotProps.data.id) ? 'orange-star pi-star-fill' : 'pi-star'
              "
            >
            </i>
          </div>
        </template>
      </PrimeColumn>
      <PrimeColumn v-if="handleSelectConferenceChampion" class="champion-column" header="Campeão">
        <template #body="slotProps">
          <div v-if="isUpdating">
            <i class="pi pi-spin pi-spinner"></i>
          </div>
          <div
            v-else
            class="icon-outer"
            @click="
              () =>
                handleSelectConferenceChampion &&
                handleSelectConferenceChampion(slotProps.data.conference, slotProps.data.division, slotProps.data)
            "
          >
            <i
              class="pi pi-sparkles sparkles-icon"
              :class="{ 'blue-sparkles': selectedConferenceChampion?.id === slotProps.data.id }"
            ></i>
          </div>
        </template>
      </PrimeColumn>
      <PrimeColumn v-if="handleSelectChampion" class="champion-column" header="Vencedor">
        <template #body="slotProps">
          <div v-if="isUpdating">
            <i class="pi pi-spin pi-spinner"></i>
          </div>
          <div
            v-else
            class="icon-outer"
            @click="
              () =>
                handleSelectChampion &&
                handleSelectChampion(slotProps.data.conference, slotProps.data.division, slotProps.data)
            "
          >
            <i
              class="pi pi-crown crown-icon"
              :class="{ 'golden-crown': selectedChampion?.id === slotProps.data.id }"
            ></i>
          </div>
        </template>
      </PrimeColumn>

      <PrimeColumn v-if="handleSelectSuperBowl" class="wildcard-column" header="Super Bowl">
        <template #body="slotProps">
          <div v-if="isUpdating">
            <i class="pi pi-spin pi-spinner"></i>
          </div>
          <div v-else class="icon-outer" @click="() => handleSelectSuperBowl && handleSelectSuperBowl(slotProps.data)">
            <i
              class="pi trophy-icon pi-trophy"
              :class="selectedSuperBowl?.id === slotProps.data.id ? 'mint-trophy' : ''"
            >
            </i>
          </div>
        </template>
      </PrimeColumn>
    </PrimeDataTable>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';

import type { TExtrasTeam } from '@/stores/extraBet.types';
import type { TConference, TDivision } from '@/stores/matches.types';

import TeamComponent from '@/components/Match/TeamComponent.vue';
import { MATCH_STATUS } from '@/constants/match_status';
import { useExtraBetStore } from '@/stores/extraBet';

defineProps<{
  division?: TDivision;
  handleSelectChampion?: (conference: TConference, division: TDivision, team: TExtrasTeam) => void;
  handleSelectConferenceChampion?: (conference: TConference, division: TDivision, team: TExtrasTeam) => void;
  handleSelectSuperBowl?: (team: TExtrasTeam) => void;
  handleSelectWildcard?: (conference: TConference, team: TExtrasTeam) => void;
  selectedChampion?: null | TExtrasTeam;
  selectedConferenceChampion?: null | TExtrasTeam;
  selectedSuperBowl?: null | TExtrasTeam;
  selectedWildcards?: TExtrasTeam[];
  teams: TExtrasTeam[];
  title: string;
}>();

// ------ Initialization ------
const extraBetStore = useExtraBetStore();

// ------ Computed Properties ------
const isUpdating = computed(() => extraBetStore.isUpdating);
</script>
<style lang="scss">
.outer-extras-betting-table {
  min-width: 400px;
  width: 400px;
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
      min-width: 400px;
    }
  }

  .p-datatable {
    width: 100%;
    overflow-x: hidden !important;
  }

  .p-datatable-column-header-content {
    display: inline-block;
  }

  .p-datatable-tbody > tr > td {
    padding: 0 !important;
  }

  .champion-column,
  .wildcard-column {
    text-align: center;
    justify-content: center;
    align-items: center;
    transition: all 0.2s;
    padding: 0 !important;
    margin: 0 !important;
    width: 80px;

    &:hover {
      background-color: var(--bolao-c-grey5-t1);
    }
  }

  .shield-and-name {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: var(--l-spacing);
    font-size: var(--s-font-size);

    img {
      height: 50px;
    }

    @media (max-width: 1024px) {
      font-size: var(--s-font-size);
      gap: var(--xxs-spacing);
      flex-direction: column;

      img {
        height: 60px;
      }
    }
  }

  .icon-outer {
    height: 60px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:hover {
      .crown-icon,
      .star-icon,
      .trophy-icon,
      .sparkles-icon {
        transform: scale(1.2);
      }
    }
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
}
</style>
