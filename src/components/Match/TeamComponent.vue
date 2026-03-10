<template>
  <div
    class="outer-team"
    :class="[isNameless ? 'outer-team-nameless' : '']"
    :style="{
      flexDirection: isHomeTeam ? 'row' : 'row-reverse',
      // borderBottom: `2px solid ${team.colors[1]}`,
      // color: team.colors[0],
    }"
  >
    <div class="overlay">&nbsp;</div>
    <!-- :style="{ backgroundColor: team.colors[1], color: team.colors[0] }" -->
    <span
      :class="{
        'team-shield--line': !isGridMode,
        'team-shield--grid': isGridMode,
        'team-shield--left': isHomeTeam,
        'team-shield--right': !isHomeTeam,
      }"
    >
      <img
        :class="isScoreless ? 'team-shield-image-small' : 'team-shield-image'"
        :src="`https://assets.omegafox.me/copa/countries_crests/${team.abbreviationEn.toLowerCase()}_small.png`"
        :alt="`${props.team.name} Shield`"
      />
    </span>
    <div v-if="!isNameless" class="team-alias">
      {{ isGridMode || isAlias ? team.abbreviation : team.name }}
    </div>
    <div
      v-if="!isScoreless"
      class="team-score"
      :style="{
        fontWeight: isWinning ? 'bold' : 'normal',
        backgroundColor: props.team.colors[1],
        color: props.team.colors[0],
      }"
    >
      {{ isHomeTeam ? score.home : score.away }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { IScore, ITeam } from '@/stores/matches.types';

import { type TMatchStatus } from '@/constants/match_status';

const props = defineProps<{
  isAlias?: boolean;
  isGridMode: boolean;
  isHomeTeam?: boolean;
  isNameless?: boolean;
  isScoreless?: boolean;
  isWinning?: boolean;
  matchStatus: TMatchStatus;
  score: IScore;
  team: ITeam;
}>();

// ------ Computed Properties ------
</script>
<style lang="scss" scoped>
.outer-team {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  height: 60px;
  position: relative;
  max-height: 60px;
  // background-image: url('/match_layer.png');
  color: var(--color-contrast);
  background-color: var(--bolao-c-blue5-t1);
  padding: 0 var(--xs-spacing);
  position: relative;
  overflow: hidden;
  border-radius: var(--border-radius);
}

.overlay {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 22px;
  background-color: color-mix(in srgb, var(--color-main) 40%, transparent);
}

.outer-team-nameless {
  min-width: 60px;
}
.team-shield {
  &--line {
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);

    @media (max-width: 1024px) {
      top: 0%;
      transform: none;
    }
  }

  &--left {
    left: 5%;

    @media (max-width: 1024px) {
      left: 5%;
    }
  }

  &--right {
    right: 5%;
    @media (max-width: 1024px) {
      right: 5%;
    }
  }

  &--grid {
    position: absolute;
    height: 60px;
    left: 20px;
    top: -50%;

    @media (max-width: 1024px) {
      top: 0%;
    }
  }
}

.team-shield-image {
  height: 60px;
  width: 60px;
  object-fit: contain;
  z-index: -1;

  @media (max-width: 1024px) {
    height: 60px;
    width: 60px;
  }
}

.team-shield-image-small {
  height: 60px;
  width: 60px;
  object-fit: contain;
  z-index: -1;
}

.team-alias {
  position: relative;
  padding: var(--s-spacing);
  // font-weight: bold;
  z-index: 99;
  font-size: var(--m-font-size);
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
  min-width: 40px;
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--l-font-size);
  background-color: #0003;
  padding: 0 var(--m-spacing);
  border-radius: var(--border-radius);
  position: relative;
  // background-image: url('/match_layer.png');
}

// Group-based background colors for rounds 1, 2, and 3
// TODO: Replace with actual CSS variables from base.scss
.group-a {
  background-color: var(--bolao-c-fifa-green1);
  color: var(--bolao-c-black);
}

.group-b {
  background-color: var(--bolao-c-fifa-red); // TODO: var(--group-b-color)
  color: var(--bolao-c-white);
}

.group-c {
  background-color: transparent; // TODO: var(--group-c-color)
}

.group-d {
  background-color: transparent; // TODO: var(--group-d-color)
}

.group-e {
  background-color: transparent; // TODO: var(--group-e-color)
}

.group-f {
  background-color: transparent; // TODO: var(--group-f-color)
}

.group-g {
  background-color: transparent; // TODO: var(--group-g-color)
}

.group-h {
  background-color: transparent; // TODO: var(--group-h-color)
}
</style>
