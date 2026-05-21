import { EXTRA_BETS_LABELS, EXTRA_BETS_VALUES } from '@/constants/bets';

import type { IToggleOption } from './extrasView.types';

export const BUTTON_OPTIONS: IToggleOption[] = [
  {
    label: EXTRA_BETS_LABELS[EXTRA_BETS_VALUES.OFFENSE],
    selectedPlayer: null,
    selectedTeam: [],
    value: EXTRA_BETS_VALUES.OFFENSE,
  },
  {
    label: EXTRA_BETS_LABELS[EXTRA_BETS_VALUES.DEFENSE],
    selectedPlayer: null,
    selectedTeam: [],
    value: EXTRA_BETS_VALUES.DEFENSE,
  },
  {
    label: EXTRA_BETS_LABELS[EXTRA_BETS_VALUES.TOP_SCORER],
    selectedPlayer: null,
    selectedTeam: [],
    value: EXTRA_BETS_VALUES.TOP_SCORER,
  },

  {
    label: EXTRA_BETS_LABELS[EXTRA_BETS_VALUES.BEST_PLAYER],
    selectedPlayer: null,
    selectedTeam: [],
    value: EXTRA_BETS_VALUES.BEST_PLAYER,
  },
  {
    label: EXTRA_BETS_LABELS[EXTRA_BETS_VALUES.CHAMPION],
    selectedPlayer: null,
    selectedTeam: [],
    value: EXTRA_BETS_VALUES.CHAMPION,
  },
];
