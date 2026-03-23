<template>
  <div style="width: 100%">
    <div
      class="outer-team"
      :class="[isNameless ? 'outer-team-nameless' : '']"
      :style="{
        flexDirection: isHomeTeam ? 'row' : 'row-reverse',
      }"
    >
      <div class="overlay">&nbsp;</div>
      <span
        :class="{
          'team-shield--line': !isGridMode,
          'team-shield--grid': isGridMode,
          'team-shield--left': isHomeTeam,
          'team-shield--right': !isHomeTeam,
        }"
      >
        <img
          :class="isScoreless ? 'team-shield-image-small' : 'team-shield-image'"
          :src="`https://assets.omegafox.me/copa/countries_flags/${team.isoCode.toLowerCase()}.png`"
          :alt="`${props.team.name} Shield`"
        />
      </span>
      <div v-if="!isNameless" class="team-alias">
        {{ isGridMode || isAlias ? team.abbreviation : team.name }}
      </div>
      <div
        v-if="!isScoreless"
        class="team-score"
        :style="{
          fontWeight: isWinning ? 'bold' : 'normal',
          // backgroundColor: props.team.colors[1],
          // color: props.team.colors[0],
        }"
      >
        {{ isHomeTeam ? score.home : score.away }}
      </div>
    </div>
    <div
      v-if="isScoreModalOpen"
      class="events-container"
      :style="{ alignItems: isHomeTeam ? 'flex-start' : 'flex-end' }"
    >
      <p
        style="
          display: flex;
          align-items: center;
          gap: var(--s-spacing);
          padding: var(--xxs-spacing) 0;
          min-height: 20px;
        "
        :style="{
          flexDirection: isHomeTeam ? 'row' : 'row-reverse',
          visibility: event.player.team.id === team.id ? 'visible' : 'hidden',
        }"
        v-for="event in events"
        :key="event.id"
      >
        <img style="height: 20px" :src="getEventIconUrl(event.event.id, isHomeTeam)" :alt="event.event.description" />
        <span>{{ event.event.gametime }}</span>
        <span
          class="player-name-hover"
          @mouseenter="(e) => showPlayerSticker(e, event.player)"
          @mouseleave="hidePlayerSticker"
        >
          {{ event.player.name }}
        </span>
      </p>
    </div>
  </div>

  <!-- Panini Sticker Popover -->
  <PrimePopover
    ref="playerPopover"
    class="player-sticker-popover"
    @mouseenter="onPopoverMouseEnter"
    @mouseleave="onPopoverMouseLeave"
  >
    <PlayerStickerComponent :player="selectedPlayer" />
  </PrimePopover>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

import type { IMatchEvent, IPlayer, IScore, ITeam } from '@/stores/matches.types';

import PlayerStickerComponent from '@/components/PlayerStickerComponent.vue';
import { MATCH_EVENT, type TMatchStatus } from '@/constants/match';

const props = withDefaults(
  defineProps<{
    events: IMatchEvent[];
    isAlias?: boolean;
    isGridMode: boolean;
    isHomeTeam?: boolean;
    isNameless?: boolean;
    isScoreless?: boolean;
    isScoreModalOpen?: boolean;
    isWinning?: boolean;
    matchStatus: TMatchStatus;
    score: IScore;
    team: ITeam;
  }>(),
  {
    isAlias: false,
    isHomeTeam: false,
    isNameless: false,
    isScoreless: false,
    isScoreModalOpen: false,
    isWinning: false,
  },
);

// ------ Refs ------
const playerPopover = ref();
const selectedPlayer = ref<IPlayer | null>(null);
const hideTimeout = ref<null | number>(null);
const isPopoverHovered = ref(false);

function clearHideTimeout() {
  if (hideTimeout.value !== null) {
    clearTimeout(hideTimeout.value);
    hideTimeout.value = null;
  }
}

// ------ Functions ------
function getEventIconUrl(eventType: number, isHome: boolean) {
  switch (eventType) {
    case MATCH_EVENT.GOAL: {
      return isHome
        ? 'https://assets.omegafox.me/copa/icons/goal.png'
        : 'https://assets.omegafox.me/copa/icons/goal_a.png';
    }
    case MATCH_EVENT.OWN_GOAL: {
      return isHome
        ? 'https://assets.omegafox.me/copa/icons/own_goal.png'
        : 'https://assets.omegafox.me/copa/icons/own_goal_a.png';
    }
    case MATCH_EVENT.PENALTY_GOAL: {
      return isHome
        ? 'https://assets.omegafox.me/copa/icons/penalty_goal.png'
        : 'https://assets.omegafox.me/copa/icons/penalty_goal_a.png';
    }
  }
}

function hidePlayerSticker() {
  scheduleHidePlayerSticker();
}

function onPopoverMouseEnter() {
  isPopoverHovered.value = true;
  clearHideTimeout();
}

function onPopoverMouseLeave() {
  isPopoverHovered.value = false;
  scheduleHidePlayerSticker();
}

function scheduleHidePlayerSticker() {
  clearHideTimeout();
  hideTimeout.value = window.setTimeout(() => {
    playerPopover.value?.hide();
    selectedPlayer.value = null;
    hideTimeout.value = null;
  }, 200);
}

function showPlayerSticker(event: MouseEvent, player: IPlayer) {
  clearHideTimeout();
  // Don't update if user is actively hovering over the popover
  if (isPopoverHovered.value) {
    return;
  }
  selectedPlayer.value = player;
  playerPopover.value?.show(event);
}
</script>
<style lang="scss" scoped>
.outer-team {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  height: var(--match-list-height);
  position: relative;
  color: var(--color-contrast);
  background-color: var(--bolao-c-white-t1);
  padding: 0 var(--xs-spacing);
  position: relative;
  overflow: hidden;
  border-radius: var(--border-radius);
}

.overlay {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 22px;
  background-color: color-mix(in srgb, var(--color-match-overlay) 40%, transparent);
}

.outer-team-nameless {
  min-width: 60px;
}
.team-shield {
  &--line {
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);

    @media (max-width: 1024px) {
      top: 0%;
      transform: none;
    }
  }

  &--left {
    left: 5%;

    @media (max-width: 1024px) {
      left: 5%;
    }
  }

  &--right {
    right: 5%;
    @media (max-width: 1024px) {
      right: 5%;
    }
  }

  &--grid {
    position: absolute;
    height: 60px;
    left: 20px;
    top: -50%;

    @media (max-width: 1024px) {
      top: 0%;
    }
  }
}

.team-shield-image {
  height: 60px;
  width: 60px;
  object-fit: contain;
  z-index: -1;

  @media (max-width: 1024px) {
    height: 60px;
    width: 60px;
  }
}

.team-shield-image-small {
  height: 60px;
  width: 60px;
  object-fit: contain;
  z-index: -1;
}

.team-alias {
  position: relative;
  padding: var(--s-spacing);
  // font-weight: bold;
  z-index: 99;
  font-size: var(--m-font-size);
  line-height: var(--xl-spacing);

  @media (max-width: 1024px) {
    font-size: var(--s-font-size);
  }

  @media (max-width: 1444px) {
    font-size: var(--m-font-size);
  }
}

.team-odds {
  width: 55px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--s-font-size);
  background-color: #0003;
  padding: 0 var(--s-spacing);
}

.team-score {
  min-width: 48px;
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--xl-font-size);
  background-color: color-mix(in srgb, var(--color-main), transparent 50%);
  color: var(--color-contrast);
  padding: 0 var(--m-spacing);
  border-radius: var(--border-radius);
  position: relative;
}
.events-container {
  padding-top: var(--m-spacing);
  display: flex;
  flex-direction: column;
}

.player-name-hover {
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: underline;
  text-decoration-style: dotted;
  text-underline-offset: 2px;

  &:hover {
    color: var(--bolao-c-gold);
    text-decoration-style: solid;
  }
}

:deep(.player-sticker-popover) {
  .p-popover {
    padding: 0;
    background: transparent;
    border: none;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  }
}
</style>
