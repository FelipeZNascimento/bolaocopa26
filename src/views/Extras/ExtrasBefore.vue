<template>
  <div class="outer">
    <h2 style="text-align: center;">Minhas Apostas</h2>
    <div style="position: relative; display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
      <!-- Overlay spinner when updating -->
      <div v-if="isLoadingExtras || isLoadingTeams || isUpdatingExtras" class="update-overlay">
        <PrimeProgressSpinner
          style="width: 50px; height: 50px"
          strokeWidth="4"
        />
      </div>

      <div
        v-for="option in buttonOptions"
        :key="option.value"
        class="team-card"
        @click="selectedToggle.value = option.value"
      >
        <div class="team-name">
          {{ option.label }}
        </div>

        <div class="flag-container" v-if="option.selectedTeam">
          <img
            :src="`https://assets.omegafox.me/copa/countries_flags/${option.selectedTeam?.isoCode.toLowerCase()}.png`"
            :alt="`${option.selectedTeam?.name} Flag`"
            class="team-flag"
          />
        </div>
        <div class="team-name" v-if="option.selectedTeam">
          {{ option.selectedTeam?.name }}
        </div>
      </div>
    </div>
    <PrimeDivider />
    <div class="buttons-outer">
      <PrimeButton
        v-for="item in buttonOptions"
        :key="item.value"
        :label="item.label"
        variant="outlined"
        size="small"
        :severity="
          selectedToggle.value === item.value ? 'primary' : 'secondary'
        "
        @click="selectedToggle.value = item.value"
        rounded
      />
    </div>
    <h2>{{ currentSelectedToggle?.label }}</h2>
    <div class="teams-grid" v-if="currentSelectedToggle?.value != EXTRA_BETS_VALUES.TOP_SCORER && currentSelectedToggle?.value != EXTRA_BETS_VALUES.BEST_PLAYER">
      <div
        v-for="team in teams"
        :key="team.id"
        class="team-card"
        :class="{ selected: currentSelectedToggle?.selectedTeam?.id === team.id }"
        @click="handleClick(team)"
      >
        <div class="flag-container">
          <img
            :src="`https://assets.omegafox.me/copa/countries_flags/${team.isoCode.toLowerCase()}.png`"
            :alt="`${team.name} Flag`"
            class="team-flag"
          />
        </div>
        <div class="team-name">
          {{ team.name }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

import type { IPlayer, ITeam } from '@/stores/teams.types';

import { EXTRA_BETS_LABELS, EXTRA_BETS_VALUES, type TEXTRA_BETS_LABELS, type TEXTRA_BETS_VALUES } from '@/constants/bets';
import ExtraBetService from '@/services/extra_bet';
import TeamService from '@/services/team';
import { useExtraBetStore } from '@/stores/extraBet';
import { useNotificationStore } from '@/stores/notification';
import { useTeamsStore } from '@/stores/teams';

// ------ Types & Interfaces ------
interface IToggleOption {
  label: TEXTRA_BETS_LABELS;
  selectedPlayer?: IPlayer | null;
  selectedTeam?: ITeam | null;
  value: TEXTRA_BETS_VALUES;
}

// ------ Services & Stores ------
const teamsStore = useTeamsStore();
const extraBetStore = useExtraBetStore();
const teamsService = new TeamService();
const extraBetService = new ExtraBetService();
const notificationStore = useNotificationStore();

// ------ Refs ------
// const selectedTeam = ref<ITeam | null>(null);
const selectedToggle = ref<IToggleOption>({
  label: EXTRA_BETS_LABELS[EXTRA_BETS_VALUES.CHAMPION],
  value: EXTRA_BETS_VALUES.CHAMPION,
});

const buttonOptions = ref<IToggleOption[]>([
  {
    label: EXTRA_BETS_LABELS[EXTRA_BETS_VALUES.CHAMPION],
    selectedTeam: null,
    value: EXTRA_BETS_VALUES.CHAMPION,
  },
  {
    label: EXTRA_BETS_LABELS[EXTRA_BETS_VALUES.TOP_SCORER],
    selectedPlayer: null,
    selectedTeam: null,
    value: EXTRA_BETS_VALUES.TOP_SCORER,
  },
  {
    label: EXTRA_BETS_LABELS[EXTRA_BETS_VALUES.OFFENSE],
    selectedTeam: null,
    value: EXTRA_BETS_VALUES.OFFENSE,
  },
  {
    label: EXTRA_BETS_LABELS[EXTRA_BETS_VALUES.DEFENSE],
    selectedTeam: null,
    value: EXTRA_BETS_VALUES.DEFENSE,
  },
  {
    label: EXTRA_BETS_LABELS[EXTRA_BETS_VALUES.BEST_PLAYER],
    selectedPlayer: null,
    selectedTeam: null,
    value: EXTRA_BETS_VALUES.BEST_PLAYER,
  },
]);

// ------ Computed Properties ------
const isLoadingExtras = computed(() => extraBetStore.isLoading);
const isUpdatingExtras = computed(() => extraBetStore.isUpdating);
const activeProfileBets = computed(() => extraBetStore.activeProfileBets);
const isLoadingTeams = computed(() => teamsStore.isLoading);
const teams = computed(() => teamsStore.teams);
const currentSelectedToggle = computed(() => buttonOptions.value.find(
  (option) => option.value === selectedToggle.value.value,
));

// ------ Initialization ------
teamsService.fetch();

// Initialize button options from activeProfileBets
function initializeButtonOptions() {
  activeProfileBets.value.forEach((bet) => {
    const option = buttonOptions.value.find((opt) => opt.value === bet.extraType);
    if (option) {
      option.selectedTeam = bet.team;
      if (bet.extraType === EXTRA_BETS_VALUES.TOP_SCORER || bet.extraType === EXTRA_BETS_VALUES.BEST_PLAYER) {
        option.selectedPlayer = bet.player;
      }
    }
  });
}

// Watch for changes in activeProfileBets to initialize selections
watch(activeProfileBets, () => {
  initializeButtonOptions();
}, { immediate: true });

onMounted(() => {
  initializeButtonOptions();
});

// ------ Functions ------
async function handleClick(team: ITeam) {
  if (currentSelectedToggle.value) {
    // Save the previous state for potential rollback
    const previousTeam = currentSelectedToggle.value.selectedTeam;

    // Optimistically update UI
    if (currentSelectedToggle.value.selectedTeam?.id === team.id) {
      currentSelectedToggle.value.selectedTeam = null;
    } else {
      currentSelectedToggle.value.selectedTeam = team;
    }

    console.log('Selected Team:', currentSelectedToggle.value.selectedTeam);
    console.log('Selected Toggle:', currentSelectedToggle.value.value);

    await extraBetService.update(
      {
        extraType: currentSelectedToggle.value.value,
        teamId: currentSelectedToggle.value.selectedTeam?.id || null,
      },
      (isSuccess: boolean, error?: Error) => {
        if (isSuccess) {
          // Refresh the extra bets from the store to reflect the update
          extraBetService.fetch();
          notificationStore.success(
            `${currentSelectedToggle.value?.label}: ${currentSelectedToggle.value?.selectedTeam?.name || 'Nenhum'}`,
            'Aposta feita com sucesso'
          );
        } else {
          console.error('Failed to update extra bet:', error);
          // Revert to previous state on failure
          if (currentSelectedToggle.value) {
            currentSelectedToggle.value.selectedTeam = previousTeam;
          }
          notificationStore.error(`Falha ao atualizar a aposta`);
        }
      },
    );
  }
}

</script>
<style lang="scss" scoped>
.outer {
  display: flex;
  flex-direction: column;
  gap: var(--m-spacing);
  align-items: center;
  justify-content: space-between;
  padding: var(--l-spacing) 160px;

  @media (width <= 768px) {
    padding: var(--xxl-spacing) var(--s-spacing);
  }
}

.buttons-outer {
  display: flex;
  flex-wrap: wrap;
  gap: var(--m-spacing);
  justify-content: center;
}

.skeleton {
  height: 200px !important;
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: var(--l-spacing);
  width: 100%;

  @media (width <= 768px) {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: var(--m-spacing);
  }
}

.team-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--s-spacing);
  align-items: center;
  justify-content: flex-start;
  min-width: 120px;
  min-height: 120px;
  padding: var(--s-spacing);
  cursor: pointer;
  background-color: var(--bolao-c-white-t1);
  border: 2px solid transparent;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--bolao-c-white-t1);
    box-shadow: 0 4px 8px rgb(0 0 0 / 20%);
    transform: translateY(-2px);
  }

  &.selected {
    background-color: var(--bolao-c-blue-t2);
    border-color: var(--bolao-c-white-t1);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-main) 20%, transparent);
  }

  @media (width <= 768px) {
    min-width: 80px;
    min-height: 80px;
    padding: var(--xs-spacing);
  }
}

.flag-container {
  display: flex;
  flex: 1;
  align-items: flex-start;
  justify-content: center;
  width: 80px;
  height: 50px;

  @media (width <= 768px) {
    width: 50px;
    height: 30px;
  }
}

.team-flag {
  width: 80px;
  height: 50px;
  object-fit: cover;
  filter: drop-shadow(0 2px 4px rgb(0 0 0 / 10%));

  @media (width <= 768px) {
    width: 50px;
    height: 30px;
  }
}

.team-name {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: var(--s-font-size);
  font-weight: 600;
  line-height: 1.2;
  color: var(--color-contrast);
  text-align: center;

  // white-space: nowrap;

  @media (width <= 768px) {
    font-size: var(--xs-font-size);
  }
}

.update-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(0 0 0 / 30%);
  border-radius: var(--border-radius);
  backdrop-filter: blur(2px);
}

</style>
