import type { IPointsAwarded } from '@/stores/matches.types';

import { BETS_VALUES, type BetsValues, HIT_LEVELS, type THitLevel } from '@/constants/bets';

export type CorrectBets = { bullseye: BetsValues[]; half: BetsValues[] };

export function calculateCorrectBets(awayScore: number, homeScore: number) {
  if (awayScore === homeScore) {
    return {
      bullseye: [],
      half: [BETS_VALUES.HOME_HARD, BETS_VALUES.AWAY_HARD],
    };
  }

  if (awayScore > homeScore) {
    if (awayScore - 7 > homeScore) {
      return {
        bullseye: [BETS_VALUES.AWAY_EASY],
        half: [BETS_VALUES.AWAY_HARD],
      };
    } else {
      return {
        bullseye: [BETS_VALUES.AWAY_HARD],
        half: [BETS_VALUES.AWAY_EASY],
      };
    }
  }

  if (awayScore < homeScore) {
    if (awayScore + 7 < homeScore) {
      return {
        bullseye: [BETS_VALUES.HOME_EASY],
        half: [BETS_VALUES.HOME_HARD],
      };
    } else {
      return {
        bullseye: [BETS_VALUES.HOME_HARD],
        half: [BETS_VALUES.HOME_EASY],
      };
    }
  }

  return {
    bullseye: [],
    half: [BETS_VALUES.HOME_HARD, BETS_VALUES.AWAY_HARD],
  };
}

export function getPointsAwarded(pointsAwarded?: IPointsAwarded, hitLevel?: null | THitLevel) {
  if (!pointsAwarded || !hitLevel) return null;

  if (hitLevel === HIT_LEVELS.miss) {
    return 0;
  } else if (hitLevel === HIT_LEVELS.oneScore) {
    return pointsAwarded.partial;
  } else if (hitLevel === HIT_LEVELS.winnerOnly) {
    return pointsAwarded.minimal;
  } else if (hitLevel === HIT_LEVELS.exactScore) {
    return pointsAwarded.exact;
  }

  return null;
}

export function isBullseye(correctBets: CorrectBets, betValue: BetsValues) {
  return correctBets.bullseye.find((bullseyeBet) => bullseyeBet === betValue) !== undefined;
}

export function isHalfBet(correctBets: CorrectBets, betValue: BetsValues) {
  return correctBets.half.find((halfBet) => halfBet === betValue) !== undefined;
}
