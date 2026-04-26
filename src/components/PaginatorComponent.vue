<template>
  <div class="outer-paginator">
    <PrimePaginator
      :first="selectedRound && selectedRound - 1"
      :rows="1"
      :total-records="rounds.filter((round) => !round.hidden).length"
      :template="isMobile ? templateMobile : templateDesktop"
      @page="handlePageChange"
    />
  </div>
</template>
<script setup lang="ts">
import type { PageState } from "primevue";

import { computed, ref } from "vue";

import { ROUNDS } from "@/constants/rounds";
import { useViewport } from "@/services/viewport";
import { useConfigurationStore } from "@/stores/configuration";

// ------ Refs ------
const rounds = ref(ROUNDS);

// ------ Initialization ------
const configurationStore = useConfigurationStore();
const { isMobile } = useViewport();

// ------ Computed Properties ------
const selectedRound = computed(() => configurationStore.selectedRound);
const templateMobile =
  "PrevPageLink CurrentPageReport NextPageLink JumpToPageDropdown";
const templateDesktop =
  "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageDropdown";

// ------ Functions ------
function handlePageChange(e: PageState) {
  configurationStore.setSelectedRound(e.page + 1);
}
</script>
<style lang="scss" scoped>
.outer-paginator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: var(--border-radius);
  height: var(--paginator-height);
  // margin: var(--s-spacing) 0;

  @media (max-width: 1024px) {
    gap: var(--xs-spacing);
  }

  @media (min-width: 1025px) {
    gap: var(--l-spacing);
  }
}
</style>
