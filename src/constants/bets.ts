/* eslint-disable perfectionist/sort-objects */
export const BETS_VALUES = {
  AWAY_EASY: 0,
  AWAY_HARD: 1,
  HOME_HARD: 2,
  HOME_EASY: 3,
};

export const HIT_LEVELS = {
  exactScore: 'exact',
  oneScore: 'oneScore',
  winnerOnly: 'winnerOnly',
  miss: 'miss',
};

export const HIT_LEVELS_POINTS = {
  [HIT_LEVELS.exactScore]: '5',
  [HIT_LEVELS.oneScore]: '3',
  [HIT_LEVELS.winnerOnly]: '2',
  [HIT_LEVELS.miss]: '0',
};

export const HIT_LEVELS_LABELS = {
  [HIT_LEVELS.exactScore]: 'hitLevels.exactScore',
  [HIT_LEVELS.oneScore]: 'hitLevels.oneScore',
  [HIT_LEVELS.winnerOnly]: 'hitLevels.winnerOnly',
  [HIT_LEVELS.miss]: 'hitLevels.miss',
};

export const EXTRA_BETS_VALUES = {
  OFFENSE: 2,
  DEFENSE: 3,
  TOP_SCORER: 1,
  BEST_PLAYER: 4,
  CHAMPION: 0,
};

export const EXTRA_BETS_LABELS: Record<TEXTRA_BETS_VALUES, string> = {
  [EXTRA_BETS_VALUES.OFFENSE]: 'extraBets.bestOffense',
  [EXTRA_BETS_VALUES.DEFENSE]: 'extraBets.bestDefense',
  [EXTRA_BETS_VALUES.TOP_SCORER]: 'extraBets.topScorer',
  [EXTRA_BETS_VALUES.BEST_PLAYER]: 'extraBets.bestPlayer',
  [EXTRA_BETS_VALUES.CHAMPION]: 'extraBets.champion',
};

export type BetsValues = (typeof BETS_VALUES)[keyof typeof BETS_VALUES];
export type Ribbon = 'BULLSEYE' | 'HALF' | 'MISS' | null;
export type TEXTRA_BETS_LABELS = (typeof EXTRA_BETS_LABELS)[keyof typeof EXTRA_BETS_LABELS];
export type TEXTRA_BETS_VALUES = (typeof EXTRA_BETS_VALUES)[keyof typeof EXTRA_BETS_VALUES];
export type THitLevel = (typeof HIT_LEVELS)[keyof typeof HIT_LEVELS];
