<template>
  <div class="play-by-play-outer">
    <div
      v-if="!FINISHED_GAME.includes(match.status)"
      class="refresh-indicator"
    >
      <p class="refresh-label">
        <PrimeButton
          size="small"
          variant="outlined"
          :disabled="isLoadingEvents"
          @click="void fetchPlayByPlayEvents()"
        >
          <i class="pi pi-refresh" />
          {{ t('matches.playByPlay.refresh', { countdown: secondsUntilNextFetch }) }}
        </PrimeButton>
      </p>
    </div>

    <div
      v-for="event in playByPlayEvents.slice().reverse()"
      :key="event.EventId"
      class="event-line"
      :style="{
        flexDirection: parseInt(event.IdTeam, 10) !== match.homeTeam.idFifa ? 'row-reverse' : 'row',
        alignItems: 'center',
        justifyContent: event.IdPlayer ? 'unset' : 'center',
      }"
    >
      <div v-if="event.IdPlayer">
        <img
          v-if="getPlayer(event.IdPlayer) && !imageError"
          class="event-player"
          :src="`https://digitalhub.fifa.com/transform/${getPlayer(event.IdPlayer)?.fifa.pictureId.toLowerCase()}/?&io=transform:fill,aspectratio:5x4,width:640,gravity:top&quality=100`"
          :alt="getPlayer(event.IdPlayer)?.name"
          :style="{
            left: parseInt(event.IdTeam, 10) === match.homeTeam.idFifa ? '-40px' : 'unset',
            right: parseInt(event.IdTeam, 10) !== match.homeTeam.idFifa ? '-40px' : 'unset',
          }"
          @load="isLoadingImage = false"
          @error="handleImageError"
        />
      </div>
      <div
        class="outer-text"
        :class="{
          left: event.IdPlayer && parseInt(event.IdTeam, 10) === match.homeTeam.idFifa,
          right: event.IdPlayer && parseInt(event.IdTeam, 10) !== match.homeTeam.idFifa,
        }"
      >
        <p
          v-for="value in event.TypeLocalized"
          :key="value.Description"
          class="event-title"
        >
          {{ event.MatchMinute }} | {{ value.Description }}
        </p>
        <p
          v-for="value in event.EventDescription"
          :key="value.Description"
          class="event-description"
        >
          {{ value.Description }}
        </p>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type { IMatch } from '@/stores/matches.types';

import { FINISHED_GAME } from '@/constants/match';
import MatchService from '@/services/match';
import { useMatchesStore } from '@/stores/matches';
import { useTeamsStore } from '@/stores/teams';

const props = defineProps<{
  match: IMatch;
}>();

const matchesStore = useMatchesStore();
const teamsStore = useTeamsStore();
const matchService = new MatchService();
const { t } = useI18n();

// ------ Refs ------

const isLoadingEvents = ref(false);
const isLoadingImage = ref(true);
const imageError = ref(false);
const elapsedMs = ref(0);
const FETCH_INTERVAL_MS = 30_000;

let refreshTimer: number | undefined;
let progressTimer: number | undefined;

// ------ Computed ------

const playByPlayEvents = computed(() => matchesStore.playByPlay);
const secondsUntilNextFetch = computed(() => Math.max(0, Math.ceil((FETCH_INTERVAL_MS - elapsedMs.value) / 1000)));

// ------ Functions ------

async function fetchPlayByPlayEvents() {
  if (isLoadingEvents.value) {
    return;
  }

  isLoadingEvents.value = true;
  resetRefreshProgress();

  try {
    await matchService.fetchPlayByPlay(props.match.idFifa);
  } finally {
    isLoadingEvents.value = false;
  }
}

function getPlayer(fifaId: string) {
  const player = teamsStore.players.find((p) => p.fifa.id === parseInt(fifaId, 10));
  return player ?? null;
}

function handleImageError() {
  isLoadingImage.value = false;
  imageError.value = true;
}

function resetRefreshProgress() {
  elapsedMs.value = 0;
}

function startRefreshTimer() {
  if (refreshTimer) {
    window.clearInterval(refreshTimer);
  }

  if (progressTimer) {
    window.clearInterval(progressTimer);
  }

  refreshTimer = window.setInterval(() => {
    void fetchPlayByPlayEvents();
  }, FETCH_INTERVAL_MS);

  progressTimer = window.setInterval(() => {
    elapsedMs.value = Math.min(FETCH_INTERVAL_MS, elapsedMs.value + 1000);
  }, 1000);
}

onMounted(() => {
  void fetchPlayByPlayEvents();
  if (FINISHED_GAME.includes(props.match.status)) {
    return;
  }

  startRefreshTimer();
});

onUnmounted(() => {
  if (refreshTimer) {
    window.clearInterval(refreshTimer);
  }

  if (progressTimer) {
    window.clearInterval(progressTimer);
  }
});
</script>
<style lang="scss" scoped>
.play-by-play-outer {
  display: flex;
  flex-direction: column;
  gap: var(--m-spacing);
  width: 100%;
  min-height: fit-content;
  padding: 0 var(--l-spacing);
  overflow: hidden;

  @media (width <= 768px) {
    gap: var(--s-spacing);
    padding: var(--xs-spacing);
  }
}

.refresh-indicator {
  display: flex;
  flex-direction: row;
  gap: var(--xs-spacing);
  align-items: center;
  justify-content: center;
}

.refresh-label {
  flex: 1;
  min-width: 140px;
  margin: 0;
  font-size: var(--xs-font-size);
  text-align: center;
}

.event-line {
  position: relative;
  display: flex;
  gap: var(--s-spacing);
  padding: var(--xl-spacing);
  background-color: color-mix(in srgb, var(--color-contrast), transparent 90%);
  border-radius: var(--border-radius);
}

.event-player {
  position: absolute;
  bottom: 0;
  max-height: 120px;
}

.outer-text {
  width: 100%;
  padding: 0 80px;

  &.left {
    @media (width <= 768px) {
      padding: 0 0 0 60px;
    }
  }

  &.right {
    @media (width <= 768px) {
      padding: 0 60px 0 0;
    }
  }
}

.event-title {
  font-size: var(--m-font-size);
  font-weight: bold;
  text-align: center;

  @media (width <= 768px) {
    font-size: var(--s-font-size);
  }
}

.event-description {
  font-size: var(--s-font-size);
  text-align: center;

  @media (width <= 768px) {
    font-size: var(--xs-font-size);
  }
}
</style>
