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
        <i
          v-if="!isUserActive"
          v-tooltip.top="isFavorite() ? 'Remover favorito' : 'Adicionar aos favoritos'"
          :class="isFavorite() ? 'pi pi-star-fill' : 'pi pi-star'"
          class="favorite-star"
          @click="toggleFavorite"
        />
        {{ selectedUser?.nickname }}
      </p>
    </template>
    <PrimeChart
      type="bar"
      :data="chartData"
      :style="{ height: '300px', backgroundColor: 'var(--surface-card)', borderRadius: 'var(--border-radius)' }"
      :options="chartOptions"
    />
    <PrimeDivider />
    <h2 style="text-align: center">Apostas Extras</h2>
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
import { computed, ref, watch } from 'vue';

import type { IUser } from '@/stores/activeProfile.types';

import LoginModal from '@/components/NavbarTop/LoginModal.vue';
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

function toggleFavorite() {
  if (!activeProfile.value) {
    isLoginModalOpen.value = true;
    return;
  }

  if (!props.selectedUser) return;

  if (props.selectedUser.id === activeProfile.value.id) {
    notificationStore.error('You cannot favorite yourself', 'Invalid Action');
    return;
  }

  const userId = props.selectedUser.id;
  const newFavorites = favorites.value.includes(userId)
    ? favorites.value.filter((id) => id !== userId)
    : [...favorites.value, userId];

  userService.updateFavorites(newFavorites, (isSuccess) =>
    updateCallback(isSuccess, props.selectedUser?.nickname ?? ''),
  );
}

function updateCallback(isSuccess: boolean, selectedUser: string) {
  if (isSuccess) {
    notificationStore.success(`${selectedUser} agora é um favorito!`, 'Favorito Adicionado');
    console.log('Favorites updated successfully');
  } else {
    notificationStore.error('Falha ao atualizar favoritos', 'error');
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
      // {
      //   backgroundColor: '#03a9f450',
      //   data: userRoundsRanking.map((round) => round.ranking?.score.winner),
      //   label: '% Pontos Vencedores',
      //   type: 'bar',
      //   yAxisID: 'y',
      // },
    ],
    labels: userRoundsRanking.map((round) => `Rodada ${round.round}`),
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

.favorite-star {
  font-size: 1.2rem;
  color: var(--bolao-c-yellow, #f4b303);
  cursor: pointer;
  transition:
    transform 0.2s,
    opacity 0.2s;
}

.favorite-star:hover {
  opacity: 0.8;
  transform: scale(1.2);
}

.pi-star {
  opacity: 0.5;
}

.pi-star-fill {
  opacity: 1;
}
</style>
