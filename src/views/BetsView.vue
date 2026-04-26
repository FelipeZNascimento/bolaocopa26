<template>
  <div style="display: flex">
    <div class="outer-matches">
      <PaginatorComponent />
      <ErrorChecker />
      <div class="outer-line-mode">
        <MatchesSkeleton v-if="isLoading" :is-loading="isLoading" />
        <GroupedMatches
          v-else
          :is-team-clickable="true"
          :matches="matches"
          :selected-round="selectedRound"
        />
      </div>
    </div>
    <RankingComponent v-if="isDesktop && rankingPosition === 'active'" />
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted } from "vue";

import ErrorChecker from "@/components/ErrorChecker.vue";
import GroupedMatches from "@/components/GroupedMatches.vue";
import MatchesSkeleton from "@/components/MatchesSkeleton.vue";
import PaginatorComponent from "@/components/PaginatorComponent.vue";
import RankingComponent from "@/components/Ranking/RankingComponent.vue";
import { useViewport } from "@/services/viewport";
import { useActiveProfileStore } from "@/stores/activeProfile";
import { useConfigurationStore } from "@/stores/configuration";
import { useMatchesStore } from "@/stores/matches";

// ------ Initialization ------
const configurationStore = useConfigurationStore();
const activeProfileStore = useActiveProfileStore();
const matchesStore = useMatchesStore();
const { isDesktop } = useViewport();

// ------ Computed Properties ------
const isConfigurationLoading = computed(() => configurationStore.isLoading);
const isMatchesLoading = computed(() => matchesStore.isLoading);
const matches = computed(() => matchesStore.matches);
const isLoading = computed(
  () => isConfigurationLoading.value || isMatchesLoading.value,
);
const rankingPosition = computed(() => configurationStore.rankingPosition);
const selectedRound = computed(() => configurationStore.selectedRound);
const activeProfile = computed(() => activeProfileStore.activeProfile);

onMounted(() => {
  if (!activeProfile.value) {
    // route the user back to games view if they try to access the bets view without an active profile
    window.location.href = "/";
  }
});
</script>
<style lang="scss" scoped>
.outer-matches {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--m-spacing);
  align-items: flex-start;
}

.outer-line-mode {
  position: relative;
  z-index: 1;
  display: flex;
  flex-flow: row wrap;
  gap: var(--l-spacing);
  align-items: flex-start;
  width: 100%;
  padding: var(--xl-spacing);

  @media (max-width: 1024px) {
    padding: var(--xs-spacing);
  }
}

.skeleton-match {
  height: 60px !important;
  margin: var(--s-spacing) 0;
}
</style>
