<template>
  <div
    class="outer-team"
    :class="isNameless ? 'outer-team-nameless' : ''"
    :style="{ backgroundColor: team.background, color: team.foreground }"
  >
    <span
      :class="{
        'team-shield-line': !isGridMode,
        'team-shield-grid': isGridMode,
      }"
      class="team-shield"
    >
      <img
        :class="isScoreless ? 'team-shield-image-small' : 'team-shield-image'"
        :src="`/team_logos/${props.team.id}.gif`"
        :alt="`${props.team.name} Shield`"
      />
    </span>
    <div v-if="!isNameless" class="team-alias">
      {{ isGridMode || isAlias ? team.code : team.alias }}
      <p v-if="props.team.winLosses" style="padding: 0; margin: 0; font-size: var(--s-font-size); text-align: right">
        {{ props.team.winLosses }}
      </p>
    </div>
    <div v-if="!isScoreless && odds" class="team-odds">{{ odds }}</div>
    <div v-if="!isScoreless && !odds" class="team-score" :style="{ fontWeight: isWinning ? 'bold' : 'normal' }">
      {{ team.score }}
      <img
        v-if="team.possession && !isClockStopped"
        src="/src/img/football.png"
        style="position: absolute; top: 5%; left: 5%; height: 15px; width: 15px"
        :alt="`Ball possession for ${team.name}`"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';

import type { ITeam } from '@/stores/matches.types';

import { STOPPED_GAME, type TMatchStatus } from '@/constants/match_status';

const props = defineProps<{
  isAlias?: boolean;
  isGridMode: boolean;
  isHomeTeam?: boolean;
  isNameless?: boolean;
  isScoreless?: boolean;
  isWinning?: boolean;
  matchStatus: TMatchStatus;
  odds?: null | string;
  team: Partial<ITeam>;
}>();

const isClockStopped = computed(() => STOPPED_GAME.includes(props.matchStatus));
</script>
<style lang="scss" scoped>
.outer-team {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  height: 60px;
  max-height: 60px;
  background-image: url('/match_layer.png');
  position: relative;
  overflow: hidden;
}

.outer-team-nameless {
  min-width: 60px;
}

.team-shield-grid {
  position: absolute;
  height: 60px;
  left: 20px;
  top: -50%;

  @media (max-width: 1024px) {
    top: 0%;
  }
}

.team-shield-line {
  position: absolute;
  left: 5%;
  top: 50%;
  transform: translate(0, -50%);

  @media (max-width: 1024px) {
    left: 5%;
    top: 0%;
    transform: none;
  }
}

.team-shield-image {
  height: 100px;
  z-index: -1;

  @media (max-width: 1024px) {
    height: 60px;
  }
}

.team-shield-image-small {
  height: 60px;
  z-index: -1;
}

.team-alias {
  position: relative;
  padding-right: var(--s-spacing);
  font-weight: bold;
  z-index: 99;
  font-size: var(--l-font-size);
  line-height: var(--xl-spacing);

  @media (max-width: 1024px) {
    font-size: var(--s-font-size);
  }

  @media (max-width: 1444px) {
    font-size: var(--m-font-size);
  }
}

.team-odds {
  width: 55px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--s-font-size);
  background-color: #0003;
  padding: 0 var(--s-spacing);
}

.team-score {
  min-width: 55px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--l-font-size);
  background-color: #0003;
  padding: 0 var(--m-spacing);
  position: relative;
}
</style>
