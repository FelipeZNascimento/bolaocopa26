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
          class="team-shield-image"
          :src="`https://assets.omegafox.me/copa/countries_flags/${team.isoCode.toLowerCase()}.png`"
          :alt="`${team.name} Shield`"
        />
      </div>
      <div
        v-if="!isNameless"
        class="team-alias"
        :class="{ clickable: isClickable }"
        @click="isClickable && openTeamModal(team)"
        :style="{ textAlign: isHomeTeam ? 'right' : 'left' }"
      >
        {{ isAlias ? team.abbreviation : team.name }}
      </div>
      <div
        class="team-score"
        :style="{
          fontWeight: isWinning ? 'bold' : 'normal',
        }"
      >
        {{ isHomeTeam ? score?.home : score?.away }}
      </div>
    </div>
    <div
      v-if="showEvents"
      class="events-container"
      :style="{ alignItems: isHomeTeam ? 'flex-start' : 'flex-end' }"
    >
      <div
        v-for="event in events"
        :key="event.id"
        style="
          display: flex;
          align-items: center;
          width: 100%;
          min-height: 40px;
          padding: var(--xxs-spacing) 0;
          border-bottom: 1px dotted var(--bolao-c-grey3-t1);
        "
        :style="{
          flexDirection: isHomeTeam ? 'row' : 'row-reverse',
          visibility: event.player.team.id === team.id ? 'visible' : 'hidden',
        }"
      >
        <div
          style="
            display: flex;
            flex-direction: column;
            gap: 0;
            align-items: center;
            justify-content: center;
            width: 60px;
            min-width: 60px;
            font-size: var(--xs-font-size);
            line-height: 1;
          "
        >
          <img
            style=" width: 20px;height: 20px"
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

  <!-- Team Details Modal -->
  <TeamDetailsModal
    :is-open="isTeamModalOpen"
    :team="selectedTeam"
    :handle-close-modal="closeTeamModal"
  />
</template>
<script lang="ts" setup>
import { ref } from "vue";

import type { IMatchEvent, IScore } from "@/stores/matches.types";
import type { ITeam } from "@/stores/teams.types";

import TeamDetailsModal from "@/components/TeamDetailsModal.vue";
import { MATCH_EVENT, type TMatchStatus } from "@/constants/match";

import HoverablePlayerName from "../HoverablePlayerName.vue";

withDefaults(
  defineProps<{
    events: IMatchEvent[];
    isAlias?: boolean;
    isClickable?: boolean;
    isHomeTeam?: boolean;
    isNameless?: boolean;
    isWinning?: boolean;
    matchStatus: TMatchStatus;
    score?: IScore | null;
    showEvents?: boolean;
    team: ITeam;
  }>(),
  {
    isAlias: false,
    isClickable: false,
    isHomeTeam: false,
    isNameless: false,
    isWinning: false,
    score: null,
    showEvents: false,
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
        ? "https://assets.omegafox.me/copa/icons/goal.png"
        : "https://assets.omegafox.me/copa/icons/goal_a.png";
    }
    case MATCH_EVENT.OWN_GOAL: {
      return isHome
        ? "https://assets.omegafox.me/copa/icons/own_goal.png"
        : "https://assets.omegafox.me/copa/icons/own_goal_a.png";
    }
    case MATCH_EVENT.PENALTY_GOAL: {
      return isHome
        ? "https://assets.omegafox.me/copa/icons/penalty_goal.png"
        : "https://assets.omegafox.me/copa/icons/penalty_goal_a.png";
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
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  height: var(--match-list-height);
  padding: 0 var(--xs-spacing);
  overflow: hidden;
  color: var(--color-contrast);
  background-color: var(--bolao-c-white-t1);
  border-radius: var(--border-radius);
}

.overlay {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 22px;
  background-color: color-mix(
    in srgb,
    var(--color-match-overlay) 40%,
    transparent
  );
}

.outer-team-nameless {
  min-width: 60px;
}

.team-shield {
  &--line {
    position: absolute;
    top: 50%;
    max-width: 90px;
    height: 100%;
    transform: translate(0, -50%);

    @media (width <= 1024px) {
      top: 0%;
      transform: none;
    }
  }

  &--left {
    left: 0;
    display: flex;
    justify-content: flex-end;
  }

  &--right {
    right: 0;
    display: flex;
    justify-content: flex-start;
  }
}

.team-shield-image {
  width: 100px;
  object-fit: cover;

  @media (width <= 768px) {
    width: 36px;
    margin: 0 var(--s-spacing);
    object-fit: contain;
  }
}

.team-alias {
  position: relative;

  // font-weight: bold;
  z-index: 99;
  padding: var(--s-spacing);
  font-size: var(--m-font-size);
  line-height: var(--xl-spacing);

  @media (width <= 1444px) {
    font-size: var(--m-font-size);
  }

  @media (width <= 1024px) {
    font-size: var(--m-font-size);
  }

  @media (width <= 768px) {
    max-width: 60%;
    padding: var(--xs-spacing);
    font-size: var(--s-font-size);
  }

  @media (width <= 360px) {
    max-width: 60%;
    padding: var(--xs-spacing);
    font-size: var(--xs-font-size);
  }
}

.team-score {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  height: 80%;
  padding: 0 var(--m-spacing);
  font-size: var(--xl-font-size);
  color: var(--color-contrast);
  background-color: color-mix(in srgb, var(--color-main), transparent 50%);
  border-radius: var(--border-radius);

  @media (width <= 768px) {
    min-width: 28px;
    padding: 0 var(--xs-spacing);
    font-size: var(--m-font-size);
  }
}

.events-container {
  display: flex;
  flex-direction: column;
  padding-top: var(--m-spacing);
}

:deep(.player-sticker-popover) {
  .p-popover {
    padding: 0;
    background: transparent;
    border: none;
    box-shadow: 0 10px 40px rgb(0 0 0 / 50%);
  }
}

.clickable {
  text-decoration: dotted underline;
  text-underline-offset: 2px;
  cursor: pointer;
}
</style>
