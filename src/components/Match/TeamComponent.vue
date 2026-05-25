<template>
  <div style="width: 100%">
    <div
      class="outer-team"
      :class="[isNameless ? 'outer-team-nameless' : '', isMini ? 'is-mini' : '']"
      :style="{
        flexDirection: isHomeTeam ? 'row' : 'row-reverse',
      }"
    >
      <div
        class="team-shield--line"
        :class="{
          'team-shield--left': isHomeTeam,
          'team-shield--right': !isHomeTeam,
        }"
      >
        <img
          class="team-shield-image"
          :src="`https://assets.omegafox.me/copa/countries_flags/${team.isoCode.toLowerCase()}.png`"
          :alt="`${team.name} Shield`"
          fetchpriority="high"
        />
      </div>
      <div
        v-if="!isNameless"
        class="team-alias clickable"
        :class="{ 'is-mini': isMini }"
        :style="{ textAlign: isHomeTeam ? 'right' : 'left' }"
        role="button"
        tabindex="0"
        @click="openTeamModal(team)"
        @keydown.enter="openTeamModal(team)"
        @keydown.space.prevent="openTeamModal(team)"
      >
        {{ locale === 'pt-BR' ? team.name : team.nameEn }}
      </div>
      <BettingInput
        :is-mini="isMini"
        :match="match"
        :is-home-team="isHomeTeam"
        :is-winning="isWinning"
        :hit-level="hitLevel"
        @login-required="isLoginModalOpen = true"
      />
    </div>
    <div
      v-if="showEvents && events.length > 0"
      class="events-container"
      :class="{ 'is-home-events': isHomeTeam }"
      :style="{ alignItems: isHomeTeam ? 'flex-start' : 'flex-end' }"
    >
      <div
        v-for="event in events"
        :key="event.id"
        class="event"
        :style="{
          flexDirection: isHomeTeam ? 'row' : 'row-reverse',
          visibility: event.player.team.id === team.id ? 'visible' : 'hidden',
        }"
      >
        <div class="line">
          <img
            style="width: 20px; height: 20px"
            :src="getEventIconUrl(event.event.id, isHomeTeam)"
            :alt="event.event.description"
          />
          <span>{{ event.event.gametime }}</span>
        </div>
        <HoverablePlayerName
          v-if="event.player"
          :player="event.player"
          :text-align="isHomeTeam ? 'right' : 'left'"
        />
      </div>
    </div>
  </div>

  <!-- Modals -->
  <TeamDetailsModal
    :is-open="isTeamModalOpen"
    :team="selectedTeam"
    :handle-close-modal="closeTeamModal"
  />
  <LoginModal
    :is-open="isLoginModalOpen"
    :handle-close-modal="handleCloseLoginModal"
  />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type { THitLevel } from '@/constants/bets';
import type { IMatch, IMatchEvent } from '@/stores/matches.types';
import type { ITeam } from '@/stores/teams.types';

import LoginModal from '@/components/LoginModal.vue';
import TeamDetailsModal from '@/components/TeamDetailsModal.vue';
import { MATCH_EVENT } from '@/constants/match';

import HoverablePlayerName from '../HoverablePlayerName.vue';
import BettingInput from './BettingInput.vue';

const props = withDefaults(
  defineProps<{
    events: IMatchEvent[];
    hitLevel?: null | THitLevel;
    isAlias?: boolean;
    isHomeTeam?: boolean;
    isMini?: boolean;
    isNameless?: boolean;
    isWinning?: boolean;
    match: IMatch;
    showEvents?: boolean;
  }>(),
  {
    isAlias: false,
    isHomeTeam: false,
    isMini: false,
    isNameless: false,
    isWinning: false,
    showEvents: false,
  },
);

// ------ Refs ------
const selectedTeam = ref<ITeam | null>(null);
const isTeamModalOpen = ref(false);
const isLoginModalOpen = ref(false);

// ------ Initialization ------
const { locale } = useI18n();
const team = props.isHomeTeam ? props.match.homeTeam : props.match.awayTeam;

// ------ Functions ------
function closeTeamModal() {
  selectedTeam.value = null;
  isTeamModalOpen.value = false;
}

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

function handleCloseLoginModal() {
  isLoginModalOpen.value = false;
}

function openTeamModal(team: ITeam) {
  selectedTeam.value = team;
  isTeamModalOpen.value = true;
}
</script>
<style lang="scss" scoped>
.outer-team {
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  height: var(--match-list-height);
  padding: 0 var(--xs-spacing);
  overflow: hidden;
  color: var(--color-contrast);
  background:
    linear-gradient(
      105deg,
      color-mix(in srgb, var(--color-contrast) 3%, transparent) 0%,
      color-mix(in srgb, var(--color-main) 20%, transparent) 30%,
      color-mix(in srgb, var(--color-main) 38%, transparent) 45%,
      color-mix(in srgb, var(--color-main) 20%, transparent) 60%,
      color-mix(in srgb, var(--color-contrast) 3%, transparent) 100%
    ),
    var(--bolao-c-white-t1);
  border-radius: var(--border-radius);
  box-shadow: 0 3px 10px rgb(0 0 0 / 12%);

  &::after {
    position: absolute;
    inset: 0;
    z-index: 100;
    pointer-events: none;
    content: '';
    border-radius: var(--border-radius);
    box-shadow:
      inset 0 1px 0 color-mix(in srgb, var(--color-main) 65%, transparent),
      inset 0 0 0 1px color-mix(in srgb, var(--color-main) 18%, transparent),
      inset 0 -2px 0 rgb(0 0 0 / 10%);
  }

  &.is-mini {
    height: 48px;
  }

  @media (width <=768px) {
    height: var(--match-list-height-mobile);

    &.is-mini {
      height: 40px;
    }
  }
}

.outer-team-nameless {
  min-width: 60px;
}

.team-shield {
  &--line {
    position: absolute;
    top: 0;
    width: 40%;
    max-width: 140px;
    height: 100%;
    overflow: hidden;
    pointer-events: none;

    &.is-mini {
      width: 44px;
      max-width: 44px;
    }

    @media (width <= 768px) {
      width: 35%;
      max-width: 80px;

      &.is-mini {
        width: 44px;
        max-width: 44px;
      }
    }

    @media (width <= 320px) {
      width: 30%;
    }
  }

  &--left {
    left: 0;
    display: flex;
    justify-content: flex-end;

    &:not(.is-mini)::after {
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      content: '';
      background: linear-gradient(to right, transparent 30%, var(--bolao-c-white-t1));
    }
  }

  &--right {
    right: 0;
    display: flex;
    justify-content: flex-start;

    &:not(.is-mini)::after {
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      content: '';
      background: linear-gradient(to left, transparent 30%, var(--bolao-c-white-t1));
    }
  }
}

.team-shield-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 1;
}

.team-alias {
  position: relative;
  z-index: 99;
  display: -webkit-box;
  max-width: 40%;
  margin: var(--l-spacing);
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-size: var(--s-font-size);
  font-weight: 600;
  line-height: var(--xl-spacing);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-decoration: none;
  text-shadow:
    0 1px 3px rgb(from var(--color-main) r g b / 100%),
    0 0 8px rgb(from var(--color-main) r g b / 100%);
  transition: color 0.2s ease;

  @media (width <=768px) {
    max-width: 60%;
    padding: var(--xs-spacing);
    margin: var(--l-spacing) 0;
    font-size: var(--xs-font-size);
    line-height: var(--l-spacing);
  }

  @media (width <=320px) {
    max-width: 70%;
  }

  &.clickable {
    text-decoration: none;

    &:hover {
      color: var(--color-anchor);
      text-decoration: underline;
      text-decoration-style: solid;
      text-decoration-color: var(--color-anchor);
      text-underline-offset: 3px;
    }

    &:focus-visible {
      color: var(--color-anchor);
      text-decoration: underline;
      text-decoration-style: solid;
      text-decoration-color: var(--color-anchor);
      text-underline-offset: 3px;
      outline: 2px solid var(--color-anchor);
      outline-offset: 2px;
      border-radius: 2px;
    }

    @media (hover: none) {
      touch-action: manipulation;
    }
  }

  &.is-mini {
    max-width: 70%;
    padding: var(--xs-spacing);
    margin: 0;
    overflow: hidden;
    font-size: var(--xxs-font-size);
    line-height: var(--l-spacing);
  }
}

.events-container {
  display: flex;
  flex-direction: column;
  padding-top: var(--m-spacing);

  .event {
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 40px;
    padding: var(--xxs-spacing) var(--xs-spacing);
    border-bottom: 1px solid color-mix(in srgb, var(--bolao-c-grey3), transparent 80%);

    &:last-child {
      border-bottom: none;
    }

    .line {
      display: flex;
      flex-direction: column;
      gap: 0;
      align-items: center;
      justify-content: center;
      width: 60px;
      min-width: 60px;
      font-size: var(--xs-font-size);
      line-height: 1;
    }
  }

  &.is-home-events .event {
    border-left: 3px solid color-mix(in srgb, var(--bolao-c-mint), transparent 55%);
  }

  &:not(.is-home-events) .event {
    border-right: 3px solid color-mix(in srgb, var(--bolao-c-red), transparent 55%);
  }
}

:deep(.player-sticker-popover) {
  .p-popover {
    padding: 0;
    background: transparent;
    border: none;
    box-shadow: 0 10px 40px rgb(0 0 0 / 50%);
  }
}

:deep(.player-name-hover) {
  font-weight: 500;
}

.clickable {
  text-decoration: dotted underline;
  text-underline-offset: 2px;
  cursor: pointer;
}
</style>
