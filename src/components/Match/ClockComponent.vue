<template>
  <div class="left-aligned outer-clock">
    <RibbonComponent v-if="activeProfile && hitLevel" :hit-level="hitLevel" />
    <span v-if="isClockStopped">{{ MATCH_STATUS_LABELS[status] }}</span>
    <!-- <span v-if="isMatchStarted && !isClockStopped">{{ clock }} {{ MATCH_STATUS_LABELS[status] }}</span> -->
    <span
      v-if="!isMatchStarted"
      style="
        display: flex;
        align-items: flex-end;
        flex-wrap: wrap;
        flex-direction: column;
      "
      class="clock-time"
    >
      <p style="font-weight: bold">
        {{ clockStore.getFormattedDate(timestamp) }}
      </p>
      <p style="font-size: var(--s-font-size)">
        {{ clockStore.getFormattedTime(timestamp) }}
      </p>
    </span>
  </div>
</template>
<script lang="ts" setup>
import { computed } from "vue";

import type { HitLevel } from "@/constants/bets";

import {
  MATCH_STATUS_LABELS,
  STOPPED_GAME,
  type TMatchStatus,
} from "@/constants/match";
import { useActiveProfileStore } from "@/stores/activeProfile";
import { useClockStore } from "@/stores/clock";

import RibbonComponent from "./RibbonComponent.vue";

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
  display: flex;
  align-items: center;
  font-size: var(--m-font-size);
  position: relative;
  background-color: var(--bolao-c-white-t1);
  color: var(--color-contrast);
  border-radius: var(--border-radius);

  span {
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 768px) {
    height: calc(var(--match-list-height) - 20px);
  }

  @media (min-width: 769px) {
    height: var(--match-list-height);
  }
  @media (max-width: 1023px) {
    font-size: var(--s-font-size);
    padding: 0 var(--m-spacing);
  }

  @media (min-width: 1024px) {
    width: 120px;
    font-size: var(--s-font-size);
    padding: 0 var(--m-spacing);
  }

  @media (min-width: 1440px) {
    width: 140px;
    font-size: var(--m-font-size);
    padding: 0 var(--xxl-spacing);
  }
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
