<template>
  <PrimeDialog
    v-model:visible="isVisible"
    dismissable-mask
    modal
    :breakpoints="{ '1024': '75vw', '575px': '95vw' }"
    :draggable="false"
    content-class="content-class"
    style="width: 60%; padding: var(--s-spacing)"
  >
    <template #header>
      <p class="modal-title">
        <PrimeButton
          v-if="!isUserActive"
          v-tooltip.top="
            isFavorite() ? t('userTrackingModal.removeFavoriteTooltip') : t('userTrackingModal.addFavoriteTooltip')
          "
          :icon="isFavorite() ? 'pi pi-star-fill' : 'pi pi-star'"
          class="favorite-button"
          raised
          severity="secondary"
          @click="toggleFavorite"
        />
        {{ selectedUser?.nickname }}
      </p>
    </template>
    <PrimeSelectButton
      v-model="selectedOption"
      optionLabel="name"
      optionValue="value"
      :options="options"
      :size="isMobile ? 'small' : 'large'"
      :allowEmpty="false"
      fluid
    >
      <template #option="slotProps">
        <i
          v-if="!isMobile"
          :class="slotProps.option.icon"
          :style="{ color: 'var(' + slotProps.option.color + ')' }"
        />
        <span>{{ slotProps.option.name }}</span>
      </template>
    </PrimeSelectButton>

    <div
      v-if="selectedOption === OPTIONS.CHART"
      class="chart-container"
    >
      <PrimeChart
        type="bar"
        :data="chartData"
        :options="chartOptions"
      />
      <p style="text-align: center">
        {{ t('userTrackingModal.chartExplanation') }}
      </p>
    </div>
    <div v-if="selectedOption === OPTIONS.EXTRAS">
      <h2 style="text-align: center">{{ t('common.extraBets') }}</h2>
      <div class="grid-container">
        <div
          v-if="selectedUserExtraBets[EXTRA_BETS_VALUES.OFFENSE].length > 0"
          class="teams-grid"
        >
          <p style="text-align: center">{{ t(EXTRA_BETS_LABELS[EXTRA_BETS_VALUES.OFFENSE]) }}</p>
          <WorldCupLandscapeStickerComponent
            v-for="(value, index) in selectedUserExtraBets[EXTRA_BETS_VALUES.OFFENSE]"
            v-bind:key="value.id"
            :class="{ 'replaced-bet': index > 0 }"
            color="var(--bolao-c-blue-l2)"
            color-dark="var(--bolao-c-blue)"
          >
            <template #photo>
              <img
                :src="`https://assets.omegafox.me/copa/countries_flags/${value.team.isoCode.toLowerCase()}.png`"
                :alt="locale === 'pt-BR' ? value.team.name : value.team.nameEn"
                class="sticker-flag"
                loading="lazy"
              />
            </template>
            <template #overlay>
              <strong class="overlay-name">{{ locale === 'pt-BR' ? value.team.name : value.team.nameEn }}</strong>
            </template>
          </WorldCupLandscapeStickerComponent>
        </div>
        <div
          v-if="selectedUserExtraBets[EXTRA_BETS_VALUES.DEFENSE].length > 0"
          class="teams-grid"
        >
          <PrimeDivider v-if="isMobile" />
          <p style="text-align: center">{{ t(EXTRA_BETS_LABELS[EXTRA_BETS_VALUES.DEFENSE]) }}</p>
          <WorldCupLandscapeStickerComponent
            v-for="(value, index) in selectedUserExtraBets[EXTRA_BETS_VALUES.DEFENSE]"
            v-bind:key="value.id"
            :class="{ 'replaced-bet': index > 0 }"
            color="var(--bolao-c-blue-l2)"
            color-dark="var(--bolao-c-blue)"
          >
            <template #photo>
              <img
                :src="`https://assets.omegafox.me/copa/countries_flags/${value.team.isoCode.toLowerCase()}.png`"
                :alt="locale === 'pt-BR' ? value.team.name : value.team.nameEn"
                class="sticker-flag"
                loading="lazy"
              />
            </template>
            <template #overlay>
              <strong class="overlay-name">{{ locale === 'pt-BR' ? value.team.name : value.team.nameEn }}</strong>
            </template>
          </WorldCupLandscapeStickerComponent>
        </div>
        <div
          v-if="selectedUserExtraBets[EXTRA_BETS_VALUES.TOP_SCORER].length > 0"
          class="teams-grid"
        >
          <PrimeDivider v-if="isMobile" />
          <p style="text-align: center">{{ t(EXTRA_BETS_LABELS[EXTRA_BETS_VALUES.TOP_SCORER]) }}</p>
          <WorldCupLandscapeStickerComponent
            v-for="(value, index) in selectedUserExtraBets[EXTRA_BETS_VALUES.TOP_SCORER]"
            v-bind:key="value.id"
            :class="{ 'replaced-bet': index > 0 }"
            color="var(--bolao-c-blue-l2)"
            color-dark="var(--bolao-c-blue)"
          >
            <template #photo>
              <img
                :src="`https://assets.omegafox.me/copa/countries_flags/${value.team.isoCode.toLowerCase()}.png`"
                :alt="locale === 'pt-BR' ? value.team.name : value.team.nameEn"
                class="sticker-flag"
                loading="lazy"
              />
            </template>
            <template #overlay>
              <span class="overlay-sub">
                {{ value.player.name }}
              </span>
            </template>
          </WorldCupLandscapeStickerComponent>
        </div>
        <div
          v-if="selectedUserExtraBets[EXTRA_BETS_VALUES.BEST_PLAYER].length > 0"
          class="teams-grid"
        >
          <PrimeDivider v-if="isMobile" />
          <p style="text-align: center">{{ t(EXTRA_BETS_LABELS[EXTRA_BETS_VALUES.BEST_PLAYER]) }}</p>
          <WorldCupLandscapeStickerComponent
            v-for="(value, index) in selectedUserExtraBets[EXTRA_BETS_VALUES.BEST_PLAYER]"
            v-bind:key="value.id"
            :class="{ 'replaced-bet': index > 0 }"
            color="var(--bolao-c-blue-l2)"
            color-dark="var(--bolao-c-blue)"
          >
            <template #photo>
              <img
                :src="`https://assets.omegafox.me/copa/countries_flags/${value.team.isoCode.toLowerCase()}.png`"
                :alt="locale === 'pt-BR' ? value.team.name : value.team.nameEn"
                class="sticker-flag"
                loading="lazy"
              />
            </template>
            <template #overlay>
              <span class="overlay-sub">
                {{ value.player.name }}
              </span>
            </template>
          </WorldCupLandscapeStickerComponent>
        </div>
        <div
          v-if="selectedUserExtraBets[EXTRA_BETS_VALUES.CHAMPION].length > 0"
          class="teams-grid"
        >
          <PrimeDivider v-if="isMobile" />
          <p style="text-align: center">{{ t(EXTRA_BETS_LABELS[EXTRA_BETS_VALUES.CHAMPION]) }}</p>
          <WorldCupLandscapeStickerComponent
            v-for="(value, index) in selectedUserExtraBets[EXTRA_BETS_VALUES.CHAMPION]"
            v-bind:key="value.id"
            :class="{ 'replaced-bet': index > 0 }"
            color="var(--bolao-c-blue-l2)"
            color-dark="var(--bolao-c-blue)"
          >
            <template #photo>
              <img
                :src="`https://assets.omegafox.me/copa/countries_flags/${value.team.isoCode.toLowerCase()}.png`"
                :alt="locale === 'pt-BR' ? value.team.name : value.team.nameEn"
                class="sticker-flag"
                loading="lazy"
              />
            </template>
            <template #overlay>
              <span class="overlay-name">{{ locale === 'pt-BR' ? value.team.name : value.team.nameEn }}</span>
              <span class="overlay-sub">
                {{ t('userTrackingModal.factor', { percentage: returnChampionFactor(value.stageId) }) }}
              </span>
            </template>
          </WorldCupLandscapeStickerComponent>
        </div>
      </div>
    </div>
    <div v-if="selectedOption === OPTIONS.BETS && selectedUser">
      <h2 style="text-align: center">{{ t('common.bets') }}</h2>
      <MatchRow
        v-for="item in matchesWithUserBets"
        :key="item.id"
        :match="item"
        :user="selectedUser"
      />
    </div>
  </PrimeDialog>
  <!-- Modals -->
  <LoginModal
    :is-open="isLoginModalOpen"
    :handle-close-modal="handleCloseLoginModal"
  />
</template>
<script setup lang="ts">
import PrimeChart from 'primevue/chart';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import type { IUser } from '@/stores/activeProfile.types';
import type { IExtraBet } from '@/stores/extraBet.types';

import LoginModal from '@/components/LoginModal.vue';
import WorldCupLandscapeStickerComponent from '@/components/WorldCupLandscapeStickerComponent.vue';
import { useScrollLock } from '@/composables/useScrollLock';
import { EXTRA_BETS_LABELS, EXTRA_BETS_VALUES } from '@/constants/bets';
import { MATCH_STATUS } from '@/constants/match.ts';
import UserService from '@/services/user';
import { useViewport } from '@/services/viewport';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useExtraBetStore } from '@/stores/extraBet';
import { useMatchesStore } from '@/stores/matches';
import { useNotificationStore } from '@/stores/notification';
import { useRankingStore } from '@/stores/ranking';

import MatchRow from './UserTrackingModal/MatchRow.vue';

const props = defineProps<{
  handleCloseModal: () => void;
  isOpen: boolean;
  isUserActive: boolean;
  selectedUser: null | Pick<IUser, 'id' | 'nickname'>;
}>();

enum OPTIONS {
  CHART,
  EXTRAS,
  BETS,
}

// ------ Initialization ------
const rankingStore = useRankingStore();
const activeProfileStore = useActiveProfileStore();
const notificationStore = useNotificationStore();
const extraBetStore = useExtraBetStore();
const matchesStore = useMatchesStore();
const userService = new UserService();
const { locale, t } = useI18n();
const { isMobile } = useViewport();

// ------ Refs ------
const isVisible = ref(false);
const isLoginModalOpen = ref(false);
const selectedOption = ref(0);
const options = ref([
  { color: '--bolao-c-white', icon: 'pi pi-chart-line', name: t('common.chart'), value: OPTIONS.CHART },
  { color: '--bolao-c-white', icon: 'pi pi-star', name: t('common.extraBets'), value: OPTIONS.EXTRAS },
  { color: '--bolao-c-white', icon: 'pi pi-money-bill', name: t('common.bets'), value: OPTIONS.BETS },
]);

// ------ Computed Properties  ------
const activeProfile = computed(() => activeProfileStore.activeProfile);
const favorites = computed(() => activeProfileStore.activeProfile?.favorites || []);
const roundsRanking = computed(() => rankingStore.roundsRanking);
const editionRanking = computed(() => rankingStore.editionRanking);
const matchesWithUserBets = computed(() => matchesStore.matches.filter((m) => m.status !== MATCH_STATUS.NOT_STARTED));
const selectedUserExtraBets = computed(() => {
  // Deep-copy each option so mutations never bleed back
  const userExtraBetsOriginal =
    extraBetStore.extraBetsByUser.find((u) => u.user.id === props.selectedUser?.id)?.bets || [];
  const userExtraBets: IExtraBet[] = userExtraBetsOriginal.map((extraBet) => ({ ...extraBet }));

  const extraBetsByType: Record<number, IExtraBet[]> = {
    [EXTRA_BETS_VALUES.BEST_PLAYER]: [],
    [EXTRA_BETS_VALUES.CHAMPION]: [],
    [EXTRA_BETS_VALUES.DEFENSE]: [],
    [EXTRA_BETS_VALUES.OFFENSE]: [],
    [EXTRA_BETS_VALUES.TOP_SCORER]: [],
  };

  if (userExtraBets.length === 0) {
    return extraBetsByType;
  }

  userExtraBets.forEach((extraBet) => {
    extraBetsByType[extraBet.extraType] = [...extraBetsByType[extraBet.extraType], extraBet].sort(
      (a, b) => b.stageId - a.stageId,
    );
  });
  return extraBetsByType;
});

// ------ Functions  ------
function getCssVar(name: string, fallback: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

function handleCloseLoginModal() {
  isLoginModalOpen.value = false;
}

function isFavorite(): boolean {
  if (!props.selectedUser) {
    return false;
  }

  return userService.isFavorite(props.selectedUser.id);
}

function returnChampionFactor(stageId: number): string {
  let factor = '';
  if (stageId === 1) {
    factor = '100%';
  } else if (stageId === 2) {
    factor = '60%';
  } else if (stageId === 3) {
    factor = '30%';
  }

  return factor;
}
function returnLabelForRound(round: null | number): string {
  if (round === null) {
    return '';
  }

  const labels: Record<number, string> = {
    1: t('rounds.1.short'),
    2: t('rounds.2.short'),
    3: t('rounds.3.short'),
    4: t('rounds.4.short'),
    5: t('rounds.5.short'),
    6: t('rounds.6.short'),
    7: t('rounds.7.short'),
    8: t('rounds.8.short'),
    9: t('rounds.9.short'),
  };
  return labels[round] || `Rodada ${round}`;
}

function toggleFavorite() {
  if (!activeProfile.value) {
    isLoginModalOpen.value = true;
    return;
  }

  if (!props.selectedUser) return;

  if (props.selectedUser.id === activeProfile.value.id) {
    notificationStore.error(
      t('userTrackingModal.addFavoriteNotificationError.message'),
      t('userTrackingModal.addFavoriteNotificationError.title'),
    );
    return;
  }

  const userId = props.selectedUser.id;
  const isRemoving = favorites.value.includes(userId);
  const newFavorites = isRemoving ? favorites.value.filter((id) => id !== userId) : [...favorites.value, userId];

  userService.updateFavorites(newFavorites, (isSuccess) =>
    updateCallback(isSuccess, isRemoving, props.selectedUser?.nickname ?? ''),
  );
}

function updateCallback(isSuccess: boolean, isRemoving: boolean, selectedUser: string) {
  if (isSuccess) {
    const messageKey = isRemoving
      ? 'userTrackingModal.removeFavoriteNotification.message'
      : 'userTrackingModal.addFavoriteNotification.message';
    const titleKey = isRemoving
      ? 'userTrackingModal.removeFavoriteNotification.title'
      : 'userTrackingModal.addFavoriteNotification.title';

    notificationStore.success(`${selectedUser} ${t(messageKey)}`, t(titleKey));
    console.log('Favorites updated successfully');
  } else {
    notificationStore.error(
      t('userTrackingModal.addFavoriteNotificationError.message'),
      t('userTrackingModal.addFavoriteNotificationError.title'),
    );
    console.error('Failed to update favorites');
  }
}

const chartData = computed(() => {
  const userLine = editionRanking.value.find((userRanking) => userRanking.user.id === props.selectedUser?.id);
  const roundsRankingList = Array.isArray(roundsRanking.value) ? roundsRanking.value : [];
  const userRoundsRanking = roundsRankingList
    .map((round) => {
      return {
        ranking: round.ranking.find((userRanking) => userRanking.user.id === props.selectedUser?.id),
        round: round.round,
      };
    })
    .filter((entry) => entry.ranking?.isFinished || (entry.ranking?.score.points && entry.ranking?.score.points > 0));

  if (!userLine) {
    return {
      datasets: [],
      labels: [],
    };
  }

  return {
    datasets: [
      {
        backgroundColor: '#f4b303',
        borderColor: '#f4b303',
        borderWidth: 2,
        data: userRoundsRanking.map((round) => round.ranking?.score.position),
        label: t('userTrackingModal.position'),
        tension: 0.4,
        type: 'line',
        yAxisID: 'y1',
      },
      {
        backgroundColor: '#de6135',
        borderColor: '#de6135',
        borderWidth: 2,
        data: userRoundsRanking.map((round) => round.ranking?.accumulatedScore.position),
        label: t('userTrackingModal.globalPosition'),
        tension: 0.4,
        type: 'line',
        yAxisID: 'y1',
      },
      {
        backgroundColor: '#29c84e50',
        data: userRoundsRanking.map((round) => round.ranking?.score.percentage),
        label: t('userTrackingModal.pointsPercentage'),
        type: 'bar',
        yAxisID: 'y',
      },
    ],
    labels: userRoundsRanking.map((round) => returnLabelForRound(round.round)),
  };
});

const chartOptions = computed(() => ({
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: getCssVar('--bolao-c-white', '#495057'),
      },
    },
  },
  responsive: true,
  scales: {
    x: {
      grid: { color: getCssVar('--bolao-c-grey1-t1', 'rgb(128 128 128 / 20%)') },
      stacked: true,
      ticks: { color: getCssVar('--bolao-c-white', '#495057') },
    },
    y: {
      grid: { color: getCssVar('--bolao-c-grey1-t1', 'rgb(128 128 128 / 20%)') },
      max: 100,
      min: 0,
      position: 'left' as const,
      stacked: true,
      ticks: { color: getCssVar('--bolao-c-white', '#495057') },
      title: {
        color: getCssVar('--bolao-c-white', '#495057'),
        display: true,
        text: t('userTrackingModal.pointsPercentage'),
      },
    },
    y1: {
      display: true,
      grid: {
        color: '#f4b303',
        drawOnChartArea: false,
      },
      max: 163,
      min: 1,
      position: 'right' as const,
      reverse: true,
      stacked: false,
      ticks: {
        color: getCssVar('--bolao-c-white', '#495057'),
        min: 1,
        stepSize: 1,
      },
      title: {
        color: getCssVar('--bolao-c-white', '#495057'),
        display: true,
        text: t('userTrackingModal.position'),
      },
      type: 'linear',
    },
  },
}));

// ------ Watches ------
watch(
  () => props.isOpen,
  async (newValue) => {
    if (newValue) {
      isVisible.value = true;
    }
  },
);

const { lock, unlock } = useScrollLock();

watch(isVisible, async (newValue) => {
  if (newValue) lock();
  else unlock();
  if (!newValue) {
    props.handleCloseModal();
  }
});
</script>
<style lang="scss" scoped>
.modal-title {
  display: flex;
  gap: var(--s-spacing);
  align-items: center;
  font-size: var(--l-font-size);
}

.content-class {
  padding: 0 !important;
  overflow-x: hidden !important;
}

.favorite-button {
  color: var(--bolao-c-yellow, #f4b303) !important;
  transition:
    transform 0.2s,
    opacity 0.2s;

  &:hover {
    opacity: 0.8;
    transform: scale(1.05);
  }

  :deep(.pi-star) {
    opacity: 0.5;
  }

  :deep(.pi-star-fill) {
    opacity: 1;
  }
}

.replaced-bet {
  font-size: var(--xs-font-size);
  font-weight: 400;
  color: var(--bolao-c-grey4);
  text-decoration: line-through;
  opacity: 0.4;

  .overlay-name,
  .overlay-sub {
    text-decoration: line-through;
  }
}

.chart-container {
  margin-top: var(--s-spacing);
}

.grid-container {
  display: flex;

  @media (width <= 768px) {
    flex-direction: column;
  }
}

.teams-grid {
  display: grid;
  grid-template-rows: auto auto 1fr;
  grid-template-columns: repeat(1, minmax(110px, 140px));
  gap: var(--m-spacing);
  justify-content: center;
  width: 100%;

  @media (width <= 768px) {
    grid-template-columns: repeat(1, minmax(80px, 120px));
    gap: var(--s-spacing);
  }
}

.sticker-flag {
  width: 100%;
  height: 100%;
  min-height: 90px;
  object-fit: cover;
  object-position: center;
}

.overlay-name {
  display: block;
  font-size: var(--m-font-size);
  font-weight: 800;
  line-height: 1.2;
  color: #fff;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.03em;

  @media (width <= 768px) {
    font-size: var(--xs-font-size);
  }
}

.overlay-sub {
  display: flex;
  gap: 4px;
  justify-content: center;
  font-size: var(--xs-font-size);
  font-weight: bold;
  text-align: center;
}

.overlay-group {
  font-weight: 700;
  color: rgb(255 255 255 / 90%);
}

.overlay-sep {
  color: rgb(255 255 255 / 40%);
}
</style>
<style lang="scss">
.p-chart {
  height: 300px;
  background-color: var(--bolao-c-grey1-t1);
  border-radius: var(--border-radius);
}
</style>
