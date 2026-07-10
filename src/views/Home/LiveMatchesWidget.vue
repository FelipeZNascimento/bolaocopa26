<template>
  <div class="match-list">
    <MatchComponent
      v-for="match in liveMatches"
      :key="match.id"
      :match="match"
      :is-mini="true"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import MatchComponent from '@/components/Match/MatchComponent.vue';
import { useMatchesStore } from '@/stores/matches';

const matchesStore = useMatchesStore();
const liveMatches = computed(() => matchesStore.liveMatches);
</script>

<style lang="scss" scoped>
.match-list {
  display: flex;
  flex-direction: column;
  gap: var(--xs-spacing);
}
</style>
