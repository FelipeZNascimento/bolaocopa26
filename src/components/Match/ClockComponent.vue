<template>
  <div class="left-aligned outer-clock">
    <RibbonComponent v-if="activeProfile && hitLevel" :hit-level="hitLevel" />
    <span v-if="isClockStopped">{{ MATCH_STATUS_LABELS[status] }}</span>
    <!-- <span v-if="isMatchStarted && !isClockStopped">{{ clock }} {{ MATCH_STATUS_LABELS[status] }}</span> -->
    <span
      v-if="!isMatchStarted"
      style="
        display: flex;
        flex-flow: column wrap;
        align-items: flex-end;
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
  position: relative;
  display: flex;
  align-items: center;
  font-size: var(--m-font-size);
  color: var(--color-contrast);
  background-color: var(--bolao-c-white-t1);
  border-radius: var(--border-radius);

  span {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  @media (width <= 768px) {
    height: calc(var(--match-list-height) - 20px);
  }

  @media (width >= 769px) {
    height: var(--match-list-height);
  }

  @media (width <= 1023px) {
    padding: 0 var(--m-spacing);
    font-size: var(--s-font-size);
  }

  @media (width >= 1024px) {
    width: 120px;
    padding: 0 var(--m-spacing);
    font-size: var(--s-font-size);
  }

  @media (width >= 1440px) {
    width: 140px;
    padding: 0 var(--xxl-spacing);
    font-size: var(--m-font-size);
  }
}

.clock-date {
  font-size: var(--m2-font-size);
}

.clock-time {
  font-size: var(--m-font-size);

  @media (width <= 1024px) {
    font-size: var(--s-font-size);
  }
}
</style>
