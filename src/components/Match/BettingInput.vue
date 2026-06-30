<template>
  <span
    aria-atomic="true"
    aria-live="polite"
    class="sr-only"
    >{{ srScoreAnnouncement }}</span
  >
  <Transition
    name="score-switch"
    mode="out-in"
  >
    <div
      v-if="activeProfile && isMatchStarted && viewBetOption === 'viewBets'"
      class="score-and-bet"
    >
      <div
        class="score"
        :class="{ 'is-flipping': isScoreFlipping }"
        :style="{ flexDirection: isHomeTeam ? 'row' : 'row-reverse' }"
      >
        {{ isHomeTeam ? props.match.score.home : props.match.score.away }}
        <span
          v-if="isOnPenalties"
          class="penalties"
        >
          ({{ isHomeTeam ? props.match.score?.homePenalties : props.match.score?.awayPenalties }})
        </span>
      </div>
      <div
        v-if="props.match.loggedUserBets === null"
        class="bet"
      >
        x
      </div>
      <div
        v-else-if="!isDemo"
        class="bet"
        :class="{
          gold: hitLevel === HIT_LEVELS.exactScore,
          green: hitLevel === HIT_LEVELS.oneScore,
          blue: hitLevel === HIT_LEVELS.winnerOnly,
          red: hitLevel === HIT_LEVELS.miss,
          grey: hitLevel === null,
        }"
      >
        {{ isHomeTeam ? props.match.loggedUserBets?.scoreHome : props.match.loggedUserBets?.scoreAway }}
      </div>
    </div>
    <div
      v-else-if="!isMini"
      class="team-score"
      :style="{
        cursor: activeProfile ? 'default' : 'pointer',
      }"
      @click="handleScoreClick($event)"
    >
      <span
        v-if="!isMatchStarted"
        class="score-type-label"
      >
        {{ t('score.bet') }}
      </span>
      <input
        v-model="inputValue"
        name="score"
        type="number"
        min="0"
        max="99"
        class="score-input"
        :class="{
          'is-empty': isEmpty,
          'is-flipping': isScoreFlipping,
          'is-loading': isLoadingMatch,
          'has-invalid-changes': hasUnsavedChanges && !isBetValid,
          'has-valid-changes': hasUnsavedChanges && isBetValid,
        }"
        placeholder="_"
        :readonly="isMatchStarted || !activeProfile || isLoadingMatch"
        :style="{
          pointerEvents: activeProfile && !isMatchStarted ? 'auto' : 'none',
        }"
        @input="handleInput($event)"
        @keydown="handleKeydown($event)"
      />
      <div
        v-if="isLoadingMatch"
        class="loading-spinner-wrapper"
      >
        <i class="pi pi-spin pi-spinner" />
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import type { IMatch } from '@/stores/matches.types';

import { HIT_LEVELS, type THitLevel } from '@/constants/bets';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useClockStore } from '@/stores/clock';
import { useConfigurationStore } from '@/stores/configuration';
import { useMatchesStore } from '@/stores/matches';

const props = withDefaults(
  defineProps<{
    hitLevel?: null | THitLevel;
    isDemo?: boolean;
    isHomeTeam?: boolean;
    isMini?: boolean;
    match: IMatch;
  }>(),
  {
    hitLevel: null,
    isDemo: false,
    isHomeTeam: false,
    isMini: false,
  },
);

const emit = defineEmits<{
  loginRequired: [];
}>();

const clockStore = useClockStore();
const activeProfileStore = useActiveProfileStore();
const matchesStore = useMatchesStore();
const configurationStore = useConfigurationStore();
const { t } = useI18n();

// ------ Computed Properties ------
const isMatchStarted = computed(() => clockStore.currentTimestamp >= props.match.timestamp);
const isOnPenalties = computed(() => props.match.score.awayPenalties > 0 || props.match.score.homePenalties > 0);
const isLoadingMatch = computed(() => matchesStore.updatingMatches.includes(props.match.id));
const viewBetOption = computed(() => configurationStore.viewBetOption);

const isEmpty = computed(
  () =>
    !!activeProfileStore.activeProfile &&
    (!props.match.loggedUserBets ||
      props.match.loggedUserBets?.scoreAway === null ||
      props.match.loggedUserBets?.scoreHome === null),
);

const inputValue = computed({
  get() {
    if (isMatchStarted.value) {
      return props.isHomeTeam ? props.match.score.home : props.match.score.away;
    }
    const working = matchesStore.getWorkingBet(props.match.id);
    return props.isHomeTeam ? working.scoreHome : working.scoreAway;
  },
  set(value: null | number) {
    const working = matchesStore.getWorkingBet(props.match.id);
    matchesStore.updateWorkingBet(
      props.match.id,
      props.isHomeTeam ? value : working.scoreHome,
      !props.isHomeTeam ? value : working.scoreAway,
    );
  },
});

const hasUnsavedChanges = computed(() => matchesStore.hasWorkingBetChanged(props.match.id));

const isBetValid = computed(
  () =>
    hasUnsavedChanges.value &&
    matchesStore.getWorkingBet(props.match.id)?.scoreHome !== null &&
    matchesStore.getWorkingBet(props.match.id)?.scoreAway !== null,
);

const activeProfile = computed(() => activeProfileStore.activeProfile);

const displayScore = computed(() => (props.isHomeTeam ? props.match.score.home : props.match.score.away));
const isScoreFlipping = ref(false);
const srScoreAnnouncement = ref('');

watch(displayScore, (newVal) => {
  const teamName = props.isHomeTeam ? props.match.homeTeam.name : props.match.awayTeam.name;
  srScoreAnnouncement.value = teamName + ': ' + String(newVal);
  isScoreFlipping.value = true;
  setTimeout(() => {
    isScoreFlipping.value = false;
  }, 900);
});

// ------ Functions ------
function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  let value = target.value;

  // Remove any non-numeric characters (including dash)
  value = value.replace(/[^0-9]/g, '');

  // Limit to 2 digits
  if (value.length > 2) {
    value = value.slice(0, 2);
  }

  const numValue = value === '' ? null : parseInt(value, 10);

  target.value = value;
  inputValue.value = numValue;
}

function handleKeydown(event: KeyboardEvent) {
  const target = event.target as HTMLInputElement;

  // Handle Enter key to trigger save
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    matchesStore.requestSave();
    target.blur();
    return;
  }

  // Allow: backspace, delete, tab, escape, enter
  if ([8, 9, 13, 27, 46].includes(event.keyCode)) {
    return;
  }
  // Allow: Ctrl/Cmd+A, Ctrl/Cmd+C, Ctrl/Cmd+V, Ctrl/Cmd+X
  if ((event.ctrlKey || event.metaKey) && ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase())) {
    return;
  }
  // Allow: home, end, left, right, up, down
  if (event.keyCode >= 35 && event.keyCode <= 40) {
    return;
  }
  // Prevent: dash, minus, plus, e, E, dot
  if (['+', '-', '.', 'e', 'E'].includes(event.key)) {
    event.preventDefault();
    return;
  }

  // If we're typing a number and already have 2 digits (and nothing selected), prevent
  const currentValue = target.value || '';
  const hasSelection = (target.selectionStart || 0) !== (target.selectionEnd || 0);

  if (!hasSelection && currentValue.length >= 2 && event.key >= '0' && event.key <= '9') {
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
    emit('loginRequired');
    event.preventDefault();
  }
}
</script>

<style lang="scss" scoped>
.score-and-bet {
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: center;
  justify-content: space-between;
  min-width: 48px;
  height: 100%;
  padding: var(--xxs-spacing) 0;

  @media (width <= 768px) {
    min-width: 28px;
  }

  .score {
    display: flex;
    flex: 1;
    gap: var(--xs-spacing);
    align-items: center;
    justify-content: center;
    width: 100%;
    font-size: var(--m-font-size);
    line-height: 1;
    background-color: color-mix(in srgb, var(--color-main), transparent 50%);
    border: 1px solid color-mix(in srgb, var(--color-contrast), transparent 70%);
    border-radius: var(--border-radius);

    @media (width <= 768px) {
      gap: var(--xxs-spacing);
      font-size: var(--s-font-size);
    }
  }

  .bet {
    flex: 0;
    width: 100%;
    padding: var(--xxs-spacing) 0;
    font-size: var(--s-font-size);
    line-height: 1;
    color: var(--color-contrast);
    text-align: center;
    border-radius: var(--border-radius);

    @media (width <= 768px) {
      font-size: var(--xs-font-size);
      background-color: transparent !important;
      border-width: 2px;
      border-top: none !important;
    }
  }

  .penalties {
    font-size: var(--xs-font-size);
    font-weight: normal;

    @media (width <= 768px) {
      font-size: var(--xxs-font-size);
    }
  }
}

.team-score {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  height: 80%;
  font-size: var(--xl-font-size);
  color: var(--color-contrast);
  background-color: color-mix(in srgb, var(--color-main), transparent 50%);
  border-radius: var(--border-radius);

  @media (width <= 768px) {
    min-width: 28px;
    font-size: var(--m-font-size);
  }
}

.score-input {
  width: 100%;
  max-width: 48px;
  height: 100%;
  padding: var(--xs-spacing);
  font-size: var(--l-font-size);
  color: var(--color-contrast);
  text-align: center;
  appearance: textfield;
  outline: none;
  background: transparent;
  border: 1px solid color-mix(in srgb, var(--color-contrast), transparent 70%);
  border-radius: var(--border-radius);
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

  &.is-empty {
    background: color-mix(in srgb, var(--bolao-c-red), transparent 85%);
  }

  &.has-valid-changes {
    background: color-mix(in srgb, var(--bolao-c-mint), transparent 95%);
    border-color: var(--bolao-c-mint);
    box-shadow: 0 0 5px 3px color-mix(in srgb, var(--bolao-c-mint), transparent 10%);
  }

  &.has-invalid-changes {
    background: color-mix(in srgb, var(--bolao-c-orange), transparent 95%);
    border-color: var(--bolao-c-orange);
    box-shadow: 0 0 5px 3px color-mix(in srgb, var(--bolao-c-orange), transparent 10%);
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    margin: 0;
    appearance: none;
  }

  @media (width <= 768px) {
    max-width: 36px;
    min-height: 32px;
    padding: var(--xxs-spacing);
    font-size: var(--m-font-size);
  }

  @media (width <= 360px) {
    max-width: 28px;
    font-size: var(--s-font-size);
  }
}

.score-type-label {
  position: absolute;
  top: 0;
  left: 50%;
  z-index: 1;
  font-size: 7px;
  font-weight: 700;
  color: var(--color-contrast);
  text-transform: uppercase;
  letter-spacing: 0;
  white-space: nowrap;
  pointer-events: none;
  transform: translateX(-50%);
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

  @media (width <= 768px) {
    font-size: var(--s-font-size);
  }
}

.green {
  background-color: var(--bolao-c-green-t1);
  border: 1px solid var(--bolao-c-green);
  border-color: var(--bolao-c-green);
}

.blue {
  background-color: var(--bolao-c-blue-t1);
  border: 1px solid var(--bolao-c-blue);
  border-color: var(--bolao-c-blue);
}

.red {
  background-color: var(--bolao-c-red-t1);
  border: 1px solid var(--bolao-c-red);
  border-color: var(--bolao-c-red);
}

.grey {
  background-color: color-mix(in srgb, var(--color-main), transparent 90%);
  border: 1px solid color-mix(in srgb, var(--color-contrast), transparent 70%);
  border-color: var(--color-main);
}

.gold {
  background-color: var(--bolao-c-gold-t1);
  border: 1px solid var(--bolao-c-gold);
  border-color: var(--bolao-c-gold);
}

.score-switch-enter-active,
.score-switch-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.score-switch-enter-from,
.score-switch-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  white-space: nowrap;
  border: 0;
}

@media (prefers-reduced-motion: no-preference) {
  @keyframes score-pop {
    0% {
      transform: scale(1);
    }

    35% {
      transform: scale(1.4);
    }

    65% {
      transform: scale(0.88);
    }

    82% {
      transform: scale(1.08);
    }

    100% {
      transform: scale(1);
    }
  }

  .score.is-flipping,
  .score-input.is-flipping {
    animation: score-pop 0.85s ease-out;
  }
}
</style>
