<template>
  <div class="outer-paginator">
    <select name="weekSelector" id="weekSelector" class="week-selector" @change="handlePageChangeFromDropdown">
      <option
        v-for="week in weeks.filter((week) => !week.hidden)"
        :key="week.num"
        :value="week.num"
        :selected="week.num === selectedWeek"
      >
        {{ week.display }}
      </option>
    </select>
    <PrimePaginator
      class="paginator"
      :first="selectedWeek && selectedWeek - 1"
      :rows="1"
      :totalRecords="weeks.filter((week) => !week.hidden).length"
      :template="{
        '1024px': 'FirstPageLink PrevPageLink NextPageLink LastPageLink',
      }"
      @page="handlePageChange"
    />
  </div>
</template>
<script setup lang="ts">
import type { PageState } from 'primevue';

import { computed, ref } from 'vue';

import { WEEKS } from '@/constants/weeks';
import { useConfigurationStore } from '@/stores/configuration';

// ------ Refs ------
const weeks = ref(WEEKS);

// ------ Initialization ------
const configurationStore = useConfigurationStore();

// ------ Computed Properties ------
const selectedWeek = computed(() => configurationStore.selectedWeek);

// ------ Functions ------
function handlePageChange(e: PageState) {
  console.log('Page changed to:', e.page + 1);
  configurationStore.setSelectedWeek(e.page + 1);
}

function handlePageChangeFromDropdown(e: Event) {
  const el = e.target as HTMLInputElement;
  configurationStore.setSelectedWeek(parseInt(el.value));
}
</script>
<style lang="scss" scoped>
.outer-paginator {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: var(--m-spacing);

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: var(--xs-spacing);
  }

  @media (min-width: 1025px) {
    flex-direction: row;
    gap: var(--l-spacing);
  }
}

.week-selector {
  height: 30px;
  width: 140px;
}
</style>
