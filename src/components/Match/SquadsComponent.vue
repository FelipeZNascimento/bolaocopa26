<template>
  <div class="events-line-outer">
    <div
      v-if="isMobile"
      class="full-line"
      style="margin: var(--s-spacing)"
    >
      <PrimeSelectButton
        v-model="selectedTeam"
        optionValue="value"
        :options="options"
        fluid
      >
        <template #option="slotProps">
          <img
            class="flag"
            :src="`https://assets.omegafox.me/copa/countries_flags/${slotProps.option.item.isoCode.toLowerCase()}.png`"
            :alt="slotProps.option.item.name"
          />

          {{ locale === 'pt-br' ? slotProps.option.item.abbreviation : slotProps.option.item.abbreviationEn }}
        </template>
      </PrimeSelectButton>
    </div>
    <div class="full-line">
      <div
        v-if="homeTeam.squad && (!isMobile || selectedTeam === homeTeam.id)"
        class="column"
        style="align-items: flex-start"
      >
        <p
          class="player-line"
          style="text-align: center"
        >
          {{ homeTeam.tactics }}
        </p>
        <div
          v-for="(player, index) in homeTeam.squad"
          :key="player.id"
          class="player-line"
          :class="{ starter: player.isStarting, captain: player.isCaptain }"
          :style="{
            marginTop: index > 0 && !player.isStarting && homeTeam.squad[index - 1].isStarting ? '20px' : 'unset',
          }"
        >
          <div style="width: 40px; font-size: var(--xxs-font-size)">
            {{ locale === 'pt-BR' ? player.position.abbreviation : player.position.abbreviationEn }}
          </div>
          <div style="width: 40px; text-align: center">{{ player.number }}</div>
          <HoverablePlayerName
            :player="player"
            text-align="left"
          />
          <div
            v-for="event in getPlayerEvents(player)"
            :key="event.gametime + event.player.id"
          >
            <img
              v-if="event.event.id !== 7"
              style="width: 20px; height: 20px"
              :src="getEventIconUrl(event.event, true)"
              :alt="event.event.description"
            />
            <div v-if="event.event.id === 7">
              <span v-if="event.player.id === player.id">
                <i
                  v-if="event.event.id === 7"
                  style="font-size: var(--xs-font-size); color: var(--bolao-c-mint)"
                  :class="{
                    'pi pi-chevron-right': homeTeam.id === event.teamId,
                    'pi pi-chevron-left': homeTeam.id !== event.teamId,
                  }"
                />
              </span>
              <span v-else-if="event.playerAssist?.id === player.id">
                <i
                  style="font-size: var(--xs-font-size); color: var(--bolao-c-red)"
                  :class="{
                    'pi pi-chevron-right': awayTeam.id === event.teamId,
                    'pi pi-chevron-left': awayTeam.id !== event.teamId,
                  }"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="awayTeam.squad && (!isMobile || selectedTeam === awayTeam.id)"
        class="column"
        style="align-items: flex-end"
      >
        <p
          class="player-line"
          style="text-align: center"
        >
          {{ awayTeam.tactics }}
        </p>
        <div
          v-for="(player, index) in awayTeam.squad"
          :key="player.id"
          class="player-line"
          :class="{ starter: player.isStarting, captain: player.isCaptain }"
          :style="{
            marginTop: index > 0 && !player.isStarting && awayTeam.squad[index - 1].isStarting ? '20px' : 'unset',
          }"
        >
          <div
            v-for="event in getPlayerEvents(player)"
            :key="event.gametime + event.player.id"
          >
            <img
              v-if="event.event.id !== 7"
              style=" display: block;width: 20px; height: 20px"
              :src="getEventIconUrl(event.event, false)"
              :alt="event.event.description"
            />
            <div v-if="event.event.id === 7">
              <span v-if="event.player.id === player.id">
                <i
                  v-if="event.event.id === 7"
                  style="font-size: var(--xs-font-size); color: var(--bolao-c-mint)"
                  :class="{
                    'pi pi-chevron-right': homeTeam.id === event.teamId,
                    'pi pi-chevron-left': homeTeam.id !== event.teamId,
                  }"
                />
              </span>
              <span v-else-if="event.playerAssist?.id === player.id">
                <i
                  style="font-size: var(--xs-font-size); color: var(--bolao-c-red)"
                  :class="{
                    'pi pi-chevron-right': awayTeam.id === event.teamId,
                    'pi pi-chevron-left': awayTeam.id !== event.teamId,
                  }"
                />
              </span>
            </div>
          </div>
          <HoverablePlayerName
            :player="player"
            text-align="right"
          />
          <div style="width: 40px; text-align: center">{{ player.number }}</div>
          <div style="width: 40px; font-size: var(--xxs-font-size)">
            {{ locale === 'pt-BR' ? player.position.abbreviation : player.position.abbreviationEn }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type { IEvent, IMatchEvent, ISub } from '@/stores/matches.types.ts';
import type { IPlayer, ITeam } from '@/stores/teams.types.ts';

import { MATCH_EVENT } from '@/constants/match.ts';
import { useViewport } from '@/services/viewport.ts';

import HoverablePlayerName from '../HoverablePlayerName.vue';

const props = defineProps<{
  awayTeam: ITeam;
  events: IMatchEvent[];
  homeTeam: ITeam;
  subs: ISub[];
}>();

// ------ Initialization ------

const { locale } = useI18n();
const { isMobile } = useViewport();

// ------ Refs ------

const selectedTeam = ref(props.homeTeam.id);
const options = ref([
  {
    item: props.homeTeam,
    value: props.homeTeam.id,
  },
  {
    item: props.awayTeam,
    value: props.awayTeam.id,
  },
]);

// ------ Computed ------

const sortedEvents = computed(() => {
  return [...props.events, ...props.subs].sort((a, b) => {
    return parseGametime(a.gametime) - parseGametime(b.gametime);
  });
});

// ------ Functions ------

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

function getPlayerEvents(player: IPlayer) {
  return sortedEvents.value.filter((event) => {
    if (event.playerAssist) {
      console.log('assist!');
    }
    return event.player.id === player.id || event.playerAssist?.id === player.id;
  });
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
    gap: var(--m-spacing);
    align-items: flex-start;
    justify-content: center;
    margin-bottom: var(--xxs-spacing);
  }

  .column {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: var(--xs-spacing);

    .player-line {
      display: flex;
      gap: var(--m-spacing);
      align-items: center;
      padding: var(--xxs-spacing) var(--l-spacing);
      border-radius: var(--border-radius);
    }

    .starter {
      background-color: color-mix(in srgb, var(--color-main), transparent 80%);
    }

    .captain {
      border-right: 2px solid var(--bolao-c-gold);
      border-left: 2px solid var(--bolao-c-gold);
    }
  }
}

.flag {
  width: 28px;
  height: 20px;
  object-fit: cover;
  border-radius: 2px;
}

:deep(.player-name-hover) {
  font-size: var(--xs-font-size);
  font-weight: 500;

  @media (width <=768px) {
    flex: 1;
  }
}
</style>
