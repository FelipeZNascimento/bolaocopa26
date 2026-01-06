<template>
  <PrimeDataTable :value="rankingData" :size="rowSpacingConfig" :loading="isLoading" stripedRows>
    <PrimeColumn field="user.position" header="" sortable>
      <template #body="slotProps">
        <div style="display: flex; flex-direction: row">
          <div class="outer-position">
            {{ slotProps.data.user.position < 10 ? `0${slotProps.data.user.position}` : slotProps.data.user.position }}
            <IconAndName
              class="clickable"
              :isShort="columnConfig === 'complete'"
              :color="slotProps.data.user.color"
              :name="slotProps.data.user.name"
              :icon="slotProps.data.user.icon"
              :isActive="activeProfile?.id === slotProps.data.user.id"
              @click="() => handleUserClick(slotProps.data.user)"
            />
            <div class="badge" :class="slotProps.data.user.isOnline ? 'badgeOnline' : 'badgeOffline'"></div>
          </div>
        </div>
      </template>
    </PrimeColumn>
    <PrimeColumn field="score.total" header="Pts" sortable></PrimeColumn>
    <PrimeColumn field="score.bullseye" sortable>
      <template #header>
        <i v-tooltip.top="'Na mosca'" class="pi pi-bullseye"></i>
      </template>
    </PrimeColumn>
    <PrimeColumn v-if="isWeekly && columnConfig === 'complete'" field="score.winner" sortable>
      <template #header>
        <i v-tooltip.top="'Vencedor correto'" class="pi pi-check"></i>
      </template>
    </PrimeColumn>
    <PrimeColumn v-if="columnConfig === 'complete'" field="score.percentage" sortable>
      <template #header>
        <i v-tooltip.top="'Aproveitamento'" class="pi pi-percentage"></i>
      </template>
    </PrimeColumn>
    <PrimeColumn v-if="!isWeekly && columnConfig === 'complete'" field="score.extras" sortable>
      <template #header> <i v-tooltip.top="'Extras'" class="pi pi-plus"></i> </template>
    </PrimeColumn>
  </PrimeDataTable>
  <PrimeMessage v-if="error" class="error-message" severity="error" variant="outlined">
    Ops, houve um problema de comunicação com o servidor para buscar o ranking.
    <p>
      Certifique-se de que sua conexão está estável e tente novamente. Se o erro persistir, entre em contato com os
      administradores do Bolão.
    </p>
    <p>{{ error }}</p>
  </PrimeMessage>
  <UserTrackingModal
    :isOpen="isUserTrackingModalOpen"
    :isUserActive="activeProfile?.id === selectedUser?.id"
    :selectedUser="selectedUser"
    :handleCloseModal="() => ((isUserTrackingModalOpen = false), (selectedUser = null))"
  />
</template>
<script setup lang="ts">
import { ref } from 'vue';

import type { IUser } from '@/stores/activeProfile.types';
import type { TColumnsValue, TRowSpacingValue } from '@/stores/configuration.types';
import type { IRankingLine } from '@/stores/ranking.types';

import IconAndName from '@/components/IconAndName.vue';

import UserTrackingModal from './UserTrackingModal.vue';

defineProps<{
  activeProfile: IUser | null;
  columnConfig: TColumnsValue;
  error: Error | null;
  isLoading: boolean;
  isWeekly: boolean;
  rankingData: IRankingLine[];
  rowSpacingConfig: TRowSpacingValue;
}>();

// ------ Refs ------
const isUserTrackingModalOpen = ref<boolean>(false);
const selectedUser = ref<IUser | null>(null);

// ------ Functions ------
function handleUserClick(user: IUser) {
  isUserTrackingModalOpen.value = true;
  selectedUser.value = user;
}
</script>
<style lang="scss" scoped>
.outer-position {
  display: flex;
  gap: var(--s-spacing);
  align-items: center;
}

.badge {
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 50%;

  &Online {
    @extend .badge;
    background-color: var(--bolao-c-mint);
    color: var(--bolao-c-mint);

    &::after {
      position: absolute;
      top: 0;
      left: 0;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      animation: ripple 2s infinite ease-in-out;
      border: 1px solid;
      content: '';
    }
  }

  &Offline {
    @extend .badge;

    background-color: var(--bolao-c-grey3);
    color: var(--bolao-c-red);
    opacity: 0.2;
  }
}

.clickable {
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    opacity: 0.8;
    text-decoration: underline;
  }
}
</style>
