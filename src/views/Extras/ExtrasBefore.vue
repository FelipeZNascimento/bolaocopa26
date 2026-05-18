<template>
  <div class="outer">
    <div
      v-if="!isDashboardBannerDismissed"
      class="rules-banner"
    >
      <h3>{{ t('extraBets.rulesBanner') }}</h3>
      <RouterLink
        to="/regras?section=extras"
        class="rules-banner-link"
      >
        {{ t('extraBets.rulesBannerLink') }} <i class="pi pi-arrow-up-right" />
      </RouterLink>
      <button
        class="banner-dismiss"
        :aria-label="$t('common.dismiss')"
        @click="dismissBanner"
      >
        <i class="pi pi-times" />
      </button>
    </div>
    <h2 style="text-align: center">Minhas Apostas</h2>
    <div style="position: relative; display: flex; flex-wrap: wrap; gap: 10px; justify-content: center">
      <!-- Overlay spinner when updating -->
      <div
        v-if="isLoadingExtras || isLoadingTeams || isUpdatingExtras"
        class="update-overlay"
      >
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
          {{ t(option.label) }}
        </div>

        <div
          v-if="option.selectedTeam"
          class="flag-container"
        >
          <img
            :src="`https://assets.omegafox.me/copa/countries_flags/${option.selectedTeam?.isoCode.toLowerCase()}.png`"
            :alt="`${option.selectedTeam?.name} Flag`"
            class="team-flag"
          />
        </div>
        <div
          v-if="option.selectedTeam"
          class="team-name"
        >
          {{ locale === 'pt-BR' ? option.selectedTeam?.name : option.selectedTeam?.nameEn }}
        </div>
      </div>
    </div>
    <PrimeDivider />
    <div class="buttons-outer">
      <PrimeButton
        v-for="item in buttonOptions"
        :key="item.value"
        :label="t(item.label)"
        variant="outlined"
        size="small"
        :severity="selectedToggle.value === item.value ? 'primary' : 'secondary'"
        rounded
        @click="selectedToggle.value = item.value"
      />
    </div>
    <h2>{{ currentSelectedToggle ? t(currentSelectedToggle.label) : '' }}</h2>

    <div
      v-if="
        currentSelectedToggle?.value != EXTRA_BETS_VALUES.TOP_SCORER &&
        currentSelectedToggle?.value != EXTRA_BETS_VALUES.BEST_PLAYER
      "
      class="teams-grid"
    >
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
            :alt="`${locale === 'pt-BR' ? team.name : team.nameEn} Flag`"
            class="team-flag"
          />
        </div>
        <div class="team-name">
          {{ locale === 'pt-BR' ? team.name : team.nameEn }}
        </div>
      </div>
    </div>
    <div v-else>
      <p style="color: var(--color-text); text-align: center">{{ t('extraBets.playersWarning') }}</p>
    </div>
  </div>
  <!-- Modals -->
  <LoginModal
    :is-open="isLoginModalOpen"
    :handle-close-modal="handleCloseLoginModal"
  />
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type { IPlayer, ITeam } from '@/stores/teams.types';

import LoginModal from '@/components/LoginModal.vue';
import {
  EXTRA_BETS_LABELS,
  EXTRA_BETS_VALUES,
  type TEXTRA_BETS_LABELS,
  type TEXTRA_BETS_VALUES,
} from '@/constants/bets';
import ExtraBetService from '@/services/extra_bet';
import TeamService from '@/services/team';
import { useActiveProfileStore } from '@/stores/activeProfile';
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
const activeProfileStore = useActiveProfileStore();
const { locale, t } = useI18n();

// ------ Refs ------
const isLoginModalOpen = ref(false);
const selectedToggle = ref<IToggleOption>({
  label: EXTRA_BETS_LABELS[EXTRA_BETS_VALUES.CHAMPION],
  value: EXTRA_BETS_VALUES.CHAMPION,
});

// ------ Computed Properties ------
const activeProfile = computed(() => activeProfileStore.activeProfile);
const isLoadingExtras = computed(() => extraBetStore.isLoading);
const isUpdatingExtras = computed(() => extraBetStore.isUpdating);
const activeProfileBets = computed(() => extraBetStore.activeProfileBets);
const isLoadingTeams = computed(() => teamsStore.isLoading);
const teams = computed(() => teamsStore.teams.filter((team) => team.id !== 33)); // Filter out placeholder team
const currentSelectedToggle = computed(
  () => buttonOptions.value.find((option) => option.value === selectedToggle.value.value) ?? buttonOptions.value[0],
);
const buttonOptions = computed<IToggleOption[]>(() => {
  // Create fresh base options every time
  const options: IToggleOption[] = [
    {
      label: EXTRA_BETS_LABELS[EXTRA_BETS_VALUES.CHAMPION],
      selectedTeam: null,
      value: EXTRA_BETS_VALUES.CHAMPION,
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
      label: EXTRA_BETS_LABELS[EXTRA_BETS_VALUES.TOP_SCORER],
      selectedPlayer: null,
      selectedTeam: null,
      value: EXTRA_BETS_VALUES.TOP_SCORER,
    },
    {
      label: EXTRA_BETS_LABELS[EXTRA_BETS_VALUES.BEST_PLAYER],
      selectedPlayer: null,
      selectedTeam: null,
      value: EXTRA_BETS_VALUES.BEST_PLAYER,
    },
  ];

  // Populate from activeProfileBets
  activeProfileBets.value.forEach((bet) => {
    const option = options.find((opt) => opt.value === bet.extraType);
    if (option) {
      option.selectedTeam = bet.team;
      if (bet.extraType === EXTRA_BETS_VALUES.TOP_SCORER || bet.extraType === EXTRA_BETS_VALUES.BEST_PLAYER) {
        option.selectedPlayer = bet.player;
      }
    }
  });

  return options;
});

// ------ Initialization ------
teamsService.fetch();

// ------ Rules banner ------
const BANNER_STORAGE_KEY = 'extra-bets-rules-banner-dismissed';
const isDashboardBannerDismissed = ref(localStorage.getItem(BANNER_STORAGE_KEY) === 'true');

function dismissBanner() {
  isDashboardBannerDismissed.value = true;
  localStorage.setItem(BANNER_STORAGE_KEY, 'true');
}

// ------ Functions ------
async function handleClick(team: ITeam) {
  if (!activeProfile.value) {
    isLoginModalOpen.value = true;
    return;
  }

  if (currentSelectedToggle.value) {
    // Save the previous state for potential rollback
    const previousTeam = currentSelectedToggle.value.selectedTeam;

    // Optimistically update UI
    if (currentSelectedToggle.value.selectedTeam?.id === team.id) {
      currentSelectedToggle.value.selectedTeam = null;
    } else {
      currentSelectedToggle.value.selectedTeam = team;
    }

    await extraBetService.update(
      {
        extraType: currentSelectedToggle.value.value,
        teamId: currentSelectedToggle.value.selectedTeam?.id || null,
      },
      (isSuccess: boolean, error?: Error) => {
        if (isSuccess) {
          const teamName =
            locale.value === 'pt-BR'
              ? currentSelectedToggle.value?.selectedTeam?.name
              : currentSelectedToggle.value?.selectedTeam?.nameEn;

          // Refresh the extra bets from the store to reflect the update
          extraBetService.fetch();
          notificationStore.success(
            `${t(currentSelectedToggle.value.label)}: ${teamName || 'Nenhum'}`,
            t('extraBets.notification.success'),
          );
        } else {
          console.error('Failed to update extra bet:', error);
          // Revert to previous state on failure
          if (currentSelectedToggle.value) {
            currentSelectedToggle.value.selectedTeam = previousTeam;
          }
          notificationStore.error(t('extraBets.notification.error'));
        }
      },
    );
  }
}

function handleCloseLoginModal() {
  isLoginModalOpen.value = false;
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

.rules-banner {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--xs-spacing);
  align-items: center;
  justify-content: center;
  padding: var(--s-spacing) var(--xxl-spacing);
  margin-bottom: var(--l-spacing);
  color: var(--bolao-c-grey2);
  background-color: var(--bolao-c-blue5);
  border: 1px solid var(--bolao-c-blue3);
  border-radius: var(--border-radius);

  h3 {
    font-size: var(--s-font-size);
    text-align: center;
  }
}

.rules-banner-link {
  font-size: var(--xs-font-size);
  color: var(--bolao-c-blue1);
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: var(--bolao-c-blue1-l1);
    text-decoration: underline;
  }

  .pi {
    font-size: 0.7em;
  }
}

.banner-dismiss {
  position: absolute;
  top: 50%;
  right: var(--s-spacing);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: 50%;
  opacity: 0.6;
  transform: translateY(-50%);
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }

  .pi {
    font-size: var(--xs-font-size);
    color: var(--bolao-c-grey2);
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
