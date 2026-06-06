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
      <CountdownComponent
        :countdown-to="nextTimestamp ?? 0"
        :title="nextMatches.length > 1 ? 'home.nextMatchCountdown.simultaneous' : 'home.nextMatchCountdown.nextMatch'"
        :colorful="true"
      />
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
            <span class="team-name">{{
              locale === 'pt-BR' ? match.homeTeam.abbreviation : match.homeTeam.abbreviationEn
            }}</span>
            <span class="vs">vs</span>
            <span class="team-name">{{
              locale === 'pt-BR' ? match.awayTeam.abbreviation : match.awayTeam.abbreviationEn
            }}</span>
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

import CountdownComponent from '@/components/CountdownComponent.vue';
import { MATCH_STATUS } from '@/constants/match';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useMatchesStore } from '@/stores/matches';

// ------ Initialization ------
const { locale, t } = useI18n();

// ------ Services & Stores ------
const matchesStore = useMatchesStore();
const activeProfileStore = useActiveProfileStore();

// ------ Computed Properties ------
const activeProfile = computed(() => activeProfileStore.activeProfile);
const isLoading = computed(() => matchesStore.isLoading);

// All NOT_STARTED matches sorted by timestamp
const sortedNotStarted = computed(() =>
  matchesStore.nextMatches
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

// ------ Functions ------

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
  color: var(--bolao-c-grey2);
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
