<template>
  <div class="countdown-widget">
    <!-- Loading -->
    <div
      v-if="isLoading"
      class="loading-state"
    >
      <PrimeSkeleton class="skeleton-label" />
      <PrimeSkeleton class="skeleton-clock" />
      <PrimeSkeleton class="skeleton-row" />
      <PrimeSkeleton class="skeleton-row" />
    </div>

    <!-- No upcoming matches -->
    <div
      v-else-if="nextMatches.length === 0"
      class="empty-state"
    >
      <i class="pi pi-calendar-check" />
      <span>{{ t('home.nextMatchCountdown.noMatches') }}</span>
    </div>

    <template v-else>
      <!-- Label -->
      <p class="section-label">
        {{
          nextMatches.length > 1
            ? t('home.nextMatchCountdown.simultaneous', { count: nextMatches.length })
            : t('home.nextMatchCountdown.nextMatch')
        }}
      </p>

      <!-- Countdown clock — centrepiece -->
      <div class="clock-area">
        <div class="clock">
          <div class="clock-unit">
            <span class="clock-value">{{ pad(countdown.days) }}</span>
            <span class="clock-key">{{ t('home.nextMatchCountdown.days') }}</span>
          </div>
          <span class="clock-colon">:</span>
          <div class="clock-unit">
            <span class="clock-value">{{ pad(countdown.hours) }}</span>
            <span class="clock-key">{{ t('home.nextMatchCountdown.hours') }}</span>
          </div>
          <span class="clock-colon">:</span>
          <div class="clock-unit">
            <span class="clock-value">{{ pad(countdown.minutes) }}</span>
            <span class="clock-key">{{ t('home.nextMatchCountdown.minutes') }}</span>
          </div>
          <span class="clock-colon">:</span>
          <div class="clock-unit">
            <span class="clock-value">{{ pad(countdown.seconds) }}</span>
            <span class="clock-key">{{ t('home.nextMatchCountdown.seconds') }}</span>
          </div>
        </div>
      </div>

      <!-- Match rows -->
      <div class="match-rows">
        <div
          v-for="match in nextMatches"
          :key="match.id"
          class="match-row"
        >
          <!-- Teams: flag · abbrev · vs · abbrev · flag -->
          <div class="teams">
            <img
              class="flag"
              :src="`https://assets.omegafox.me/copa/countries_flags/${match.homeTeam.isoCode.toLowerCase()}.png`"
              :alt="match.homeTeam.name"
            />
            <span class="team-name">{{ match.homeTeam.abbreviation }}</span>
            <span class="vs">vs</span>
            <span class="team-name">{{ match.awayTeam.abbreviation }}</span>
            <img
              class="flag"
              :src="`https://assets.omegafox.me/copa/countries_flags/${match.awayTeam.isoCode.toLowerCase()}.png`"
              :alt="match.awayTeam.name"
            />
          </div>

          <!-- Bet badge inline -->
          <div
            v-if="activeProfile"
            class="bet-badge"
            :class="{ 'bet-badge--set': hasBet(match), 'bet-badge--missing': !hasBet(match) }"
          >
            <i :class="getBetStatusIcon(match)" />
            <span>{{ t(getBetStatusLabel(match)) }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
  <div style="flex: 0; width: 100%; padding-top: var(--s-spacing); text-align: center">
    <RouterLink
      to="/partidas"
      class="see-all-link"
    >
      {{ t('home.nextMatchCountdown.seeAll') }}
      <i class="pi pi-arrow-right" />
    </RouterLink>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { IMatch } from '@/stores/matches.types';

import { MATCH_STATUS } from '@/constants/match';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useClockStore } from '@/stores/clock';
import { useMatchesStore } from '@/stores/matches';

const { t } = useI18n();

const matchesStore = useMatchesStore();
const clockStore = useClockStore();
const activeProfileStore = useActiveProfileStore();

const activeProfile = computed(() => activeProfileStore.activeProfile);
const isLoading = computed(() => matchesStore.isLoading);

// All NOT_STARTED matches sorted by timestamp
const sortedNotStarted = computed(() =>
  matchesStore.matches
    .filter((m) => m.status === MATCH_STATUS.NOT_STARTED)
    .sort((a, b) => parseInt(a.timestamp, 10) - parseInt(b.timestamp, 10)),
);

// Timestamp of the soonest match
const nextTimestamp = computed(() => {
  if (sortedNotStarted.value.length === 0) return null;
  return parseInt(sortedNotStarted.value[0].timestamp, 10);
});

// All matches that share the same earliest timestamp
const nextMatches = computed<IMatch[]>(() => {
  if (nextTimestamp.value === null) return [];
  return sortedNotStarted.value.filter((m) => parseInt(m.timestamp, 10) === nextTimestamp.value);
});

// Countdown from now to the next match timestamp
const countdown = computed(() => {
  const now = clockStore.currentTimestamp;
  const diff = Math.max(0, (nextTimestamp.value ?? now) - now);
  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;
  return { days, hours, minutes, seconds };
});

function getBetStatusIcon(match: IMatch): string {
  return hasBet(match) ? 'pi pi-check-circle' : 'pi pi-exclamation-circle';
}

function getBetStatusLabel(match: IMatch): string {
  return hasBet(match) ? 'home.nextMatchCountdown.betSet' : 'home.nextMatchCountdown.betMissing';
}

function hasBet(match: IMatch): boolean {
  if (!match.loggedUserBets) return false;
  const bet = match.loggedUserBets;
  return bet !== null && bet.scoreHome !== null && bet.scoreAway !== null;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}
</script>

<style lang="scss" scoped>
.countdown-widget {
  display: flex;
  flex-direction: column;
  height: 100%;
}

// ---- Loading ----
.loading-state {
  display: flex;
  flex-direction: column;
  gap: var(--s-spacing);
}

.skeleton-label {
  max-width: 140px;
  height: 14px;
}

.skeleton-clock {
  height: 72px;
}

.skeleton-row {
  height: 44px;
}

// ---- Empty ----
.empty-state {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--s-spacing);
  align-items: center;
  justify-content: center;
  color: var(--bolao-c-grey2);

  .pi {
    font-size: var(--xl-spacing);
  }
}

// ---- Section label ----
.section-label {
  margin-bottom: var(--xs-spacing);
  font-size: var(--xxs-font-size);
  font-weight: 600;
  color: var(--bolao-c-grey2);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

// ---- Clock area — grows to fill remaining space ----
.clock-area {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
}

.clock {
  display: flex;
  gap: var(--s-spacing);
  align-items: flex-end;
}

.clock-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 52px;
}

.clock-value {
  font-size: 3rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  color: var(--p-text-color);
}

.clock-key {
  margin-top: 4px;
  font-size: var(--xxs-font-size);
  color: var(--bolao-c-grey2);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.clock-colon {
  padding-bottom: 18px;
  font-size: 2rem;
  font-weight: 300;
  line-height: 1;
  color: var(--bolao-c-grey2);
}

// ---- Match rows — pinned to bottom ----
.match-rows {
  display: flex;
  flex-direction: column;
  gap: var(--xs-spacing);
  margin-top: var(--m-spacing);
}

.match-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--xs-spacing) var(--s-spacing);
  background-color: rgb(255 255 255 / 4%);
  border: 1px solid var(--bolao-c-blue3);
  border-radius: var(--border-radius);
}

// ---- Teams ----
.teams {
  display: flex;
  gap: var(--xs-spacing);
  align-items: center;
}

.flag {
  width: 22px;
  height: 15px;
  object-fit: cover;
  border-radius: 2px;
}

.team-name {
  font-size: var(--xs-font-size);
  font-weight: 600;
  color: var(--p-text-color);
}

.vs {
  padding: 0 2px;
  font-size: var(--xxs-font-size);
  font-weight: 400;
  color: var(--bolao-c-grey2);
}

// ---- Bet badge ----
.bet-badge {
  display: flex;
  flex-shrink: 0;
  gap: 4px;
  align-items: center;
  padding: 2px var(--xs-spacing);
  font-size: var(--xs-font-size);
  font-weight: 600;
  border-radius: 999px;

  &--set {
    color: var(--bolao-c-mint);
    background-color: color-mix(in srgb, var(--bolao-c-mint) 12%, transparent);
  }

  &--missing {
    color: var(--p-red-400);
    background-color: color-mix(in srgb, var(--p-red-400) 12%, transparent);
  }
}
</style>
