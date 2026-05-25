<template>
  <div
    class="left-aligned outer-clock"
    :class="{ 'is-mini': isMini, 'is-live': isMatchStarted && !isClockStopped }"
  >
    <RibbonComponent
      v-if="activeProfile && hitLevel"
      :hit-level="hitLevel"
      :points="getPointsAwarded(props.pointsAwarded, props.hitLevel)"
    />
    <span
      v-if="isMatchStarted"
      class="live-text"
    >
      <span
        v-if="status !== MATCH_STATUS.FINAL"
        class="live-dot-wrapper"
      >
        {{ status }}
        <Transition name="heartbeat">
          <span
            v-if="isHeartbeating"
            aria-hidden="true"
            class="live-dot-ring"
          />
        </Transition>
        <span class="live-dot" />
      </span>
      <span v-if="!isClockStopped">{{ gametimeDisplay }}</span>
      {{ MATCH_STATUS_LABELS[status] }}
    </span>
    <span
      v-if="!isMatchStarted"
      class="clock-future"
      :class="{ 'is-mini': isMini }"
    >
      <i
        class="pi pi-clock"
        style="font-size: var(--m-font-size)"
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
import { computed, ref, watch } from 'vue';

import type { IPointsAwarded } from '@/stores/matches.types';

import { type THitLevel } from '@/constants/bets';
import { MATCH_STATUS, MATCH_STATUS_LABELS, STOPPED_GAME, type TMatchStatus } from '@/constants/match';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useClockStore } from '@/stores/clock';
import { getPointsAwarded } from '@/util/betsCalculator';

import RibbonComponent from './RibbonComponent.vue';

const props = defineProps<{
  gametime?: null | string;
  hitLevel?: null | THitLevel;
  isMatchStarted: boolean;
  isMini?: boolean;
  pointsAwarded?: IPointsAwarded;
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

const gametimeDisplay = computed(() => (props.gametime != null ? props.gametime : ''));

const isClockStopped = computed(() => STOPPED_GAME.includes(props.status));

// ------ Refs ------
const isHeartbeating = ref(false);

// ------ Watches ------
watch(
  () => props.gametime,
  () => {
    isHeartbeating.value = true;
    setTimeout(() => {
      isHeartbeating.value = false;
    }, 400);
  },
);
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
  min-width: 120px;
  font-size: var(--m-font-size);
  color: var(--color-contrast);
  background:
    linear-gradient(
      150deg,
      color-mix(in srgb, var(--color-main) 28%, transparent) 0%,
      color-mix(in srgb, var(--color-main) 5%, transparent) 100%
    ),
    var(--bolao-c-white-t1);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 8px rgb(0 0 0 / 12%);

  @media (width >=1440px) {
    width: 140px;
    padding: 0 var(--xxl-spacing);
    font-size: var(--m-font-size);
  }

  @media (width >=1024px) {
    width: 120px;
    padding: 0 var(--m-spacing);
    font-size: var(--s-font-size);
  }

  @media (width <=1023px) {
    padding: 0 var(--m-spacing);
    font-size: var(--s-font-size);
  }

  @media (width >=769px) {
    height: var(--match-list-height);
  }

  @media (width <=768px) {
    height: 30px;
    font-size: var(--xs-font-size);
    background: none;
    box-shadow: none;
  }

  &::after {
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    content: '';
    border-radius: var(--border-radius);
    box-shadow:
      inset 0 1px 0 color-mix(in srgb, var(--color-main) 55%, transparent),
      inset 0 0 0 1px color-mix(in srgb, var(--color-main) 18%, transparent),
      inset 0 -2px 0 rgb(0 0 0 / 8%);
  }

  &.is-mini {
    height: unset;

    @media (width >= 769px) {
      width: 72px;
      padding: 0 var(--s-spacing);
      font-size: var(--xs-font-size);
    }
  }
}

@keyframes dot-pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.3;
    transform: scale(1.6);
  }
}

@keyframes bg-breathe {
  0%,
  100% {
    box-shadow: 0 2px 8px rgb(0 0 0 / 12%);
  }

  50% {
    box-shadow:
      0 1px 2px rgb(0 0 0 / 12%),
      0 0 3px 1px color-mix(in srgb, var(--bolao-c-red), transparent 45%);
  }
}

.outer-clock.is-live {
  animation: bg-breathe 2.5s ease-in-out infinite;
}

.live-text {
  display: flex;
  gap: 6px;
  align-items: center;
}

.live-dot-wrapper {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 7px;
  height: 7px;
}

.live-dot-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background: var(--bolao-c-red);
  border-radius: 50%;
}

.live-dot {
  display: inline-block;
  flex-shrink: 0;
  width: 7px;
  height: 7px;
  background: var(--bolao-c-red);
  border-radius: 50%;
  animation: dot-pulse 1.4s ease-in-out infinite;
}

@media (prefers-reduced-motion: no-preference) {
  @keyframes dot-ring {
    from {
      opacity: 0.7;
      transform: scale(1);
    }

    to {
      opacity: 0;
      transform: scale(4);
    }
  }

  .heartbeat-enter-active {
    animation: dot-ring 400ms ease-out forwards;
  }

  .heartbeat-leave-active {
    display: none;
  }
}

.clock-future {
  display: flex;
  flex: 1;
  flex-direction: row;
  gap: var(--s-spacing);
  align-items: center;
  justify-content: space-around;
  font-size: var(--m-font-size);

  &.is-mini {
    gap: var(--xxs-spacing);
    font-size: var(--xs-font-size);

    .date {
      flex-direction: column;
      gap: 0;
      font-size: var(--xs-font-size);
    }
  }

  .date {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: var(--s-font-size);

    @media (width <=1024px) {
      flex-direction: row;
      gap: var(--s-spacing);
      font-size: var(--xs-font-size);
    }
  }
}
</style>
