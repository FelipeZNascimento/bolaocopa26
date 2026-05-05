<template>
  <div class="outer">
    <div class="ranking-container">
      <RankingTable
        column-config="compact"
        row-spacing-config="small"
        :is-full-page="isFullPage"
      />
    </div>
    <RouterLink
      to="/ranking"
      class="see-full-ranking-link"
    >
      <PrimeButton
        class="match-info-toggle"
        label="Ver ranking completo"
        severity="secondary"
        aria-label="Ver ranking completo"
      />
    </RouterLink>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import { useActiveProfileStore } from '@/stores/activeProfile';

import RankingTable from './RankingTable.vue';

withDefaults(
  defineProps<{
    isFullPage?: boolean;
  }>(),
  { isFullPage: true },
);

// ------ Refs ------
const showFavoritesOnly = ref(false);

// ------ Initialization ------
const activeProfileStore = useActiveProfileStore();

// ------ Computed Properties  ------
const activeProfile = computed(() => activeProfileStore.activeProfile);

// if activeProfile becomes empty, showFavoritesOnly should be set to false to avoid showing empty ranking
watch(activeProfile, (newValue) => {
  if (!newValue) {
    showFavoritesOnly.value = false;
  }
});
</script>
<style scoped>
.outer {
  position: sticky;
  top: 10vh;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 440px;
  min-width: 310px;
  max-height: calc(80vh);
  background-color: var(--bolao-c-navbar);
  border-left: 1px solid var(--color-background-mute);
  border-radius: var(--border-radius);
  box-shadow: var(--drop-shadow);
}

.ranking-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  max-height: calc(100% - 50px);
  overflow-y: auto;
}

.see-full-ranking-link {
  flex: 0;
  padding: var(--l-spacing) 0;
}
</style>
