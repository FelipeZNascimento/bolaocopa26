<template>
  <div class="outer-extras">
    <h1>Extras</h1>
    <PrimeSelectButton :allowEmpty="false" size="small" v-model="selectedToggle" :options="buttonOptions" />
    <div
      v-if="isLoadingConfig || isLoadingExtras"
      style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 20px; flex-wrap: wrap"
    >
      <PrimeSkeleton class="skeleton-outer" />
      <PrimeSkeleton class="skeleton-outer" />
    </div>
    <div v-else-if="selectedToggle === 'Minhas'" class="outer-extras-tables">
      <ExtrasAfterUserBets conference="AFC" />
      <ExtrasAfterUserBets conference="NFC" />
    </div>
    <div v-else class="outer-extras-tables">
      <ExtrasAfterAllBets conference="AFC" />
      <ExtrasAfterAllBets conference="NFC" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';

import type { TExtrasAfterToggle } from '@/stores/extraBet.types';

import { useConfigurationStore } from '@/stores/configuration';
import { useExtraBetStore } from '@/stores/extraBet';

import ExtrasAfterAllBets from './After/ExtrasAfterAllBets.vue';
import ExtrasAfterUserBets from './After/ExtrasAfterUserBets.vue';

// ------ Refs ------
const selectedToggle = ref<TExtrasAfterToggle>('Minhas');
const buttonOptions = ref<TExtrasAfterToggle[]>(['Minhas', 'Geral']);

// ------ Initialization ------
const configurationStore = useConfigurationStore();
const extraBetStore = useExtraBetStore();

// ------ Computed Properties ------
const isLoadingExtras = computed(() => extraBetStore.isLoading);
const isLoadingConfig = computed(() => configurationStore.isLoading);
</script>
<style lang="scss" scoped>
.outer-extras {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: var(--m-spacing);
  padding: var(--l-spacing) 160px;
  flex: 1;

  @media (max-width: 767px) {
    padding: var(--xxl-spacing) var(--s-spacing);
  }
}

.outer-extras-tables {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--l-spacing);
}

.skeleton-outer {
  max-width: 400px;
  min-height: 670px;
}
</style>
