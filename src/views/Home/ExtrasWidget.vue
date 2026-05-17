<template>
  <div class="extras-widget">
    <!-- Countdown to edition start -->
    <div
      v-if="countdown"
      class="countdown-section"
    >
      <p class="countdown-label">{{ t('home.extras.countdownLabel') }}</p>
      <div class="countdown-grid">
        <div class="countdown-unit">
          <span class="countdown-value">{{ pad(countdown.days) }}</span>
          <span class="countdown-key">{{ t('home.extras.days') }}</span>
        </div>
        <span class="countdown-colon">:</span>
        <div class="countdown-unit">
          <span class="countdown-value">{{ pad(countdown.hours) }}</span>
          <span class="countdown-key">{{ t('home.extras.hours') }}</span>
        </div>
        <span class="countdown-colon">:</span>
        <div class="countdown-unit">
          <span class="countdown-value">{{ pad(countdown.minutes) }}</span>
          <span class="countdown-key">{{ t('home.extras.minutes') }}</span>
        </div>
        <span class="countdown-colon">:</span>
        <div class="countdown-unit">
          <span class="countdown-value">{{ pad(countdown.seconds) }}</span>
          <span class="countdown-key">{{ t('home.extras.seconds') }}</span>
        </div>
      </div>
    </div>
    <PrimeDivider
      v-if="countdown && activeProfile"
      class="divider"
    />
    <!-- User's extra bets summary -->
    <div
      v-if="activeProfile"
      class="bets-section"
    >
      <div
        v-if="betsByType.size === 0"
        class="no-bets"
      >
        <i class="pi pi-exclamation-circle" />
        <span>{{ t('home.extras.noBets') }}</span>
      </div>
      <div
        v-else
        class="bets-list"
      >
        <div
          v-for="[type] in extraBetEntries"
          :key="type"
          class="bet-row"
        >
          <span class="bet-label">{{ t(EXTRA_BETS_LABELS[type]) }}</span>
          <div
            v-if="betsByType.get(type)"
            class="bet-value"
          >
            <img
              v-if="betsByType.get(type)!.team"
              class="bet-flag"
              :src="`https://assets.omegafox.me/copa/countries_flags/${betsByType.get(type)!.team.isoCode.toLowerCase()}.png`"
              :alt="betsByType.get(type)!.team.name"
            />
            <span>
              {{
                betsByType.get(type)!.player
                  ? betsByType.get(type)!.player.name
                  : getTeamName(betsByType.get(type)!.team!)
              }}
            </span>
          </div>
          <span
            v-else
            class="bet-empty"
            >—</span
          >
        </div>
      </div>
    </div>
    <div
      v-else
      class="no-bets"
    >
      <i class="pi pi-lock" />
      <span>{{ t('home.extras.loginPrompt') }}</span>
    </div>
    <RouterLink
      to="/extras"
      class="see-all-link"
    >
      {{ t('home.extras.seeAll') }}
      <i class="pi pi-arrow-right" />
    </RouterLink>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';

import type { ITeam } from '@/stores/teams.types';

import { EXTRA_BETS_LABELS, EXTRA_BETS_VALUES } from '@/constants/bets';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useClockStore } from '@/stores/clock';
import { useConfigurationStore } from '@/stores/configuration';
import { useExtraBetStore } from '@/stores/extraBet';

const activeProfileStore = useActiveProfileStore();
const clockStore = useClockStore();
const configurationStore = useConfigurationStore();
const extraBetStore = useExtraBetStore();
const { locale, t } = useI18n();

const activeProfile = computed(() => activeProfileStore.activeProfile);

// Countdown to edition start
const secondsLeft = computed(() => {
  if (!configurationStore.editionStart) return null;
  const diff = configurationStore.editionStart - clockStore.currentTimestamp;
  return diff > 0 ? diff : null;
});

const countdown = computed(() => {
  if (!secondsLeft.value) return null;
  const s = secondsLeft.value;
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
});

// Bets map by type
const betsByType = computed(() => {
  const map = new Map(extraBetStore.activeProfileBets.map((bet) => [bet.extraType, bet]));
  return map;
});

function getTeamName(team: ITeam): string {
  return locale.value === 'pt-BR' ? team.name : team.nameEn;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

// Ordered extra bet entries for display
const extraBetEntries = Object.entries(EXTRA_BETS_VALUES).map(
  ([, value]) => [value, t(EXTRA_BETS_LABELS[value])] as const,
);
</script>

<style lang="scss" scoped>
.extras-widget {
  display: flex;
  flex-direction: column;
  gap: var(--m-spacing);
}

/* Countdown */
.countdown-section {
  display: flex;
  flex-direction: column;
  gap: var(--s-spacing);
  align-items: center;
}

.countdown-label {
  font-size: var(--xs-font-size);
  font-weight: 600;
  color: var(--bolao-c-grey3);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.countdown-grid {
  display: flex;
  gap: var(--xs-spacing);
  align-items: center;
}

.countdown-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 36px;
}

.countdown-value {
  font-size: var(--m2-font-size);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  color: var(--bolao-c-gold);
}

.countdown-key {
  margin-top: 2px;
  font-size: var(--xs-font-size);
  color: var(--bolao-c-grey4);
}

.countdown-colon {
  margin-bottom: 10px;
  font-size: var(--m-font-size);
  font-weight: 700;
  color: var(--bolao-c-grey3);
}

/* Bets */
.bets-section {
  display: flex;
  flex-direction: column;
}

.bets-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.bet-row {
  display: flex;
  gap: var(--s-spacing);
  align-items: center;
  justify-content: space-between;
  padding: 4px var(--xs-spacing);
  border-radius: 6px;
  transition: background-color 0.1s ease;

  &:hover {
    background-color: var(--bolao-c-blue3-t1);
  }
}

.bet-label {
  font-size: var(--xs-font-size);
  font-weight: 500;
  color: var(--bolao-c-grey3);
  white-space: nowrap;
}

.bet-value {
  display: flex;
  gap: 4px;
  align-items: center;
  font-size: var(--xs-font-size);
  font-weight: 600;
  color: var(--bolao-c-grey1);
}

.bet-flag {
  width: 18px;
  height: auto;
  border-radius: 2px;
}

.bet-empty {
  font-size: var(--s-font-size);
  color: var(--bolao-c-grey4);
}

.no-bets {
  display: flex;
  flex-direction: column;
  gap: var(--xs-spacing);
  align-items: center;
  justify-content: center;
  padding: var(--m-spacing);
  font-size: var(--xs-font-size);
  color: var(--bolao-c-grey3);
  text-align: center;
}

.divider {
  margin: 0;
}

.see-all-link {
  display: flex;
  gap: var(--xs-spacing);
  align-items: center;
  justify-content: center;
  padding: var(--xs-spacing);
  font-size: var(--s-font-size);
  color: var(--bolao-c-blue1);
  border-radius: 6px;
  transition: color 0.15s ease;

  &:hover {
    color: var(--bolao-c-sky);
    text-decoration: none;
  }
}
</style>
