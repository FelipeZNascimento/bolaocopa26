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
  [HIT_LEVELS.exactScore]: `Acerto Total (${HIT_LEVELS_POINTS[HIT_LEVELS.exactScore]} pontos)`,
  [HIT_LEVELS.oneScore]: `Acerto Parcial (${HIT_LEVELS_POINTS[HIT_LEVELS.oneScore]} pontos)`,
  [HIT_LEVELS.winnerOnly]: `Acerto Mínimo (${HIT_LEVELS_POINTS[HIT_LEVELS.winnerOnly]} pontos)`,
  [HIT_LEVELS.miss]: `Errrrou (${HIT_LEVELS_POINTS[HIT_LEVELS.miss]} pontos)`,
};

export const EXTRA_BETS_VALUES = {
  CHAMPION: 0,
  TOP_SCORER: 1,
  OFFENSE: 2,
  DEFENSE: 3,
  BEST_PLAYER: 4,
};

export const EXTRA_BETS_LABELS: Record<TEXTRA_BETS_VALUES, string> = {
  [EXTRA_BETS_VALUES.CHAMPION]: 'Campeão',
  [EXTRA_BETS_VALUES.TOP_SCORER]: 'Artilheiro',
  [EXTRA_BETS_VALUES.OFFENSE]: 'Melhor Ataque',
  [EXTRA_BETS_VALUES.DEFENSE]: 'Melhor Defesa',
  [EXTRA_BETS_VALUES.BEST_PLAYER]: 'Melhor Jogador',
};

export type BetsValues = (typeof BETS_VALUES)[keyof typeof BETS_VALUES];
export type HitLevel = (typeof HIT_LEVELS)[keyof typeof HIT_LEVELS];
export type Ribbon = 'BULLSEYE' | 'HALF' | 'MISS' | null;
export type TEXTRA_BETS_LABELS = (typeof EXTRA_BETS_LABELS)[keyof typeof EXTRA_BETS_LABELS];
export type TEXTRA_BETS_VALUES = (typeof EXTRA_BETS_VALUES)[keyof typeof EXTRA_BETS_VALUES];
