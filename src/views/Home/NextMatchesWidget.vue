<template>
  <div
    v-if="isLoading || isStartupLoading"
    class="loading-state"
  >
    <PrimeSkeleton
      v-for="i in 3"
      :key="i"
      class="skeleton-row"
    />
  </div>
  <div
    v-else-if="matches.length === 0"
    class="empty-state"
  >
    <i class="pi pi-calendar-times" />
    <span>{{ t('home.nextMatches.empty') }}</span>
  </div>
  <div
    v-else
    class="match-list"
  >
    <MatchComponent
      v-for="match in matches"
      :key="match.id"
      :match="match"
      :is-mini="true"
    />
    <RouterLink
      to="/partidas"
      class="see-all-link"
    >
      {{ t('home.nextMatches.seeAll') }}
      <i class="pi pi-arrow-right" />
    </RouterLink>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';

import type { IMatch } from '@/stores/matches.types';

import MatchComponent from '@/components/Match/MatchComponent.vue';
import { useConfigurationStore } from '@/stores/configuration';
import { useMatchesStore } from '@/stores/matches';

defineProps<{
  matches: IMatch[];
}>();
// ------ Initialization ------
const matchesStore = useMatchesStore();
const configurationStore = useConfigurationStore();
const { t } = useI18n();

// ------ Computed ------
const isLoading = computed(() => matchesStore.isLoading);
const isStartupLoading = computed(() => configurationStore.isLoading);
</script>

<style lang="scss" scoped>
.loading-state {
  display: flex;
  flex-direction: column;
  gap: var(--xs-spacing);
  padding: var(--xs-spacing);
}

.skeleton-row {
  width: 100% !important;
  height: 48px !important;
  border-radius: 8px !important;
}

.empty-state {
  display: flex;
  flex-direction: column;
  gap: var(--s-spacing);
  align-items: center;
  justify-content: center;
  padding: var(--l-spacing);
  font-size: var(--s-font-size);
  color: var(--bolao-c-grey4);
}

.match-list {
  display: flex;
  flex-direction: column;
  gap: var(--xs-spacing);
}

.see-all-link {
  display: flex;
  gap: var(--xs-spacing);
  align-items: center;
  justify-content: center;
  padding: var(--xs-spacing);
  font-size: var(--s-font-size);
  color: var(--bolao-c-blue1);
  border-radius: 6px;
  transition: color 0.15s ease;

  &:hover {
    color: var(--bolao-c-sky);
    text-decoration: none;
  }
}
</style>
