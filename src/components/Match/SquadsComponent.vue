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
        </div>
      </div>
      <div
        v-if="awayTeam.squad && (!isMobile || selectedTeam === awayTeam.id)"
        class="column"
        style="align-items: flex-end"
      >
        <div
          v-for="(player, index) in awayTeam.squad"
          :key="player.id"
          class="player-line"
          :class="{ starter: player.isStarting, captain: player.isCaptain }"
          :style="{
            marginTop: index > 0 && !player.isStarting && awayTeam.squad[index - 1].isStarting ? '20px' : 'unset',
          }"
        >
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
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type { ITeam } from '@/stores/teams.types.ts';

import { useViewport } from '@/services/viewport.ts';

import HoverablePlayerName from '../HoverablePlayerName.vue';

const props = defineProps<{
  awayTeam: ITeam;
  homeTeam: ITeam;
}>();

const { locale } = useI18n();
const { isMobile } = useViewport();

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
