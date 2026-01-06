<template>
  <PrimeSkeleton class="skeleton-outer" v-if="isLoadingConfig" />
  <ExtrasBefore v-else-if="!isSeasonStarted" />
  <ExtrasAfter />
</template>
<script setup lang="ts">
import { computed } from 'vue';

import { useClockStore } from '@/stores/clock';
import { useConfigurationStore } from '@/stores/configuration';

import ExtrasAfter from './Extras/ExtrasAfter.vue';
import ExtrasBefore from './Extras/ExtrasBefore.vue';

// ------ Initialization ------
const clockStore = useClockStore();
const configurationStore = useConfigurationStore();

// ------ Computed Properties ------
const isLoadingConfig = computed(() => configurationStore.isLoading);
const isSeasonStarted = computed(
  () => configurationStore.seasonStart && clockStore.currentTimestamp >= configurationStore.seasonStart,
);
</script>
<style lang="scss" scoped>
.skeleton-outer {
  margin-top: var(--l-spacing);

  width: 100% !important;
  height: 500px !important;
}
</style>
