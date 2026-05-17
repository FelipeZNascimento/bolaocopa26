<template>
  <div
    class="outer-paginator"
    :class="{ 'outer-paginator--sticky': isDesktop, scrolled: isScrolled }"
  >
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
        :label="t(`rounds.${round.num}.short`)"
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
        :option-label="(round: { num: number }) => t(`rounds.${round.num}.short`)"
        option-value="num"
        @update:model-value="setRound"
      />
    </div>
    <div
      v-if="selectedRound === 1 || selectedRound === 2 || selectedRound === 3"
      class="match-sorting-toggle"
    >
      <button
        v-tooltip.right="matchListSorting === 'group' ? t('paginator.sortByTime') : t('paginator.sortByGroup')"
        class="action-btn"
        :aria-label="matchListSorting === 'group' ? t('paginator.sortByTime') : t('paginator.sortByGroup')"
        :title="matchListSorting === 'group' ? t('paginator.sortByTime') : t('paginator.sortByGroup')"
        @click="handleListToggle"
      >
        <i :class="matchListSorting === 'group' ? 'pi pi-sort-numeric-down' : 'pi pi-sort-alpha-down'" />
      </button>
      <!-- <p style="font-size: var(--xs-font-size)">{{ matchListSorting === 'group' ? 'Horário' : 'Grupos' }}</p> -->
    </div>
  </div>
</template>
<script setup lang="ts">
import { useConfirm } from 'primevue';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { ROUNDS } from '@/constants/rounds';
import { useViewport } from '@/services/viewport';
import { useConfigurationStore } from '@/stores/configuration';
import { useMatchesStore } from '@/stores/matches';

// ------ Refs ------
const rounds = ref(ROUNDS);
const isScrolled = ref(false);

// ------ Initialization ------
const { t } = useI18n();
const configurationStore = useConfigurationStore();
const { isDesktop, isMobile } = useViewport();
const confirm = useConfirm();
const matchesStore = useMatchesStore();
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

// ------ Computed Properties ------
const selectedRound = computed(() => configurationStore.selectedRound);
const visibleRounds = computed(() => rounds.value.filter((r) => !r.hidden));
const matchListSorting = computed(() => configurationStore.matchListSorting);

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

// ------ Functions ------
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

const handleListToggle = () => {
  const newOption = matchListSorting.value === 'group' ? 'time' : 'group';
  configurationStore.setMatchListSorting(newOption);
};

const handleScroll = () => {
  if (!isDesktop) {
    return;
  }

  isScrolled.value = window.scrollY > 100;
};

function setRound(num: null | number) {
  if (num != null && matchesStore.hasAnyChanges()) {
    confirm.require({
      accept: () => {
        matchesStore.resetWorkingBets();
        configurationStore.setSelectedRound(num);
      },
      acceptProps: { label: t('paginator.unsavedBets.confirm'), severity: 'danger' },
      header: t('paginator.unsavedBets.header'),
      icon: 'pi pi-exclamation-triangle',
      message: t('paginator.unsavedBets.message'),
      rejectProps: { label: t('paginator.unsavedBets.cancel'), severity: 'secondary', variant: 'text' },
    });
  } else if (num != null) configurationStore.setSelectedRound(num);
}
</script>
<style lang="scss" scoped>
.outer-paginator {
  z-index: 10;
  display: flex;
  flex-direction: row;
  gap: var(--s-spacing);
  align-items: center;
  justify-content: center;
  width: 100%;
  height: var(--paginator-height);
  border-radius: var(--border-radius);

  @media (width <= 1024px) {
    height: var(--paginator-height-mobile);
  }

  &--sticky {
    position: sticky;
    top: 80px;
    height: unset;
    transition: top 0.3s ease;

    &.scrolled {
      top: 20px;
    }
  }

  h3 {
    padding: 0;
    margin: 0;
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

.match-sorting-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: var(--s-spacing);
  border-radius: var(--border-radius);
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  padding: 0;
  cursor: pointer;
  background: linear-gradient(135deg, var(--bolao-c-fifa-green1), var(--bolao-c-fifa-blue));
  border: 2px solid var(--color-border);
  border-radius: 50%;
  box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
  transition: all 0.3s ease;

  .pi {
    font-size: var(--m-font-size);
    color: white;
    transition: color 0.3s ease;
  }

  // Interaction states
  &:hover:not(:disabled) {
    box-shadow: 0 6px 16px rgb(0 0 0 / 25%);
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &.disabled,
  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
}
</style>
