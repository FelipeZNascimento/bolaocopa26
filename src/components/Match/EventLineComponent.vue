<template>
  <div class="events-line-outer">
    <div
      v-if="matchStatus !== MATCH_STATUS.NOT_STARTED"
      class="full-line separator"
    >
      <PrimeTag :value="t('matches.start')" />
    </div>
    <div
      v-for="(event, index) in sortedEvents"
      :key="`${event.gametime} ${event.event.id}`"
    >
      <div
        v-if="
          parseGametime(event.gametime) >= 46 &&
          (index === 0 || (index > 0 && parseGametime(sortedEvents[index - 1].gametime) < 46))
        "
        class="full-line separator"
      >
        <PrimeTag :value="t('matches.secondHalf')" />
      </div>
      <div
        v-if="
          parseGametime(event.gametime) >= 91 &&
          (index === 0 || (index > 0 && parseGametime(sortedEvents[index - 1].gametime) < 91))
        "
        class="full-line separator"
      >
        <PrimeTag :value="t('matches.extraTimeFirst')" />
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
        v-if="event.gametime"
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
              v-if="event.event.id !== 7"
              style="width: 20px; height: 20px"
              :src="getEventIconUrl(event.event, homeTeamId === event.teamId)"
              :alt="event.event.description"
            />
            <i
              v-else
              class="pi pi-arrow-right-arrow-left"
            />

            <span v-if="homeTeamId === event.teamId">
              {{ event.event.id === MATCH_EVENT.PENALTY_SHOOTOUT ? 'PEN' : event.gametime }}
            </span>
            <span v-if="homeTeamId !== event.teamId">{{
              event.event.id === MATCH_EVENT.PENALTY_SHOOTOUT ? 'PEN' : event.gametime
            }}</span>
          </div>
          <div>
            <div
              v-if="event.player"
              style="display: flex; gap: var(--xs-spacing); align-items: center; justify-content: flex-start"
              :style="{
                flexDirection: homeTeamId === event.teamId ? 'row' : 'row-reverse',
              }"
            >
              <i
                v-if="event.event.id === 7"
                style="font-size: var(--xs-font-size); color: var(--bolao-c-mint)"
                :class="{
                  'pi pi-chevron-right': homeTeamId === event.teamId,
                  'pi pi-chevron-left': homeTeamId !== event.teamId,
                }"
              />
              <HoverablePlayerName
                :player="event.player"
                :text-align="homeTeamId === event.teamId ? 'left' : 'right'"
              />
            </div>
            <div
              v-if="event.playerAssist"
              style="display: flex; gap: var(--xs-spacing); align-items: center; justify-content: flex-start"
              :style="{
                flexDirection: homeTeamId === event.teamId ? 'row' : 'row-reverse',
              }"
            >
              <i
                style="font-size: var(--xs-font-size); color: var(--bolao-c-red)"
                :class="{
                  'pi pi-chevron-left': homeTeamId === event.teamId,
                  'pi pi-chevron-right': homeTeamId !== event.teamId,
                }"
              />
              <HoverablePlayerName
                :player="event.playerAssist"
                :text-align="homeTeamId === event.teamId ? 'left' : 'right'"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="index === sortedEvents.length - 1 && (matchScore.awayPenalties > 0 || matchScore.homePenalties > 0)"
        class="full-line separator"
        style="flex-direction: column; padding-bottom: var(--m-spacing)"
      >
        <PrimeTag :value="t('matches.penalties')" />
        <p>{{ matchScore.homePenalties }} x {{ matchScore.awayPenalties }}</p>
      </div>
      <div
        v-if="index === sortedEvents.length - 1 && FINISHED_GAME.includes(matchStatus)"
        class="full-line separator"
      >
        <PrimeTag :value="t('matches.finish')" />
      </div>
    </div>
  </div>
  <div
    v-if="matchStatus === MATCH_STATUS.NOT_STARTED && isMobile"
    class="no-events-message"
  >
    <i class="pi pi-clock" />
    <p>{{ t('moreInfoModal.eventsNotStarted') }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { IEvent, IMatchEvent, IScore, ISub } from '@/stores/matches.types';

import { FINISHED_GAME, MATCH_EVENT, MATCH_STATUS } from '@/constants/match';
import { useViewport } from '@/services/viewport.ts';

import HoverablePlayerName from '../HoverablePlayerName.vue';

const props = defineProps<{
  events: IMatchEvent[];
  homeTeamId: number;
  matchScore: IScore;
  matchStatus: number;
  subs: ISub[];
}>();

const { t } = useI18n();
const { isMobile } = useViewport();
const sortedEvents = computed(() => {
  return [...props.events, ...props.subs].sort((a, b) => {
    return parseGametime(a.gametime) - parseGametime(b.gametime);
  });
});

function getEventIconUrl(event: IEvent, isHome: boolean) {
  switch (event.id) {
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
    default: {
      return 'https://assets.omegafox.me/copa/icons/whistle.png';
    }
  }
}

function parseGametime(gametime: string) {
  const match = gametime.match(/^(\d+)(?:\+(\d+))?'/);
  if (!match) return 0;
  const minutes = parseInt(match[1], 10);
  const added = match[2] ? parseInt(match[2], 10) / 100 : 0;
  return minutes + added;
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

.no-events-message {
  display: flex;
  flex-direction: column;
  gap: var(--m-spacing);
  align-items: center;
  justify-content: center;
  padding: var(--xl-spacing) var(--l-spacing);
  text-align: center;

  i {
    font-size: var(--xxl-font-size);
    color: var(--bolao-c-grey1-t2);
  }

  p {
    margin: 0;
    font-size: var(--m-font-size);
    line-height: 1.6;
    color: var(--bolao-c-grey1-t2);
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
