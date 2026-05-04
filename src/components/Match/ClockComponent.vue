<template>
  <div class="left-aligned outer-clock">
    <RibbonComponent
      v-if="activeProfile && hitLevel"
      :hit-level="hitLevel"
    />
    <span v-if="isClockStopped">{{ MATCH_STATUS_LABELS[status] }}</span>
    <span v-if="isMatchStarted && !isClockStopped">0' {{ MATCH_STATUS_LABELS[status] }}</span>
    <span
      v-if="!isMatchStarted"
      class="clock-future"
    >
      <i
        class="pi pi-clock"
        style="font-size: var(--m2-font-size)"
      />
      <div class="date">
        <p style="font-weight: bold">
          {{ clockStore.getFormattedDate(timestamp) }}
        </p>
        <p>
          {{ clockStore.getFormattedTime(timestamp) }}
        </p>
      </div>
    </span>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';

import type { HitLevel } from '@/constants/bets';

import { MATCH_STATUS_LABELS, STOPPED_GAME, type TMatchStatus } from '@/constants/match';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useClockStore } from '@/stores/clock';

import RibbonComponent from './RibbonComponent.vue';

const props = defineProps<{
  hitLevel?: HitLevel | null;
  isMatchStarted: boolean;
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
  position: relative;
  display: flex;
  align-items: center;
  font-size: var(--m-font-size);
  color: var(--color-contrast);
  background-color: var(--bolao-c-white-t1);
  border-radius: var(--border-radius);

  @media (width <=768px) {
    height: var(--match-list-height-mobile);
  }

  @media (width >=769px) {
    height: var(--match-list-height);
  }

  @media (width <=1023px) {
    padding: 0 var(--m-spacing);
    font-size: var(--s-font-size);
  }

  @media (width >=1024px) {
    width: 120px;
    padding: 0 var(--m-spacing);
    font-size: var(--s-font-size);
  }

  @media (width >=1440px) {
    width: 140px;
    padding: 0 var(--xxl-spacing);
    font-size: var(--m-font-size);
  }
}

.clock-future {
  display: flex;
  flex: 1;
  flex-direction: row;
  gap: var(--s-spacing);
  align-items: center;
  justify-content: center;
  font-size: var(--m-font-size);

  @media (width <=1024px) {
    font-size: var(--s-font-size);
  }

  .date {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    @media (width <=1024px) {
      flex-direction: row;
      gap: var(--s-spacing);
      font-size: var(--s-font-size);
    }
  }
}
</style>
