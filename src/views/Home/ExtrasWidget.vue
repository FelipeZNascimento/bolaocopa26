<template>
  <div class="extras-widget">
    <!-- Countdown to edition start -->
    <CountdownComponent
      v-if="showCountdown"
      :countdown-to="configurationStore.editionStart ?? 0"
      title="home.extras.countdownLabel"
    />

    <PrimeDivider
      v-if="showCountdown && activeProfile"
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

import CountdownComponent from '@/components/CountdownComponent.vue';
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

const showCountdown = computed(() => {
  return secondsLeft.value !== null;
});

// Bets map by type
const betsByType = computed(() => {
  const map = new Map(extraBetStore.activeProfileBets.map((bet) => [bet.extraType, bet]));
  return map;
});

function getTeamName(team: ITeam): string {
  return locale.value === 'pt-BR' ? team.name : team.nameEn;
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
  font-size: var(--s-font-size);
  font-weight: 500;
  color: var(--bolao-c-grey3);
  white-space: nowrap;

  @media (width <= 768px) {
    font-size: var(--xs-font-size);
  }
}

.bet-value {
  display: flex;
  gap: 4px;
  align-items: center;
  font-size: var(--s-font-size);
  font-weight: 600;
  color: var(--bolao-c-grey1);

  @media (width <= 768px) {
    font-size: var(--xs-font-size);
  }
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
