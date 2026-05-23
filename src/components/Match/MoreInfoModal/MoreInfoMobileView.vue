<template>
  <div class="outer">
    <ClockComponent
      style="width: 100%"
      :timestamp="parseInt(match.timestamp, 10)"
      :status="match.status"
      :clock="match.timestamp ? clockStore.getFormattedTime(parseInt(match.timestamp, 10)) : null"
      :hit-level="hitLevel"
      :is-match-started="isMatchStarted"
    />
    <ScoreComponent
      :is-score-modal-open="true"
      :match="match"
      :active-user-bet="match.loggedUserBets"
      :is-match-started="isMatchStarted"
    />
    <button
      class="match-info-toggle"
      :aria-expanded="showMatchInfo"
      :aria-label="t('matches.moreDetails')"
      @click="toggleMatchInfo"
    >
      <i :class="showMatchInfo ? 'pi pi-minus' : 'pi pi-plus'" />
      <span>{{ t('matches.moreDetails') }}</span>
    </button>
  </div>
  <MoreInfoDetails
    :match="match"
    :showMatchInfo="showMatchInfo"
  />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type { HitLevel } from '@/constants/bets';
import type { IMatch } from '@/stores/matches.types';

import { useClockStore } from '@/stores/clock';

import ClockComponent from '../ClockComponent.vue';
import ScoreComponent from '../ScoreComponent.vue';
import MoreInfoDetails from './MoreInfoDetails.vue';

defineProps<{
  hitLevel: HitLevel | null;
  isMatchStarted: boolean;
  match: IMatch;
}>();

// ------ Initialization ------
const showMatchInfo = ref(false);
const clockStore = useClockStore();
const { t } = useI18n();

// ------ Functions ------
function toggleMatchInfo() {
  showMatchInfo.value = !showMatchInfo.value;
}
</script>
<style lang="scss" scoped>
.outer {
  display: flex;
  flex-direction: column;
  gap: var(--s-spacing);
  margin: 0 var(--xs-spacing) !important;
}

.match-info-toggle {
  position: relative;
  display: flex;
  flex-direction: row;
  gap: var(--s-spacing);
  align-items: center;
  justify-content: center;
  width: 100%;
  height: var(--match-list-height-mobile);
  overflow: hidden;
  font-size: var(--s-font-size);
  font-weight: 600;
  color: var(--color-contrast);
  cursor: pointer;
  background:
    linear-gradient(
      150deg,
      color-mix(in srgb, var(--color-main) 28%, transparent) 0%,
      color-mix(in srgb, var(--color-main) 5%, transparent) 100%
    ),
    var(--bolao-c-white-t1);
  border: none;
  border-radius: var(--border-radius);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--color-main) 55%, transparent),
    inset 0 0 0 1px color-mix(in srgb, var(--color-main) 18%, transparent),
    inset 0 -2px 0 rgb(0 0 0 / 8%),
    0 2px 8px rgb(0 0 0 / 12%);
  transition:
    box-shadow 0.2s ease,
    transform 0.15s ease;

  &::before {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    content: '';
    background: radial-gradient(
      ellipse at 50% 140%,
      color-mix(in srgb, var(--color-anchor) 35%, transparent) 0%,
      transparent 65%
    );
    border-radius: var(--border-radius);
    opacity: 0;
    transition: opacity 0.25s ease;
  }

  i {
    position: relative;
    z-index: 1;
    font-size: var(--m-font-size);
    color: var(--color-contrast);
    transition:
      color 0.2s ease,
      transform 0.2s ease;
  }

  span {
    position: relative;
    z-index: 1;
  }

  &:hover {
    box-shadow:
      inset 0 1px 0 color-mix(in srgb, var(--color-main) 65%, transparent),
      inset 0 0 0 1px color-mix(in srgb, var(--color-anchor) 45%, transparent),
      inset 0 -2px 0 rgb(0 0 0 / 8%),
      0 6px 18px rgb(0 0 0 / 22%);
    transform: translateY(-2px);

    &::before {
      opacity: 1;
    }

    i {
      color: var(--color-anchor);
      transform: scale(1.2);
    }
  }

  &:active {
    box-shadow:
      inset 0 1px 0 color-mix(in srgb, var(--color-main) 40%, transparent),
      inset 0 0 0 1px color-mix(in srgb, var(--color-main) 12%, transparent),
      inset 0 -1px 0 rgb(0 0 0 / 5%),
      0 1px 3px rgb(0 0 0 / 10%);
    transform: scale(0.96);
  }

  @media (hover: none) {
    &:active {
      transform: scale(0.93);
    }
  }
}
</style>
