<template>
  <div class="row">
    <div class="points-awarded">
      {{ getPointsAwarded(match.pointsAwarded, hitLevel) }}
      {{ t('common.pointsShort') }}
    </div>
    <div style="flex: 0; align-items: center; justify-content: space-between; display: flex">
      <img
        class="flag"
        :src="`https://assets.omegafox.me/copa/countries_flags/${match.homeTeam.isoCode.toLowerCase()}.png`"
        :alt="match.homeTeam.name"
      />
    </div>
    <div class="team-name">
      {{ getTeamName(match.homeTeam) }}
    </div>
    <div
      class="team-bet"
      :class="{
        'red-bg': hitLevel === HIT_LEVELS.miss,
        'blue-bg': hitLevel === HIT_LEVELS.winnerOnly,
        'green-bg': hitLevel === HIT_LEVELS.oneScore,
        'gold-bg': hitLevel === HIT_LEVELS.exactScore,
      }"
    >
      {{ bets.home }}
    </div>
    <div class="team-score">
      {{ match.score.home }}
    </div>
    <div class="team-score">
      {{ match.score.away }}
    </div>
    <div
      class="team-bet"
      :class="{
        'red-bg': hitLevel === HIT_LEVELS.miss,
        'blue-bg': hitLevel === HIT_LEVELS.winnerOnly,
        'green-bg': hitLevel === HIT_LEVELS.oneScore,
        'gold-bg': hitLevel === HIT_LEVELS.exactScore,
      }"
    >
      {{ bets.away }}
    </div>
    <div class="team-name">
      {{ getTeamName(match.awayTeam) }}
    </div>
    <div style="flex: 0; width: 40px; align-items: center; justify-content: space-between; display: flex">
      <img
        class="flag"
        :src="`https://assets.omegafox.me/copa/countries_flags/${match.awayTeam.isoCode.toLowerCase()}.png`"
        :alt="match.awayTeam.name"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { IUser } from '@/stores/activeProfile.types.ts';
import type { IMatch } from '@/stores/matches.types';
import type { ITeam } from '@/stores/teams.types';

import { HIT_LEVELS } from '@/constants/bets.ts';
import { useViewport } from '@/services/viewport';
import { useActiveProfileStore } from '@/stores/activeProfile.ts';
import { getPointsAwarded } from '@/util/betsCalculator';

const props = defineProps<{
  match: IMatch;
  user: Pick<IUser, 'id' | 'nickname'>;
}>();

// ------ Initialization ------
const activeProfileStore = useActiveProfileStore();
const { isMobile } = useViewport();
const { locale, t } = useI18n();

const activeProfile = computed(() => activeProfileStore.activeProfile);
const bets = computed(() => {
  if (activeProfile.value?.id === props.user.id) {
    return { away: props.match.loggedUserBets?.scoreAway, home: props.match.loggedUserBets?.scoreHome };
  }
  return {
    away: props.match.bets.find((b) => b.user.id === props.user.id)?.scoreAway,
    home: props.match.bets.find((b) => b.user.id === props.user.id)?.scoreHome,
  };
});

const hitLevel = computed(() => {
  const homeScoreMatch = bets.value.home === props.match.score.home;
  const awayScoreMatch = bets.value.away === props.match.score.away;

  if (homeScoreMatch && awayScoreMatch) {
    return HIT_LEVELS.exactScore;
  }

  if (
    bets.value.home === null ||
    bets.value.away === null ||
    bets.value.home === undefined ||
    bets.value.away === undefined
  ) {
    return HIT_LEVELS.miss;
  }

  // Determine the winner/outcome of the bet and actual match
  const betHomeWon = bets.value.home > bets.value.away;
  const betAwayWon = bets.value.away > bets.value.home;
  const betDraw = bets.value.home === bets.value.away;

  const actualHomeWon = props.match.score.home > props.match.score.away;
  const actualAwayWon = props.match.score.away > props.match.score.home;
  const actualDraw = props.match.score.home === props.match.score.away;

  const gotWinnerRight = (betHomeWon && actualHomeWon) || (betAwayWon && actualAwayWon) || (betDraw && actualDraw);
  if (gotWinnerRight) {
    if ((homeScoreMatch && !awayScoreMatch) || (!homeScoreMatch && awayScoreMatch)) {
      return HIT_LEVELS.oneScore;
    }
    return HIT_LEVELS.winnerOnly;
  }

  return HIT_LEVELS.miss;
});

function getTeamName(team: ITeam) {
  if (isMobile.value) {
    return locale.value === 'pt-BR' ? team.abbreviation : team.abbreviationEn;
  }

  return locale.value === 'pt-BR' ? team.name : team.nameEn;
}
</script>
<style lang="scss" scoped>
.row {
  margin-bottom: var(--xs-spacing);
  width: 100%;
  display: flex;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--xs-spacing) var(--s-spacing);
  background-color: rgb(255 255 255 / 4%);
  border: 1px solid var(--bolao-c-blue3);
  border-radius: var(--border-radius);
  gap: var(--xs-spacing);
}

.points-awarded {
  font-size: var(--xxs-font-size);
  width: 40px;
  flex-direction: row;
  display: flex;
}
.flag {
  width: 28px;
  height: 20px;
  object-fit: cover;
  border-radius: 2px;

  @media (width <= 768px) {
    width: 22px;
    height: 15px;
  }
}

.team-name {
  flex: 4;
  justify-content: center;
  align-items: center;
  text-align: center;

  @media (width <= 768px) {
    font-size: var(--xs-font-size);
  }
}

.team-bet {
  width: 30px;
  color: var(--color-contrast);
  text-align: center;
  border-radius: var(--border-radius);
  font-size: var(--m-font-size);
  border: 1px solid color-mix(in srgb, var(--color-contrast), transparent 70%);
}

.team-score {
  width: 30px;
  background-color: color-mix(in srgb, var(--color-main), transparent 50%);
  color: var(--color-contrast);
  text-align: center;
  border-radius: var(--border-radius);
  font-size: var(--m-font-size);
  border: 1px solid color-mix(in srgb, var(--color-contrast), transparent 70%);
}

.green-bg {
  --c: var(--bolao-c-green-l3);

  color: var(--bolao-c-green-d1);
  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 100% 0 / calc(2 * var(--f)) var(--f) no-repeat
    border-box;
  background-color: var(--c);
}
.blue-bg {
  --c: var(--bolao-c-blue-l2);

  color: var(--bolao-c-blue-d2);
  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 100% 0 / calc(2 * var(--f)) var(--f) no-repeat
    border-box;
  background-color: var(--c);
}
.red-bg {
  --c: var(--bolao-c-red);

  color: var(--bolao-c-red-l3);
  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 100% 0 / calc(2 * var(--f)) var(--f) no-repeat
    border-box;
  background-color: var(--c);
}

.grey-bg {
  --c: var(--bolao-c-grey4);

  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 100% 0 / calc(2 * var(--f)) var(--f) no-repeat
    border-box;
  background-color: var(--c);
}

.gold-bg {
  --c: var(--bolao-c-gold-l2);

  color: var(--bolao-c-gold-d2);
  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 100% 0 / calc(2 * var(--f)) var(--f) no-repeat
    border-box;
  background-color: var(--c);
}

@keyframes gold-shine {
  0% {
    transform: translateX(-150%) rotate(30deg);
  }

  100% {
    transform: translateX(150%) rotate(30deg);
  }
}
</style>
