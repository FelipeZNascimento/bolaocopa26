<template>
  <div class="more-info-mobile-view-outer">
    <ClockComponent
      style="width: 100%"
      :timestamp="match.timestamp"
      :status="match.status"
      :clock="match.timestamp ? clockStore.getFormattedTime(match.timestamp) : null"
      :hit-level="hitLevel"
      :is-match-started="isMatchStarted"
      :points-awarded="match.pointsAwarded"
      :gametime="match.gametime"
      :show-points="true"
    />
    <ScoreComponent
      :is-score-modal-open="true"
      :match="match"
      :active-user-bet="match.loggedUserBets"
      :hit-level="hitLevel"
      :is-match-started="isMatchStarted"
      :show-events="false"
    />
    <PrimeSelect
      v-model="selectedOption"
      :options="options"
      optionLabel="name"
      optionValue="value"
      @change="onSelectOption"
    />
  </div>
  <div class="mobile-panel-content">
    <div
      v-if="selectedOption === OPTIONS.EVENTS"
      key="events"
      class="events-container"
    >
      <div style="display: flex; flex: 1">
        <EventLineComponent
          :events="match.events"
          :subs="match.subs"
          :home-team-id="match.homeTeam.id"
          :match-status="match.status"
          :match-score="match.score"
        />
      </div>
    </div>
    <div
      v-else-if="selectedOption === OPTIONS.SQUADS"
      key="squads"
      class="events-container"
    >
      <div style="display: flex; flex: 1">
        <SquadsComponent
          v-if="match.homeTeam.squad && match.awayTeam.squad"
          :home-team="match.homeTeam"
          :away-team="match.awayTeam"
          :events="match.events"
          :subs="match.subs"
        />
      </div>
    </div>
    <PlayByPlayEvents
      v-else-if="selectedOption === OPTIONS.PLAY_BY_PLAY"
      :match="match"
    />

    <div
      v-else-if="selectedOption === OPTIONS.MATCH_INFO"
      key="match-info"
    >
      <MoreInfoDetails :match="match" />
    </div>
  </div>
  <div v-if="selectedOption === OPTIONS.BETS">
    <BetsContainer :match="match" />
  </div>
</template>
<script lang="ts" setup>
import type { SelectButtonChangeEvent } from 'primevue';

import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type { THitLevel } from '@/constants/bets';
import type { IMatch } from '@/stores/matches.types';

import { useClockStore } from '@/stores/clock';

import ClockComponent from '../ClockComponent.vue';
import EventLineComponent from '../EventLineComponent.vue';
import ScoreComponent from '../ScoreComponent.vue';
import SquadsComponent from '../SquadsComponent.vue';
import BetsContainer from './BetsContainer.vue';
import MoreInfoDetails from './MoreInfoDetails.vue';
import PlayByPlayEvents from './PlayByPlayEvents.vue';

const props = defineProps<{
  hitLevel: null | THitLevel;
  isMatchStarted: boolean;
  match: IMatch;
}>();

enum OPTIONS {
  BETS,
  EVENTS,
  SQUADS,
  MATCH_INFO,
  PLAY_BY_PLAY,
}

// ------ Initialization ------
const clockStore = useClockStore();
const { t } = useI18n();

const selectedOption = ref(props.isMatchStarted ? OPTIONS.EVENTS : OPTIONS.MATCH_INFO);
const options = ref([
  { color: '--bolao-c-gold-l2', icon: 'pi pi-trophy', name: t('matches.bets'), value: OPTIONS.BETS },
  { color: '--bolao-c-mint-l2', icon: 'pi pi-users', name: t('matches.squads'), value: OPTIONS.SQUADS },
  { color: '--bolao-c-mint-l2', icon: 'pi pi-list-check', name: t('matches.events'), value: OPTIONS.EVENTS },
  {
    color: '--bolao-c-orange',
    icon: 'pi pi-play-circle',
    name: t('matches.playByPlay.title'),
    value: OPTIONS.PLAY_BY_PLAY,
  },
  { color: '--bolao-c-white', icon: 'pi pi-info-circle', name: t('matches.moreDetails'), value: OPTIONS.MATCH_INFO },
]);

function onSelectOption(newOption: SelectButtonChangeEvent) {
  selectedOption.value = newOption.value;
}
</script>
<style lang="scss" scoped>
.more-info-mobile-view-outer {
  display: flex;
  flex-direction: column;
  gap: var(--s-spacing);
  margin: 0 var(--xs-spacing) !important;
}

.events-container {
  display: flex;
  margin: var(--s-spacing) var(--xs-spacing) var(--s-spacing) var(--xs-spacing);
  background: color-mix(in srgb, var(--color-main) 20%, transparent);
  border-radius: var(--border-radius);
}

.mobile-panel-content {
  display: block;
  width: 100%;
}

.match-info-toggle {
  position: relative;
  display: flex;
  flex-direction: row;
  gap: var(--s-spacing);
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 30px;
  overflow: hidden;
  font-size: var(--xs-font-size);
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
      // color: var(--color-anchor);
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

.section-nav {
  display: flex;
  gap: var(--xs-spacing);
  align-items: center;
  justify-content: center;
  padding: var(--xs-spacing) var(--m-spacing);
  background-color: color-mix(in srgb, var(--color-main) 20%, transparent);
  border: 1px solid var(--bolao-c-blue3);
  border-radius: var(--border-radius);

  &__divider {
    width: 1px;
    height: 16px;
    background-color: var(--bolao-c-blue3);
  }
}
</style>
<style lang="scss">
@media (width <=768px) {
  .p-togglebutton-content {
    padding: var(--xs-spacing) 0 !important;
  }
}
</style>
