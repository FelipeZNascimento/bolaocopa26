<template>
  <PrimeDialog
    v-model:visible="isVisible"
    dismissable-mask
    modal
    :draggable="false"
    :style="{ width: '600px' }"
    :breakpoints="{ '768px': '90vw' }"
  >
    <template #header>
      <div class="modal-header">
        <div class="step-indicator">
          <span :class="['step-dot', { 'step-dot--active': step === 1, 'step-dot--done': step > 1 }]">
            <i
              v-if="step > 1"
              class="pi pi-check"
            />
            <span v-else>1</span>
          </span>
          <span class="step-line" />
          <span :class="['step-dot', { 'step-dot--active': step === 2 }]">2</span>
        </div>
        <h2 v-if="step === 1">{{ t('extraBets.championChangeModal.title') }}</h2>
        <div
          v-else
          class="header-team"
        >
          <Transition
            name="fade"
            mode="out-in"
          >
            <div
              v-if="selectedTeam"
              :key="selectedTeam.id"
              class="header-team__selected"
            >
              <img
                :src="`https://assets.omegafox.me/copa/countries_flags/${selectedTeam.isoCode.toLowerCase()}.png`"
                :alt="locale === 'pt-BR' ? selectedTeam.name : selectedTeam.nameEn"
                class="header-team__flag"
              />
              <h2>{{ locale === 'pt-BR' ? selectedTeam.name : selectedTeam.nameEn }}</h2>
            </div>
            <h2
              v-else
              key="placeholder"
            >
              {{ t('extraBets.championChangeModal.title') }}
            </h2>
          </Transition>
        </div>
      </div>
    </template>

    <Transition
      name="step"
      mode="out-in"
    >
      <!-- Step 1: Confirmation -->
      <div
        v-if="step === 1"
        key="step1"
      >
        <h2 style="padding: var(--m-spacing) 0; font-weight: bold; color: var(--bolao-c-red-l1); text-align: center">
          {{ t('extraBets.championChangeModal.warning') }}
        </h2>
        <p>{{ t('extraBets.championChangeModal.message1') }}</p>
        <p style="padding: var(--m-spacing) 0">
          {{ t('extraBets.championChangeModal.currentRound', { round: clockStore.getRoundName(currentRound) }) }}
        </p>
        <p>{{ t('extraBets.championChangeModal.tableMessage') }}</p>
        <PrimeDataTable
          :value="guideData"
          show-gridlines
          scrollable
          class="bets-table"
          size="small"
        >
          <PrimeColumn
            field="type"
            :header="t('rules.extras.tableHeaders.betType')"
            class="column"
          />
          <PrimeColumn
            :header="t('rules.extras.tableHeaders.beforeGroups')"
            class="column"
            field="beforeGroups"
          />
          <PrimeColumn
            :header="t('rules.extras.tableHeaders.beforePlayoffs')"
            class="column"
            field="beforePlayoffs"
          />
          <PrimeColumn
            :header="t('rules.extras.tableHeaders.beforeR16')"
            class="column"
            field="beforeQuarter"
          />
        </PrimeDataTable>
        <h3 style="padding: var(--m-spacing) 0; font-weight: bold; text-align: center">
          {{ t('extraBets.championChangeModal.irreversibleAction') }}
        </h3>
      </div>

      <!-- Step 2: Team selection -->
      <div
        v-else
        key="step2"
        class="teams-container"
      >
        <div class="teams-grid">
          <div
            v-for="team in teams"
            :key="team.id"
            :class="{ 'team-wrapper--current': team.id === currentChampion?.id }"
            class="team-wrapper"
          >
            <ClickableTeamCard
              :team="team"
              :is-loading="false"
              :is-selected="selectedTeam?.id === team.id || team.id === currentChampion?.id"
              :handle-click="team.id === currentChampion?.id ? undefined : selectTeam"
            />
          </div>
        </div>
      </div>
    </Transition>

    <template #footer>
      <Transition
        name="fade"
        mode="out-in"
      >
        <div
          v-if="step === 1"
          key="footer1"
          class="footer-buttons"
        >
          <PrimeButton
            icon="pi pi-arrow-left"
            :label="t('extraBets.championChangeModal.cancelButton')"
            size="small"
            variant="text"
            @click="isVisible = false"
          />
          <PrimeButton
            variant="outline"
            severity="secondary"
            icon="pi pi-arrow-right"
            icon-pos="right"
            size="small"
            :label="t('extraBets.championChangeModal.confirmButton')"
            @click="step = 2"
          />
        </div>
        <div
          v-else
          key="footer2"
          class="footer-buttons"
        >
          <PrimeButton
            icon="pi pi-arrow-left"
            :label="t('extraBets.championChangeModal.teamSelectionStep.backButton')"
            variant="text"
            size="small"
            @click="step = 1"
          />
          <PrimeButton
            severity="danger"
            :disabled="!selectedTeam"
            :label="t('extraBets.championChangeModal.teamSelectionStep.confirmButton')"
            size="small"
            @click="confirmChange"
          />
        </div>
      </Transition>
    </template>
  </PrimeDialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import type { ITeam } from '@/stores/teams.types';

import ClickableTeamCard from '@/components/ClickableTeamCard.vue';
import { useScrollLock } from '@/composables/useScrollLock';
import { useClockStore } from '@/stores/clock';
import { useConfigurationStore } from '@/stores/configuration';
import { useTeamsStore } from '@/stores/teams';

const props = defineProps<{
  currentChampion?: ITeam;
  handleChampionChange: (team: ITeam) => void;
  handleCloseModal: () => void;
  isOpen: boolean;
}>();

const isVisible = ref(false);
const step = ref<1 | 2>(1);
const selectedTeam = ref<ITeam | null>(null);

const configurationStore = useConfigurationStore();
const clockStore = useClockStore();
const teamsStore = useTeamsStore();
const { locale, t, tm } = useI18n();

const currentRound = computed(() => configurationStore.currentRound);
const teams = computed(() => {
  const filteredTeams = teamsStore.teams.filter((team) => team.id !== 33);
  return locale.value === 'pt-BR'
    ? filteredTeams.toSorted((a, b) => a.name.localeCompare(b.name))
    : filteredTeams.toSorted((a, b) => a.nameEn.localeCompare(b.nameEn));
});
const guideData = computed(
  () =>
    tm('rules.extras.guideDataReduced') as {
      beforeGroups: string;
      beforePlayoffs: string;
      beforeQuarter: string;
      type: string;
    }[],
);

function confirmChange() {
  if (!selectedTeam.value) return;
  props.handleChampionChange(selectedTeam.value);
  isVisible.value = false;
}

function selectTeam(team: ITeam) {
  selectedTeam.value = team;
}

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      isVisible.value = true;
      step.value = 1;
      selectedTeam.value = null;
    }
  },
);

const { lock, unlock } = useScrollLock();

watch(isVisible, (newValue) => {
  if (newValue) lock();
  else unlock();
  if (!newValue) {
    props.handleCloseModal();
  }
});
</script>
<style lang="scss" scoped>
.modal-header {
  display: flex;
  gap: var(--m-spacing);
  align-items: center;

  h2 {
    line-height: var(--l-spacing);
  }

  @media (width <= 768px) {
    font-size: var(--xs-font-size);
  }
}

.step-indicator {
  display: flex;
  flex-shrink: 0;
  gap: 0;
  align-items: center;
}

.step-dot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-size: var(--xs-font-size);
  font-weight: bold;
  color: var(--bolao-c-white-t2);
  background-color: var(--bolao-c-black-t2);
  border-radius: 50%;
  transition: background-color 0.3s;

  &--active {
    color: var(--bolao-c-white);
    background-color: var(--p-primary-color);
  }

  &--done {
    color: var(--bolao-c-white);
    background-color: var(--bolao-c-green);
  }
}

.step-line {
  width: 20px;
  height: 2px;
  background-color: var(--bolao-c-black-t2);
}

.header-team {
  display: flex;
  align-items: center;
  min-height: 32px;

  &__selected {
    display: flex;
    gap: var(--s-spacing);
    align-items: center;
  }

  &__flag {
    width: 32px;
    height: auto;
    border-radius: 2px;
  }
}

.teams-container {
  max-height: 380px;
  overflow-y: auto;

  @media (width <= 768px) {
    max-height: 45vh;
  }
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: var(--m-spacing);
  padding: var(--xs-spacing) var(--xs-spacing) var(--m-spacing);
}

.team-wrapper {
  &--current {
    cursor: not-allowed;
    opacity: 0.5;

    :deep(*) {
      pointer-events: none;
    }
  }
}

.bets-table {
  width: 100%;
  margin-top: var(--m-spacing);

  @media (width <= 768px) {
    font-size: var(--xs-font-size);
  }
}

:deep(.column) {
  font-weight: bold;
  text-align: center;

  @media (width <= 768px) {
    padding: var(--xs-spacing);
  }
}

:deep(.p-datatable-thead > tr > th) {
  color: var(--bolao-c-white-t2);
  background-color: var(--bolao-c-black-t2);
}

:deep(.p-datatable-column-header-content) {
  justify-content: center;
}

.footer-buttons {
  display: flex;
  gap: var(--m-spacing);
  justify-content: space-between;
  width: 100%;
  padding-top: var(--m-spacing);
}

// Step transition
.step-enter-active,
.step-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.step-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.step-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

// Fade transition
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
