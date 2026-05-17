<template>
  <div class="match-list">
    <MatchComponent
      v-for="match in matches"
      :key="match.id"
      :match="match"
      :is-mini="true"
    />
  </div>
</template>

<script lang="ts" setup>
import type { IMatch } from '@/stores/matches.types';

import MatchComponent from '@/components/Match/MatchComponent.vue';

defineProps<{
  matches: IMatch[];
}>();
</script>

<style lang="scss" scoped>
.match-list {
  display: flex;
  flex-direction: column;
  gap: var(--xs-spacing);
}
</style>
