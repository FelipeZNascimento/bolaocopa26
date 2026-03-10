<template>
  <div class="outer-paginator">
    <PrimePaginator
      class="paginator"
      :first="selectedRound && selectedRound - 1"
      :rows="1"
      :totalRecords="rounds.filter((round) => !round.hidden).length"
      :template="{
        default: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageDropdown',
      }"
      @page="handlePageChange"
    />
  </div>
</template>
<script setup lang="ts">
import type { PageState } from 'primevue';

import { computed, ref } from 'vue';

import { ROUNDS } from '@/constants/rounds';
import { useConfigurationStore } from '@/stores/configuration';

// ------ Refs ------
const rounds = ref(ROUNDS);

// ------ Initialization ------
const configurationStore = useConfigurationStore();

// ------ Computed Properties ------
const selectedRound = computed(() => configurationStore.selectedRound);

// ------ Functions ------
function handlePageChange(e: PageState) {
  console.log('Page changed to:', e.page + 1);
  configurationStore.setSelectedRound(e.page + 1);
}
</script>
<style lang="scss" scoped>
.outer-paginator {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-top: var(--xxl-spacing);
  border-radius: var(--border-radius);

  @media (max-width: 1024px) {
    gap: var(--xs-spacing);
  }

  @media (min-width: 1025px) {
    gap: var(--l-spacing);
  }
}
</style>
