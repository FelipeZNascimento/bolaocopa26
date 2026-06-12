<template>
  <div class="events-line-outer">
    <div class="full-line separator">
      {{ t('matches.start') }}
    </div>
    <div
      v-for="(event, index) in sortedEvents"
      :key="event.id"
    >
      <div
        v-if="
          parseGametime(event.gametime) >= 46 &&
          (index === 0 || (index > 0 && parseGametime(sortedEvents[index - 1].gametime) < 46))
        "
        class="full-line separator"
      >
        {{ t('matches.secondHalf') }}
      </div>
      <div
        v-if="
          parseGametime(event.gametime) >= 91 &&
          (index === 0 || (index > 0 && parseGametime(sortedEvents[index - 1].gametime) < 91))
        "
        class="full-line separator"
      >
        {{ t('matches.extraTimeFirst') }}
      </div>
      <div
        v-if="
          parseGametime(event.gametime) >= 106 &&
          (index === 0 || (index > 0 && parseGametime(sortedEvents[index - 1].gametime) < 106))
        "
        class="full-line separator"
      >
        <PrimeTag :value="t('matches.extraTimeSecond')" />
      </div>
      <div
        class="full-line"
        :style="{ justifyContent: homeTeamId === event.teamId ? 'flex-start' : 'flex-end' }"
      >
        <div
          class="event"
          :style="{
            flexDirection: homeTeamId === event.teamId ? 'row' : 'row-reverse',
          }"
        >
          <div
            class="icon-and-time"
            :style="{ justifyContent: homeTeamId === event.teamId ? 'flex-start' : 'flex-end' }"
          >
            <img
              style="width: 20px; height: 20px"
              :src="getEventIconUrl(event.event.id, homeTeamId === event.teamId)"
              :alt="event.event.description"
            />

            <span
              v-if="homeTeamId === event.teamId"
              style="width:"
            >
              {{ event.event.id === MATCH_EVENT.PENALTY_SHOOTOUT ? 'PEN' : event.gametime }}
            </span>
            <span v-if="homeTeamId !== event.teamId">{{
              event.event.id === MATCH_EVENT.PENALTY_SHOOTOUT ? 'PEN' : event.gametime
            }}</span>
          </div>
          <HoverablePlayerName
            v-if="event.player"
            :player="event.player"
            :text-align="homeTeamId === event.teamId ? 'right' : 'left'"
          />
        </div>
      </div>
      <div
        v-if="index === sortedEvents.length - 1 && FINISHED_GAME.includes(matchStatus)"
        class="full-line separator"
      >
        {{ t('matches.finish') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { IMatchEvent } from '@/stores/matches.types';

import { FINISHED_GAME, MATCH_EVENT } from '@/constants/match';

import HoverablePlayerName from '../HoverablePlayerName.vue';

const props = defineProps<{
  events: IMatchEvent[];
  homeTeamId: number;
  matchStatus: number;
}>();

const { t } = useI18n();

const sortedEvents = computed(() => {
  return [...props.events].sort((a, b) => {
    return parseGametime(a.gametime) - parseGametime(b.gametime);
  });
});

function getEventIconUrl(eventType: number, isHome: boolean) {
  switch (eventType) {
    case MATCH_EVENT.CARD_RED: {
      return 'https://assets.omegafox.me/copa/icons/red_card.png';
    }
    case MATCH_EVENT.CARD_YELLOW: {
      return 'https://assets.omegafox.me/copa/icons/yellow_card.png';
    }
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
    case MATCH_EVENT.PENALTY_SHOOTOUT: {
      return isHome
        ? 'https://assets.omegafox.me/copa/icons/penalty_shootout.png'
        : 'https://assets.omegafox.me/copa/icons/penalty_shootout_a.png';
    }
  }
}

function parseGametime(gametime: string) {
  const match = gametime.match(/^(\d+)(?:\+(\d+))?'/);
  if (!match) return 0;
  const minutes = parseInt(match[1], 10);
  return minutes;
}
</script>
<style lang="scss" scoped>
.events-line-outer {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: var(--xxs-spacing) 0;

  .full-line {
    display: flex;
    gap: 0;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--xxs-spacing);
  }

  .separator {
    font-size: var(--xs-font-size);
    font-weight: bold;
    color: var(--bolao-c-grey3);
  }

  .event {
    display: flex;
    align-items: center;
    width: 60%;
    min-height: 30px;
    padding: var(--xxs-spacing) var(--xs-spacing);
    border-bottom: 1px solid color-mix(in srgb, var(--bolao-c-grey3), transparent 80%);

    &:last-child {
      border-bottom: none;
    }

    .icon-and-time {
      display: flex;
      flex-direction: row;
      gap: var(--s-spacing);
      align-items: center;
      width: 76px;
      min-width: 76px;
      font-size: var(--xs-font-size);

      @media (width <=768px) {
        flex-direction: column;
        width: 40px;
        min-width: 40px;
      }
    }
  }
}

:deep(.player-name-hover) {
  font-size: var(--xs-font-size);
  font-weight: 500;

  @media (width <=768px) {
    flex: 1;
  }
}
</style>
