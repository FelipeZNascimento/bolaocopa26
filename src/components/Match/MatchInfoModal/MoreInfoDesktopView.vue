<template>
  <div class="more-info-desktop-view-outer">
    <ClockComponent
      style="margin-right: var(--l-spacing)"
      :timestamp="match.timestamp"
      :status="match.status"
      :clock="match.timestamp ? clockStore.getFormattedTime(match.timestamp) : null"
      :hit-level="hitLevel"
      :is-match-started="isMatchStarted"
      :points-awarded="match.pointsAwarded"
      :gametime="match.gametime"
    />
    <ScoreComponent
      :is-score-modal-open="true"
      :match="match"
      :active-user-bet="match.loggedUserBets"
      :hit-level="hitLevel"
      :is-match-started="isMatchStarted"
      :show-events="false"
    />
    <div
      class="match-info-toggle"
      role="button"
      tabindex="0"
      :aria-label="$t('match.moreInfo')"
      @click="toggleMatchInfo"
      @keydown.enter="toggleMatchInfo"
      @keydown.space.prevent="toggleMatchInfo"
    >
      <i class="pi pi-info-circle" />
    </div>
  </div>
  <div
    class="events-container"
    style="justify-content: center; align-items: center; flex: 1; border-radius: 0"
  >
    <PrimeToggleSwitch @click="showEvents = !showEvents" />{{ t('matches.showEvents') }}
  </div>
  <Transition name="expand">
    <div
      v-if="showEvents"
      class="events-container"
    >
      <div style="width: 120px">&nbsp;</div>
      <div style="display: flex; flex: 1">
        <EventLineComponent
          :events="match.events"
          :home-team-id="match.homeTeam.id"
          :match-status="match.status"
        />
      </div>
      <div style="width: 60px">&nbsp;</div>
    </div>
  </Transition>
  <Transition name="expand">
    <MoreInfoDetails
      v-if="showMatchInfo"
      :match="match"
    />
  </Transition>
  <BetsContainer :match="match" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type { THitLevel } from '@/constants/bets';
import type { IMatch } from '@/stores/matches.types';

import { useClockStore } from '@/stores/clock.ts';

import ClockComponent from '../ClockComponent.vue';
import EventLineComponent from '../EventLineComponent.vue';
import ScoreComponent from '../ScoreComponent.vue';
import BetsContainer from './BetsContainer.vue';
import MoreInfoDetails from './MoreInfoDetails.vue';

defineProps<{
  hitLevel: null | THitLevel;
  isMatchStarted: boolean;
  match: IMatch;
}>();

// ------ Initialization ------
const clockStore = useClockStore();
const showMatchInfo = ref(false);
const showEvents = ref(true);
const { t } = useI18n();

function toggleMatchInfo() {
  showMatchInfo.value = !showMatchInfo.value;
}
</script>
<style lang="scss" scoped>
.more-info-desktop-view-outer {
  display: flex;
  padding: var(--m-spacing);
  margin: 0 var(--l-spacing) !important;
  background: color-mix(in srgb, var(--color-main) 60%, transparent);
  border-top-left-radius: var(--border-radius);
  border-top-right-radius: var(--border-radius);
}

.events-container {
  display: flex;
  gap: var(--l-spacing);
  padding: 0 var(--m-spacing) var(--m-spacing) var(--m-spacing);
  margin: 0 var(--l-spacing) !important;
  background: color-mix(in srgb, var(--color-main) 60%, transparent);
  border-bottom-right-radius: var(--border-radius);
  border-bottom-left-radius: var(--border-radius);
}

.match-info-toggle {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--xxs-spacing);
  align-items: center;
  justify-content: center;
  width: 60px;
  height: var(--match-list-height);
  padding: var(--s-spacing);
  margin-left: var(--l-spacing);
  overflow: hidden;
  font-weight: 600;
  cursor: pointer;
  background:
    linear-gradient(
      150deg,
      color-mix(in srgb, var(--color-main) 28%, transparent) 0%,
      color-mix(in srgb, var(--color-main) 5%, transparent) 100%
    ),
    var(--bolao-c-white-t1);
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
    font-size: var(--l-font-size);
    color: var(--color-contrast);
    transition:
      color 0.2s ease,
      transform 0.2s ease;
  }

  span {
    position: relative;
    z-index: 1;
    white-space: nowrap;
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

.expand-enter-active,
.expand-leave-active {
  opacity: 1;
  transition: opacity 0.25s ease;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  opacity: 0;
}
</style>
