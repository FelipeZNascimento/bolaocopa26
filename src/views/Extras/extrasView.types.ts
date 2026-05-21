import type { TEXTRA_BETS_LABELS, TEXTRA_BETS_VALUES } from '@/constants/bets';
import type { IPlayer, ITeam } from '@/stores/teams.types';

// ------ Types & Interfaces ------
export interface ISelectedTeamEntry {
  stageId: number;
  team: ITeam;
}

export interface IToggleOption {
  label: TEXTRA_BETS_LABELS;
  selectedPlayer?: IPlayer | null;
  selectedTeam?: ISelectedTeamEntry[];
  value: TEXTRA_BETS_VALUES;
}
