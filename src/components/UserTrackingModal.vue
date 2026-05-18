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
        {{ selectedUser?.nickname }}

        <PrimeButton
          v-if="!isUserActive"
          v-tooltip.top="
            isFavorite() ? t('userTrackingModal.removeFavoriteTooltip') : t('userTrackingModal.addFavoriteTooltip')
          "
          :icon="isFavorite() ? 'pi pi-star-fill' : 'pi pi-star'"
          class="favorite-button"
          raised
          severity="secondary"
          rounded
          @click="toggleFavorite"
        />
      </p>
    </template>
    <PrimeChart
      type="bar"
      :data="chartData"
      :style="{ height: '300px', backgroundColor: 'var(--surface-card)', borderRadius: 'var(--border-radius)' }"
      :options="chartOptions"
    />
    <p style="text-align: center">
      {{ t('userTrackingModal.chartExplanation') }}
    </p>
    <PrimeDivider />
    <h2 style="text-align: center">{{ t('userTrackingModal.extraBets') }}</h2>
    <div style="display: flex; justify-content: center; padding: var(--s-spacing)">
      <PrimeSkeleton
        v-if="isLoadingExtras"
        class="skeleton-outer"
      />
      <ExtraBetsTeamCard
        v-else
        :extra-bets="selectedUserExtraBets"
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

import LoginModal from '@/components/LoginModal.vue';
import UserService from '@/services/user';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useExtraBetStore } from '@/stores/extraBet';
import { useNotificationStore } from '@/stores/notification';
import { useRankingStore } from '@/stores/ranking';
import ExtraBetsTeamCard from '@/views/Extras/After/ExtraBetsTeamCard.vue';

const props = defineProps<{
  handleCloseModal: () => void;
  isOpen: boolean;
  isUserActive: boolean;
  selectedUser: null | Pick<IUser, 'id' | 'nickname'>;
}>();

// ------ Refs ------
const isVisible = ref(false);
const isLoginModalOpen = ref(false);

// ------ Initialization ------
const rankingStore = useRankingStore();
const activeProfileStore = useActiveProfileStore();
const notificationStore = useNotificationStore();
const extraBetStore = useExtraBetStore();
const userService = new UserService();
const { t } = useI18n();

// ------ Computed Properties  ------
const activeProfile = computed(() => activeProfileStore.activeProfile);
const favorites = computed(() => activeProfileStore.activeProfile?.favorites || []);
const roundsRanking = computed(() => rankingStore.roundsRanking);
const seasonRanking = computed(() => rankingStore.seasonRanking);
const isLoadingExtras = computed(() => extraBetStore.isLoading);
const selectedUserExtraBets = computed(
  () => extraBetStore.extraBetsByUser.find((u) => u.user.id === props.selectedUser?.id)?.bets || [],
);

// ------ Functions  ------
function handleCloseLoginModal() {
  isLoginModalOpen.value = false;
}

function isFavorite(): boolean {
  if (!props.selectedUser) {
    return false;
  }

  return userService.isFavorite(props.selectedUser.id);
}

function returnLabelForRound(round: null | number): string {
  if (round === null) {
    return '';
  }

  const labels: Record<number, string> = {
    1: 'Grupos 1',
    2: 'Grupos 2',
    3: 'Grupos 3',
    4: '16 Avos',
    5: 'Oitavas',
    6: 'Quartas',
    7: 'Semi Finais',
    8: 'Disputa 3º Lugar',
    9: 'Final',
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
  const userLine = seasonRanking.value.find((userRanking) => userRanking.user.id === props.selectedUser?.id);
  const roundsRankingList = Array.isArray(roundsRanking.value) ? roundsRanking.value : [];
  const userRoundsRanking = roundsRankingList.map((round) => {
    return {
      ranking: round.ranking.find((userRanking) => userRanking.user.id === props.selectedUser?.id),
      round: round.round,
    };
  });

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
        label: 'Posição',
        tension: 0.4,
        type: 'line',
        yAxisID: 'y1',
      },
      {
        backgroundColor: '#de6135',
        borderColor: '#de6135',
        borderWidth: 2,
        data: userRoundsRanking.map((round) => round.ranking?.accumulatedScore.position),
        label: 'Posição Geral',
        tension: 0.4,
        type: 'line',
        yAxisID: 'y1',
      },
      {
        backgroundColor: '#29c84e50',
        data: userRoundsRanking.map((round) => round.ranking?.score.percentage),
        label: '% de Pontos na Rodada',
        type: 'bar',
        yAxisID: 'y',
      },
    ],
    labels: userRoundsRanking.map((round) => returnLabelForRound(round.round)),
  };
});

const chartOptions = {
  maintainAspectRatio: false,
  responsive: true,
  scales: {
    x: { stacked: true },
    y: {
      position: 'left',
      stacked: true,
      title: {
        display: true,
        text: 'Pontos Acumulados',
      },
    },
    y1: {
      display: true,
      grid: {
        color: '#f4b303',
        drawOnChartArea: false,
      },
      max: 140,
      min: 1,
      position: 'right',
      reverse: true,
      stacked: false,
      ticks: {
        min: 1,
        stepSize: 1,
      },
      title: {
        display: true,
        text: 'Posição',
      },
      type: 'linear',
    },
  },
};

// ------ Watches ------
watch(
  () => props.isOpen,
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
</style>
