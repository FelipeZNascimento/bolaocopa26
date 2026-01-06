<template>
  <div
    :class="{
      'outer-clock': !isGridMode,
      'outer-clock-grid': isGridMode,
      'right-aligned': isMatchStarted,
      'left-aligned': !isMatchStarted,
    }"
  >
    <RibbonComponent v-if="activeProfile && ribbon" :ribbon="ribbon" />
    <span v-if="isClockStopped">{{ MATCH_STATUS_LABELS[status] }}</span>
    <span v-if="isMatchStarted && !isClockStopped">{{ clock }} {{ MATCH_STATUS_LABELS[status] }}</span>
    <span
      v-if="!isMatchStarted"
      :style="isGridMode ? { flexDirection: 'row' } : { flexDirection: 'column' }"
      style="display: flex; align-items: flex-end; flex-wrap: wrap"
      class="clock-time"
    >
      <p style="font-weight: bold">{{ clockStore.formattedDate(timestamp) }}</p>
      <span v-if="isGridMode" style="padding: 0 var(--xs-spacing)"></span>
      <p>{{ clockStore.formattedTime(timestamp) }}</p>
    </span>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';

import type { Ribbon } from '@/constants/bets';

import { MATCH_STATUS_LABELS, STOPPED_GAME, type TMatchStatus } from '@/constants/match_status';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useClockStore } from '@/stores/clock';

import RibbonComponent from './RibbonComponent.vue';

const props = defineProps<{
  clock: string;
  isGridMode?: boolean;
  isMatchStarted: boolean;
  ribbon?: Ribbon;
  status: TMatchStatus;
  timestamp: number;
}>();

// ------ Initialization ------
const clockStore = useClockStore();
const activeProfileStore = useActiveProfileStore();

// ------ Computed Properties ------
const activeProfile = computed(() => {
  return activeProfileStore.activeProfile;
});

const isClockStopped = computed(() => STOPPED_GAME.includes(props.status));
</script>
<style lang="scss" scoped>
.left-aligned {
  justify-content: flex-start;
}

.right-aligned {
  justify-content: flex-end;
}

.outer-clock {
  display: flex;
  align-items: center;
  font-size: var(--m-font-size);
  position: relative;
  background-color: var(--bolao-c-navy-t2);
  color: var(--bolao-c-grey1);
  min-height: 40px;

  span {
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 1023px) {
    width: 80px;
    font-size: var(--s-font-size);
    padding: 0 var(--m-spacing);
  }

  @media (min-width: 1024px) {
    width: 120px;
    font-size: var(--s-font-size);
    padding: 0 var(--m-spacing);
  }

  @media (min-width: 1440px) {
    width: 200px;
    font-size: var(--m-font-size);
    padding: 0 var(--xxl-spacing);
  }
}

.outer-clock-grid {
  background-color: var(--bolao-c-navy-t2);
  color: var(--bolao-c-grey1);
  min-height: 40px;
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 var(--m-spacing);
  font-size: var(--m-font-size);
}

.clock-date {
  font-size: var(--m2-font-size);
}

.clock-time {
  font-size: var(--m-font-size);

  @media (max-width: 1024px) {
    font-size: var(--s-font-size);
  }
}
</style>
