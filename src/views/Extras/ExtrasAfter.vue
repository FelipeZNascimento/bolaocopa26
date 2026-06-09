<template>
  <div class="outer-extras">
    <!-- Section navigation -->
    <nav
      v-if="activeProfile || extraBetsResults.length > 0"
      class="section-nav"
    >
      <PrimeButton
        v-if="activeProfile"
        variant="text"
        size="small"
        icon="pi pi-star-fill"
        :label="t('extraBets.myBets')"
        :aria-label="t('extraBets.myBets')"
        style="color: var(--bolao-c-mint)"
        @click="scrollToSection(myBetsRef)"
      />
      <span
        v-if="activeProfile"
        class="section-nav__divider"
      />
      <PrimeButton
        v-if="extraBetsResults.length > 0"
        variant="text"
        size="small"
        icon="pi pi-trophy"
        :label="t('extraBets.results')"
        :aria-label="t('extraBets.results')"
        style="color: var(--bolao-c-gold)"
        @click="scrollToSection(resultsRef)"
      />
      <span
        v-if="extraBetsResults.length > 0"
        class="section-nav__divider"
      />
      <PrimeButton
        variant="text"
        size="small"
        icon="pi pi-users"
        :label="t('extraBets.generalBets')"
        style="color: var(--bolao-c-blue)"
        :aria-label="t('extraBets.generalBets')"
        @click="scrollToSection(generalBetsRef)"
      />
    </nav>
    <PrimeDivider />
    <div v-if="activeProfile">
      <h2
        ref="resultsRef"
        style="text-align: center"
      >
        <i
          class="pi pi-star-fill"
          style="color: var(--bolao-c-mint)"
        />
        {{ t('extraBets.myBets') }}
      </h2>
      <MyExtrasComponent
        :selectedToggle="selectedToggle"
        :extraBetsOptions="extraBetsOptions"
        :onSelectToggle="onSelectToggle"
        :onChampionChange="onChampionChange"
        :is-loading="isLoading"
      />
    </div>
    <template v-if="extraBetsResults.length > 0">
      <PrimeDivider />
      <h2 ref="resultsRef">
        <i
          class="pi pi-trophy"
          style="color: var(--bolao-c-gold)"
        />
        {{ t('extraBets.results') }}
      </h2>
      <div
        v-if="isLoading"
        class="results-grid"
      >
        <PrimeSkeleton
          v-for="value in 5"
          :key="value"
          class="skeleton-result"
        />
      </div>
      <div
        v-else
        class="results-grid"
      >
        <div
          v-for="extraBetType in extraBetsOptions"
          :key="extraBetType.value"
          class="result-card"
        >
          <div class="result-card__header">
            <span class="result-card__label">{{ t(extraBetType.label) }}</span>
          </div>
          <div class="result-card__body">
            <template v-if="filterResultsByType(extraBetType.value)?.length">
              <div
                v-for="result in filterResultsByType(extraBetType.value)"
                :key="result.team?.id ?? result.player?.id"
                class="result-item"
              >
                <ClickableTeamCard
                  :team="result.team"
                  :is-loading="isLoading"
                />
                <span
                  v-if="isPlayerType(extraBetType.value) && result.player"
                  class="result-item__player"
                >
                  {{ result.player.name }}
                </span>
              </div>
            </template>
            <div
              v-else
              class="result-pending"
            >
              <i class="pi pi-clock" />
              {{ t('extraBets.resultPending') }}
            </div>
          </div>
        </div>
      </div>
    </template>
    <PrimeDivider />
    <h2 ref="generalBetsRef">
      <i
        class="pi pi-users"
        style="color: var(--bolao-c-blue)"
      />
      {{ t('extraBets.generalBets') }}
    </h2>
    <div
      v-if="isLoading"
      class="teams-grid"
    >
      <PrimeSkeleton
        v-for="value in 16"
        :key="value"
        class="skeleton-outer"
      />
    </div>
    <div
      v-else
      class="teams-grid"
    >
      <ClickableTeamCard
        v-for="teamOrPlayer in selectedExtras"
        :key="teamOrPlayer.team.id"
        :team="teamOrPlayer.team"
        :handle-click="() => handleTeamClick(teamOrPlayer)"
        :is-loading="isLoading"
        :see-more="true"
        :counter="filterBetsByType(teamOrPlayer.bets, selectedToggle.value).length"
      />
    </div>
  </div>
  <!-- Modals -->
  <ChampionChangeModal
    :is-open="isChampionChangeModalOpen"
    :handle-close-modal="() => (isChampionChangeModalOpen = false)"
    :handle-champion-change="handleChampionChange"
    :current-champion="
      extraBetsOptions.find((o) => o.value === EXTRA_BETS_VALUES.CHAMPION)?.selectedTeam?.[0]?.team ?? undefined
    "
  />
  <ExtraBetsDetailsModal
    v-if="selectedItem"
    :is-open="isDetailsModalOpen"
    :handle-close-modal="handleCloseDetailsModal"
    :bets="filterBetsByType(selectedItem.bets, selectedToggle.value)"
    :extra-type="selectedToggle.value"
    :team="selectedItem.team"
    :player="isPlayerWithExtras(selectedItem) ? selectedItem.player : undefined"
  />
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type { IExtraBet, IPlayerWithExtras, ITeamWithExtras } from '@/stores/extraBet.types';
import type { ITeam } from '@/stores/teams.types';

import ClickableTeamCard from '@/components/ClickableTeamCard.vue';
import { EXTRA_BETS_LABELS, EXTRA_BETS_VALUES, STAGE_ID, type TEXTRA_BETS_VALUES } from '@/constants/bets';
import ExtraBetService from '@/services/extra_bet';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useExtraBetStore } from '@/stores/extraBet';
import { useNotificationStore } from '@/stores/notification';
import { useTeamsStore } from '@/stores/teams';
import MyExtrasComponent from '@/views/Extras/MyExtrasComponent.vue';

import type { IToggleOption } from './extrasView.types';

import ChampionChangeModal from './ChampionChangeModal.vue';
import ExtraBetsDetailsModal from './ExtraBetsDetailsModal.vue';
import { BUTTON_OPTIONS } from './extrasView.constants';

const { locale, t } = useI18n();

// ------ Services & Stores ------
const extraBetService = new ExtraBetService();
const activeProfileStore = useActiveProfileStore();
const notificationStore = useNotificationStore();

// ------ Refs ------
const myBetsRef = ref<HTMLElement | null>(null);
const resultsRef = ref<HTMLElement | null>(null);
const generalBetsRef = ref<HTMLElement | null>(null);
const isChampionChangeModalOpen = ref(false);
const isDetailsModalOpen = ref(false);
const selectedItem = ref<IPlayerWithExtras | ITeamWithExtras | null>(null);
const selectedToggle = ref<IToggleOption>({
  label: EXTRA_BETS_LABELS[EXTRA_BETS_VALUES.CHAMPION],
  value: EXTRA_BETS_VALUES.CHAMPION,
});

// ------ Initialization ------
const extraBetStore = useExtraBetStore();
const teamsStore = useTeamsStore();
extraBetService.fetch();

// ------ Computed Properties ------
const isLoading = computed(() => {
  return extraBetStore.isLoading || extraBetStore.isUpdating || teamsStore.isLoading;
});

const extraBetsResults = computed(() => extraBetStore.results);
const activeProfileBets = computed(() => extraBetStore.activeProfileBets);
const activeProfile = computed(() => activeProfileStore.activeProfile);
const extraBetsByTeam = computed(() => extraBetStore.extraBetsByTeam);
const topScorersByPlayer = computed(() => extraBetStore.topScorerBetsByPlayer);
const validBetsByTeam = computed(() => {
  // Build a map of the highest stageId per (userId, extraType) across all teams
  const maxStageIds = new Map<string, number>();
  extraBetsByTeam.value.forEach((entry) => {
    entry.bets.forEach((bet) => {
      const key = `${bet.user.id}-${bet.extraType}`;
      const current = maxStageIds.get(key) ?? 0;
      if (bet.stageId > current) maxStageIds.set(key, bet.stageId);
    });
  });

  // Keep only the current (highest stageId) bet per user+extraType for each team
  return extraBetsByTeam.value
    .map((entry) => ({
      ...entry,
      bets: entry.bets.filter((bet) => {
        const key = `${bet.user.id}-${bet.extraType}`;
        return bet.stageId === maxStageIds.get(key);
      }),
    }))
    .filter((entry) => entry.bets.length > 0);
});
const extraBetsOptions = computed<IToggleOption[]>(() => {
  // Deep-copy each option so mutations never bleed back into the BUTTON_OPTIONS constant
  const options: IToggleOption[] = BUTTON_OPTIONS.map((opt) => ({ ...opt }));

  // Populate from activeProfileBets
  activeProfileBets.value.forEach((bet) => {
    const option = options.find((opt) => opt.value === bet.extraType);
    if (option) {
      option.selectedTeam = [...(option.selectedTeam ?? []), { stageId: bet.stageId, team: bet.team }].sort(
        (a, b) => b.stageId - a.stageId,
      );
      if (bet.extraType === EXTRA_BETS_VALUES.TOP_SCORER || bet.extraType === EXTRA_BETS_VALUES.BEST_PLAYER) {
        option.selectedPlayer = bet.player;
      }
    }
  });

  return options;
});

const selectedExtras = computed<IPlayerWithExtras[] | ITeamWithExtras[]>(() => {
  if (selectedToggle.value.value === EXTRA_BETS_VALUES.TOP_SCORER) {
    return [...topScorersByPlayer.value].sort((a, b) => a.player.name.localeCompare(b.player.name));
  }

  const filteredTeams = validBetsByTeam.value.filter((team) =>
    team.bets.some((bet) => bet.extraType === selectedToggle.value.value),
  );

  return locale.value === 'pt-BR'
    ? filteredTeams.toSorted((a, b) => a.team.name.localeCompare(b.team.name))
    : filteredTeams.toSorted((a, b) => a.team.nameEn.localeCompare(b.team.nameEn));
});

// ------ Functions ------

function filterBetsByType(bets: IExtraBet[], extraType: TEXTRA_BETS_VALUES) {
  return bets
    .filter((bet) => bet.extraType === extraType)
    .sort((a, b) => a.user.nickname.localeCompare(b.user.nickname));
}

function filterResultsByType(extraType: TEXTRA_BETS_VALUES) {
  if (extraType === EXTRA_BETS_VALUES.CHAMPION) {
    return extraBetsResults.value
      .find((result) => result.extraType === extraType)
      ?.results.filter((r) => r.stageId === STAGE_ID.WINNER);
  }
  return extraBetsResults.value.find((result) => result.extraType === extraType)?.results;
}

async function handleChampionChange(team: ITeam) {
  await extraBetService.update(
    { extraType: EXTRA_BETS_VALUES.CHAMPION, teamId: team.id },
    (isSuccess: boolean, error?: Error) => {
      if (isSuccess) {
        extraBetService.fetch();
        notificationStore.success(
          locale.value === 'pt-BR' ? team.name : team.nameEn,
          t('extraBets.notification.success'),
        );
      } else {
        console.error('Failed to update champion bet:', error);
        notificationStore.error(t('extraBets.notification.error'));
      }
    },
  );
}

function handleCloseDetailsModal() {
  isDetailsModalOpen.value = false;
  selectedItem.value = null;
}

function handleTeamClick(teamOrPlayer: IPlayerWithExtras | ITeamWithExtras) {
  selectedItem.value = teamOrPlayer;
  isDetailsModalOpen.value = true;
}

function isPlayerType(extraType: TEXTRA_BETS_VALUES) {
  return extraType === EXTRA_BETS_VALUES.TOP_SCORER || extraType === EXTRA_BETS_VALUES.BEST_PLAYER;
}

function isPlayerWithExtras(item: IPlayerWithExtras | ITeamWithExtras): item is IPlayerWithExtras {
  return 'player' in item;
}

function onChampionChange() {
  isChampionChangeModalOpen.value = true;
}

function onSelectToggle(option: IToggleOption) {
  selectedToggle.value = option;
}

function scrollToSection(el: HTMLElement | null) {
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
</script>
<style lang="scss" scoped>
.section-nav {
  display: flex;
  gap: var(--xs-spacing);
  align-items: center;
  justify-content: center;
  padding: var(--xs-spacing) var(--m-spacing);
  background-color: var(--bolao-c-blue4);
  border: 1px solid var(--bolao-c-blue3);
  border-radius: var(--border-radius);

  &__divider {
    width: 1px;
    height: 16px;
    background-color: var(--bolao-c-blue3);
  }

  @media (width <= 400px) {
    gap: 2px;
    padding: var(--xs-spacing);

    :deep(.p-button-label) {
      display: none;
    }

    :deep(.p-button) {
      justify-content: center;
      min-width: 44px;
      min-height: 44px;
      padding: var(--xs-spacing);
    }
  }
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--m-spacing);
  align-items: stretch;
  width: 100%;

  @media (width <= 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (width <= 600px) {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--s-spacing);
  }
}

.result-card {
  display: flex;
  flex-direction: column;
  min-height: 200px;
  overflow: hidden;
  background-color: var(--bolao-c-blue4);
  border: 1px solid var(--bolao-c-blue3);
  border-radius: var(--border-radius);

  &__header {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: center;
    padding: var(--s-spacing) var(--m-spacing);
    text-align: center;
    background-color: var(--bolao-c-blue3);
  }

  &__trophy {
    font-size: var(--m-font-size);
    color: var(--bolao-c-mint);
  }

  &__label {
    font-size: var(--xs-font-size);
    font-weight: 600;
    color: var(--bolao-c-grey2);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__body {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: var(--xs-spacing);
    align-items: center;
    justify-content: center;
    padding: var(--m-spacing);
  }
}

.result-item {
  display: flex;
  flex-direction: column;
  gap: var(--xs-spacing);
  align-items: center;

  &__player {
    font-size: var(--s-font-size);
    font-weight: 700;
    color: var(--bolao-c-grey1);
    text-align: center;
  }
}

.result-pending {
  display: flex;
  flex-direction: column;
  gap: var(--xs-spacing);
  align-items: center;
  font-size: var(--xs-font-size);
  color: var(--bolao-c-grey4);
  text-align: center;

  i {
    font-size: var(--m-font-size);
    opacity: 0.5;
  }
}

.skeleton-result {
  width: 100%;
  min-height: 130px;
  border-radius: var(--border-radius);
}

.cards-container {
  display: flex;
  flex-flow: row wrap;
  gap: var(--m-spacing);
  justify-content: center;
  max-width: 100vw;
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 140px));
  gap: var(--m-spacing);
  justify-content: center;
  width: 100%;

  @media (width <= 768px) {
    grid-template-columns: repeat(auto-fit, minmax(80px, 120px));
    gap: var(--s-spacing);
  }
}

.all-bets-card {
  width: 160px;
  overflow: hidden;
  font-size: var(--m-font-size);

  @media (width <= 768px) {
    width: 80px;
    font-size: var(--s-font-size);
  }

  .header-container {
    position: relative;
    width: 100%;
    height: 140px;

    @media (width <= 768px) {
      height: 70px;
    }
  }

  .header-overlay {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    padding: var(--xs-spacing);
    font-weight: bold;
    color: white;
    text-align: center;
    background: rgb(0 0 0 / 50%);

    @media (width <= 768px) {
      padding: var(--xxxs-spacing);
    }
  }

  .card-content {
    padding: var(--m-spacing) 0;
    text-align: center;

    @media (width <= 768px) {
      font-size: var(--xs-font-size);
    }
  }

  .details-button {
    // text-align: center;
    padding: var(--s-spacing);

    @media (width <= 768px) {
      font-size: var(--xxs-font-size);
    }
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.outer-extras {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--m-spacing);
  align-items: center;
  justify-content: space-between;
  padding: var(--l-spacing) 160px;

  @media (width <= 768px) {
    padding: var(--xxl-spacing) var(--s-spacing);
  }
}

.skeleton-outer {
  width: 100%;
  min-height: 100px;
}

:deep(.p-card-body) {
  padding: var(--xs-spacing);
}
</style>
