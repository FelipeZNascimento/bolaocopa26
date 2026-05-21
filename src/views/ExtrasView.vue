<template>
  {{ configurationStore.editionStart }}
  <div
    v-if="!activeProfile && !isLoading"
    style="padding: var(--l-spacing)"
  >
    <BannerComponent :items="[{ key: 'common.loggedInOnly', type: 'description' }]" />
  </div>
  <ExtrasBefore v-else-if="!isLoading && !isEditionStarted" />
  <ExtrasAfter v-else-if="!isLoading && isEditionStarted" />
</template>
<script setup lang="ts">
import { computed } from 'vue';

import BannerComponent from '@/components/BannerComponent.vue';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useClockStore } from '@/stores/clock';
import { useConfigurationStore } from '@/stores/configuration';

import ExtrasAfter from './Extras/ExtrasAfter.vue';
import ExtrasBefore from './Extras/ExtrasBefore.vue';

// ------ Initialization ------
const clockStore = useClockStore();
const configurationStore = useConfigurationStore();
const activeProfileStore = useActiveProfileStore();

// ------ Computed Properties ------
const isLoading = computed(() => configurationStore.isLoading || activeProfileStore.isLoading);
const activeProfile = computed(() => activeProfileStore.activeProfile);
const isEditionStarted = computed(
  () => configurationStore.editionStart && clockStore.currentTimestamp >= configurationStore.editionStart,
);
</script>
<style lang="scss" scoped>
.skeleton-outer {
  width: 100% !important;
  height: 500px !important;
  margin-top: var(--l-spacing);
}
</style>
