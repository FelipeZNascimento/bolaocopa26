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
      <div
        class="team-shield--line"
        :class="{
          'team-shield--left': isHomeTeam,
          'team-shield--right': !isHomeTeam,
        }"
      >
        <img
          :class="isScoreless ? 'team-shield-image-small' : 'team-shield-image'"
          :src="`https://assets.omegafox.me/copa/countries_flags/${team.isoCode.toLowerCase()}.png`"
          :alt="`${team.name} Shield`"
        />
      </div>
      <div
        v-if="!isNameless"
        class="team-alias"
        :class="{ clickable: isBetting }"
        @click="isBetting && openTeamModal(team)"
      >
        {{ isAlias ? team.abbreviation : team.name }}
      </div>
      <div
        v-if="!isScoreless"
        class="team-score"
        :style="{
          fontWeight: isWinning ? 'bold' : 'normal',
        }"
      >
        {{ isHomeTeam ? score?.home : score?.away }}
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
        <HoverablePlayerName v-if="event.player" :player="event.player" />
      </p>
    </div>
  </div>

  <!-- Team Details Modal -->
  <TeamDetailsModal :isOpen="isTeamModalOpen" :team="selectedTeam" :handleCloseModal="closeTeamModal" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';

import type { IMatchEvent, IScore } from '@/stores/matches.types';
import type { ITeam } from '@/stores/teams.types';

import TeamDetailsModal from '@/components/TeamDetailsModal.vue';
import { MATCH_EVENT, type TMatchStatus } from '@/constants/match';

import HoverablePlayerName from '../HoverablePlayerName.vue';

withDefaults(
  defineProps<{
    events: IMatchEvent[];
    isAlias?: boolean;
    isBetting?: boolean;
    isHomeTeam?: boolean;
    isNameless?: boolean;
    isScoreless?: boolean;
    isScoreModalOpen?: boolean;
    isWinning?: boolean;
    matchStatus: TMatchStatus;
    score?: IScore;
    team: ITeam;
  }>(),
  {
    isAlias: false,
    isBetting: false,
    isHomeTeam: false,
    isNameless: false,
    isScoreless: false,
    isScoreModalOpen: false,
    isWinning: false,
  },
);

// ------ Refs ------
const selectedTeam = ref<ITeam | null>(null);
const isTeamModalOpen = ref(false);

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

function openTeamModal(team: ITeam) {
  selectedTeam.value = team;
  isTeamModalOpen.value = true;
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
    height: 100%;
    max-width: 90px;

    @media (max-width: 1024px) {
      top: 0%;
      transform: none;
    }
  }

  &--left {
    left: 0;
    display: flex;
    justify-content: flex-end;

    @media (max-width: 1024px) {
      left: 5%;
    }
  }

  &--right {
    right: 0;
    display: flex;
    justify-content: flex-start;

    @media (max-width: 1024px) {
      right: 5%;
    }
  }
}

.team-shield-image {
  width: 100px;
  object-fit: cover;

  @media (max-width: 1024px) {
    height: 60px;
    width: 60px;
  }
}

.team-shield-image-small {
  height: 60px;
  width: 60px;
  object-fit: cover;
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

:deep(.player-sticker-popover) {
  .p-popover {
    padding: 0;
    background: transparent;
    border: none;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  }
}

.clickable {
  cursor: pointer;
  text-decoration: dotted underline;
  text-underline-offset: 2px;
}
</style>
