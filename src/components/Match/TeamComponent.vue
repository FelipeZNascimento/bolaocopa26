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
        class="team-alias clickable"
        @click="openTeamModal(team)"
        :style="{ textAlign: isHomeTeam ? 'right' : 'left' }"
      >
        {{ team.name }}
      </div>
      <div
        class="team-score"
        :style="{
          cursor: activeProfile ? 'default' : 'pointer',
        }"
        @click="handleScoreClick($event)"
      >
        <input
          type="number"
          min="0"
          max="99"
          class="score-input"
          :class="{ 'is-loading': isLoadingMatch }"
          placeholder="_"
          :disabled="isMatchStarted || !activeProfile"
          :readonly="isLoadingMatch"
          v-model="localInputValue"
          :style="{
            fontWeight: isWinning ? 'bold' : 'normal',
            textAlign: isOnPenalties && !isMobile ? 'left' : 'center',
            pointerEvents: activeProfile && !isMatchStarted ? 'auto' : 'none',
          }"
          @input="handleInput($event)"
          @focus="handleFocus"
          @blur="handleBlur"
          @keydown="handleKeydown($event)"
        />
        <div class="loading-spinner-wrapper" v-if="isLoadingMatch && !isOnPenalties">
          <i class="pi pi-spin pi-spinner" />
        </div>
        <div
          v-if="isOnPenalties && !isMobile"
          class="penalties-outer"
          :style="{
            fontWeight: isWinning ? 'bold' : 'normal',
          }"
        >
          <p class="score">
            {{ isHomeTeam ? score?.homePenalties : score?.awayPenalties }}
          </p>
          <!-- <p class="label" v-if="!isMobile">pen</p> -->
        </div>
      </div>
    </div>
    <div v-if="showEvents && events.length > 0" class="events-container" :style="{ alignItems: isHomeTeam ? 'flex-start' : 'flex-end' }">
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
            style=" width: 20px;height: 20px"
            :src="getEventIconUrl(event.event.id, isHomeTeam)"
            :alt="event.event.description"
          />
          <span>{{ event.event.gametime }}</span>
        </div>
        <HoverablePlayerName v-if="event.player" :player="event.player" :text-align="isHomeTeam ? 'right' : 'left'" />
      </div>
    </div>
  </div>

  <!-- Modals -->
  <TeamDetailsModal :is-open="isTeamModalOpen" :team="selectedTeam" :handle-close-modal="closeTeamModal" />
  <LoginModal
    :is-open="isLoginModalOpen"
    :handle-close-modal="handleCloseLoginModal"
  />

</template>
<script lang="ts" setup>
import { computed, ref, watch } from "vue";

import type { IMatch, IMatchEvent } from "@/stores/matches.types";
import type { ITeam } from "@/stores/teams.types";

import LoginModal from "@/components/NavbarTop/LoginModal.vue";
import TeamDetailsModal from "@/components/TeamDetailsModal.vue";
import { MATCH_EVENT, PENALTIES } from "@/constants/match";
import BetService from '@/services/bet';
import { useViewport } from "@/services/viewport";
import { useActiveProfileStore } from "@/stores/activeProfile";
import { useClockStore } from "@/stores/clock";
import { useMatchesStore } from "@/stores/matches";
import { useNotificationStore } from "@/stores/notification";

import HoverablePlayerName from "../HoverablePlayerName.vue";

const props = withDefaults(
  defineProps<{
    events: IMatchEvent[];
    isAlias?: boolean;
    isHomeTeam?: boolean;
    isNameless?: boolean;
    isWinning?: boolean;
    match: IMatch;
    showEvents?: boolean;
  }>(),
  {
    isAlias: false,
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
const lastValidValue = ref("");
const isLoginModalOpen = ref(false);
const localInputValue = ref<number | string>("");
const isInputFocused = ref(false);

// ------ Initialization ------
const clockStore = useClockStore();
const { isMobile } = useViewport();
const betService = new BetService();
const activeProfileStore = useActiveProfileStore();
const matchesStore = useMatchesStore();
const notificationStore = useNotificationStore();

// ------ Computed Properties ------
const isLoadingMatch = computed(() => matchesStore.updatingMatches.includes(props.match.id));
const activeProfile = computed(() => activeProfileStore.activeProfile);
const isMatchStarted = computed(() => {
  return clockStore.currentTimestamp >= timestamp;
});

const isOnPenalties = computed(() => {
  return PENALTIES.includes(status);
});

const { awayTeam, homeTeam, score, status, timestamp } = props.match;
const team = props.isHomeTeam ? props.match.homeTeam : props.match.awayTeam;

// Sync local input value with props when they change
// Only update if we're not currently focused on this input (to avoid overwriting user input)
watch(
  () => {
    if (isMatchStarted.value) {
      // Match has started - show actual score
      return props.isHomeTeam ? props.match.score.home : props.match.score.away;
    } else {
      // Match hasn't started - show bet
      return props.isHomeTeam ? props.match.loggedUserBets?.scoreHome : props.match.loggedUserBets?.scoreAway;
    }
  },
  (value) => {
    if (!isInputFocused.value) {
      // Convert null/undefined to empty string, keep numbers (including 0)
      localInputValue.value = (value !== null && value !== undefined) ? value : "";
    }
  },
  { immediate: true },
);

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

function handleBlur() {
  isInputFocused.value = false;

  // Helper to convert input value to number or null
  const parseScore = (value: number | string): null | number => {
    if (value === "" || value === null || value === undefined) {
      return null;
    }
    if (typeof value === "number") {
      return value;
    }
    const parsed = Number(value);
    return isNaN(parsed) ? null : parsed;
  };

  // Get the current input value for this team
  const currentScore = parseScore(localInputValue.value);

  // Get the existing bet from the store
  const existingHomeScore = props.match.loggedUserBets?.scoreHome ?? null;
  const existingAwayScore = props.match.loggedUserBets?.scoreAway ?? null;

  // Build the new bet object
  const newHomeScore = props.isHomeTeam ? currentScore : existingHomeScore;
  const newAwayScore = props.isHomeTeam ? existingAwayScore : currentScore;

  // Only call API if this team's score has changed
  const hasChanged = props.isHomeTeam
    ? newHomeScore !== existingHomeScore
    : newAwayScore !== existingAwayScore;

  if (!hasChanged) {
    return; // No change, don't call API
  }

  betService.placeBet(
    {
      awayScore: newAwayScore,
      homeScore: newHomeScore,
      matchId: props.match.id,
    },
    (isSuccess, error) => {
      if (isSuccess) {
        const homeDisplay = newHomeScore !== null ? newHomeScore : '_';
        const awayDisplay = newAwayScore !== null ? newAwayScore : '_';

        notificationStore.success(`Partida atualizada com sucesso`, `${homeTeam.abbreviation} ${homeDisplay} x ${awayDisplay} ${awayTeam.abbreviation}`);
        matchesStore.updateLoggedUserBets(props.match.id, {
          scoreAway: newAwayScore,
          scoreHome: newHomeScore,
        });
      } else {
        console.error('Failed to place bet:', error);
        notificationStore.error(`Falha ao atualizar a partida`, `${homeTeam.abbreviation} x ${awayTeam.abbreviation}`);
        // Revert to store value on error
        const revertValue = props.isHomeTeam ? existingHomeScore : existingAwayScore;
        localInputValue.value = revertValue !== null ? revertValue : "";
      }
    },
  );
}

function handleCloseLoginModal() {
  isLoginModalOpen.value = false;
}

function handleFocus() {
  isInputFocused.value = true;
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  let value = target.value;

  // Remove any non-numeric characters (including dash)
  value = value.replace(/[^0-9]/g, "");

  let numValue: null | number;

  // If empty, set to null (user is clearing the bet)
  if (value === "") {
    localInputValue.value = "";
    lastValidValue.value = "";
    numValue = null;
  } else {
    numValue = parseInt(value, 10);

    // If invalid or exceeds limits, restore last valid value
    if (isNaN(numValue) || numValue > 99 || numValue < 0) {
      localInputValue.value = lastValidValue.value;
      return;
    }

    // Valid input, update local state
    localInputValue.value = numValue;
    lastValidValue.value = value;
  }
}

function handleKeydown(event: KeyboardEvent) {
  // Allow: backspace, delete, tab, escape, enter
  if ([8, 9, 13, 27, 46].includes(event.keyCode)) {
    return;
  }
  // Allow: Ctrl/Cmd+A, Ctrl/Cmd+C, Ctrl/Cmd+V, Ctrl/Cmd+X
  if ((event.ctrlKey || event.metaKey) && ["a", "c", "v", "x"].includes(event.key.toLowerCase())) {
    return;
  }
  // Allow: home, end, left, right, up, down
  if (event.keyCode >= 35 && event.keyCode <= 40) {
    return;
  }
  // Prevent: dash, minus, plus, e, E, and any non-numeric characters
  if (event.key === "-" || event.key === "+" || event.key === "e" || event.key === "E" || event.key === ".") {
    event.preventDefault();
    return;
  }
  // Ensure it's a number
  if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
    event.preventDefault();
  }
}

function handleScoreClick(event: Event) {
  if (!activeProfile.value && !isMatchStarted.value) {
    isLoginModalOpen.value = true;
    event.preventDefault();
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

  @media (width <=768px) {
    height: var(--match-list-height-mobile);
  }

}

.overlay {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 22px;
  background-color: color-mix(in srgb,
  var(--color-match-overlay) 20%,
  transparent);
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

    @media (width <=1024px) {
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

  @media (width <=768px) {
    width: 32px;
    margin: 0 var(--xs-spacing);
    object-fit: contain;
  }

  @media (width <=360px) {
    width: 22px;
    margin: 0 var(--xs-spacing);
    object-fit: contain;
  }
}

.team-alias {
  position: relative;
  z-index: 99;
  padding: var(--l-spacing);
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: var(--m-font-size);
  line-height: var(--xl-spacing);

  @media (width <768px) {
    max-width: 50%;
    padding: var(--xs-spacing);
    font-size: var(--xs-font-size);
    line-height: var(--l-spacing);
  }

  @media (width <=360px) {
    max-width: 60%;
    padding: var(--xs-spacing);
    font-size: var(--xs-font-size);
    line-height: var(--l-spacing);
  }
}

.team-score {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  height: 80%;

  // padding: 0 var(--m-spacing);
  font-size: var(--xl-font-size);
  color: var(--color-contrast);
  background-color: color-mix(in srgb, var(--color-main), transparent 50%);
  border-radius: var(--border-radius);

  @media (width <=768px) {
    min-width: 28px;
    font-size: var(--m-font-size);
  }
}

.score-input {
  width: 100%;
  max-width: 48px;
  height: 100%;
  padding: var(--xs-spacing);
  font-size: var(--xl-font-size);
  color: var(--color-contrast);
  text-align: left;
  appearance: textfield;
  outline: none;
  background: transparent;
  border: 1px solid color-mix(in srgb, var(--color-contrast), transparent 70%);
  border-radius: calc(var(--border-radius) / 2);
  transition: all 0.2s ease;

  &:focus {
    border-color: var(--color-contrast);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-contrast), transparent 80%);
  }

  &.is-loading {
    color: var(--bolao-c-grey4);
    text-shadow: 0 0 0 var(--color-contrast);
    opacity: 0.7;
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    margin: 0;
    appearance: none;
  }

  @media (width <=768px) {
    max-width: 36px;
    min-height: 32px;

    /* Better touch target on mobile */
    padding: var(--xxs-spacing);
    font-size: var(--m-font-size);
  }

  @media (width <=360px) {
    max-width: 28px;
    font-size: var(--s-font-size);
  }

}

.loading-spinner-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--m-font-size);
  color: var(--color-contrast);
  pointer-events: none;
  transform: translate(-50%, -50%);

  @media (width <=768px) {
    font-size: var(--s-font-size);
  }
}

.penalties-outer {
  position: absolute;
  top:0;
  right: var(--xs-spacing);
  height: 100%;
  text-align: center;

  .score {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    height: 100%;
    font-size: var(--l-font-size);

    // font-weight: bold;
    color: var(--bolao-c-red-l3);

    @media (width <=768px){
      height: 100%;

      // padding: var(--xxs-spacing);
      font-size: var(--s-font-size);
    }

  }

  .label {
    height: 40%;
    font-size: var(--xxs-font-size);
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
    padding: var(--xxs-spacing) 0;
    border-bottom: 1px dotted var(--bolao-c-grey3-t1);

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
