<template>
  <div class="outer-paginator">
    <!-- Mobile: Prev + Select (displayShort) + Next -->
    <div
      v-if="isMobile"
      class="paginator-container"
    >
      <PrimeButton
        icon="pi pi-angle-left"
        text
        rounded
        :disabled="isFirst"
        aria-label="Previous Page"
        @click="prevPage"
      />
      <PrimeSelect
        :model-value="selectedRound"
        :options="visibleRounds"
        option-label="displayShort"
        option-value="num"
        @update:model-value="setRound"
      />
      <PrimeButton
        icon="pi pi-angle-right"
        text
        rounded
        :disabled="isLast"
        aria-label="Next Page"
        @click="nextPage"
      />
    </div>

    <!-- Desktop: First + Prev + page buttons (num) + Next + Last + Select (displayShort) -->
    <div
      v-else
      class="paginator-container"
    >
      <PrimeButton
        icon="pi pi-angle-double-left"
        text
        rounded
        :disabled="isFirst"
        aria-label="First Page"
        @click="firstPage"
      />
      <PrimeButton
        icon="pi pi-angle-left"
        text
        rounded
        :disabled="isFirst"
        aria-label="Previous Page"
        @click="prevPage"
      />
      <PrimeButton
        v-for="round in windowedRounds"
        :key="round.num"
        class="page-btn"
        :class="{ 'page-btn--active': round.num === selectedRound }"
        :label="round.displayShort"
        text
        rounded
        :aria-label="`Page ${round.num}`"
        :aria-current="round.num === selectedRound ? 'page' : undefined"
        @click="setRound(round.num)"
      />
      <PrimeButton
        icon="pi pi-angle-right"
        text
        rounded
        :disabled="isLast"
        aria-label="Next Page"
        @click="nextPage"
      />
      <PrimeButton
        icon="pi pi-angle-double-right"
        text
        rounded
        :disabled="isLast"
        aria-label="Last Page"
        @click="lastPage"
      />
      <PrimeSelect
        :model-value="selectedRound"
        :options="visibleRounds"
        option-label="displayShort"
        option-value="num"
        @update:model-value="setRound"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';

import { ROUNDS } from '@/constants/rounds';
import { useViewport } from '@/services/viewport';
import { useConfigurationStore } from '@/stores/configuration';

// ------ Refs ------
const rounds = ref(ROUNDS);

// ------ Initialization ------
const configurationStore = useConfigurationStore();
const { isMobile } = useViewport();

// ------ Computed Properties ------
const selectedRound = computed(() => configurationStore.selectedRound);
const visibleRounds = computed(() => rounds.value.filter((r) => !r.hidden));

const PAGE_LINK_SIZE = 5;
const windowedRounds = computed(() => {
  const all = visibleRounds.value;
  if (all.length <= PAGE_LINK_SIZE) return all;
  const idx = Math.max(
    0,
    all.findIndex((r) => r.num === selectedRound.value),
  );
  const half = Math.floor(PAGE_LINK_SIZE / 2);
  const end = Math.min(all.length, Math.max(PAGE_LINK_SIZE, idx + half + 1));
  const start = Math.max(0, end - PAGE_LINK_SIZE);
  return all.slice(start, end);
});

const isFirst = computed(() => {
  const first = visibleRounds.value[0]?.num;
  return !selectedRound.value || selectedRound.value === first;
});

const isLast = computed(() => {
  const last = visibleRounds.value[visibleRounds.value.length - 1]?.num;
  return !selectedRound.value || selectedRound.value === last;
});

function firstPage() {
  const first = visibleRounds.value[0];
  if (first) setRound(first.num);
}

function lastPage() {
  const last = visibleRounds.value[visibleRounds.value.length - 1];
  if (last) setRound(last.num);
}

function nextPage() {
  const idx = visibleRounds.value.findIndex((r) => r.num === selectedRound.value);
  if (idx < visibleRounds.value.length - 1) setRound(visibleRounds.value[idx + 1].num);
}

function prevPage() {
  const idx = visibleRounds.value.findIndex((r) => r.num === selectedRound.value);
  if (idx > 0) setRound(visibleRounds.value[idx - 1].num);
}

// ------ Functions ------
function setRound(num: null | number) {
  if (num != null) configurationStore.setSelectedRound(num);
}
</script>
<style lang="scss" scoped>
.outer-paginator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: var(--paginator-height);

  // background: var(--color-background);
  border-radius: var(--border-radius);

  // @media (width <= 1024px) {
  //   gap: var(--xs-spacing);
  // }

  // @media (width >= 1025px) {
  //   gap: var(--l-spacing);
  // }

  h3 {
    padding: 0;
    margin: 0;

    // line-height: var(--xxs-font-size);
  }
}

.paginator-container {
  display: flex;
  gap: var(--xs-spacing);
  align-items: center;
  padding: var(--s-spacing);
  background-color: var(--bolao-c-blue3);
  border-radius: var(--border-radius);

  :deep(.p-button) {
    color: white;

    &:not(:disabled):hover {
      color: white;
    }

    &:disabled {
      color: white;
      opacity: 0.3;
    }
  }

  // Active page button: gold background
  .page-btn {
    &:not(.page-btn--active):hover {
      // color: red !important;
      background-color: var(--bolao-c-blue2) !important;
    }
  }

  :deep(.p-button-text:not(:disabled, .page-btn--active):hover) {
    background-color: var(--bolao-c-blue2-t2) !important;
  }

  .page-btn--active {
    color: var(--bolao-c-blue4) !important;
    background-color: var(--bolao-c-gold) !important;
    border-color: var(--bolao-c-gold) !important;

    &:hover {
      background-color: var(--bolao-c-gold-d1) !important;
      border-color: var(--bolao-c-gold-d1) !important;
    }
  }

  // Select trigger: white text
  :deep(.p-select-label) {
    color: white;
  }

  :deep(.p-select-dropdown-icon) {
    color: white;
  }
}
</style>
