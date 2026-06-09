import type { STAGE_ID, TEXTRA_BETS_VALUES } from '@/constants/bets';

import type { IUser } from './activeProfile.types';
import type { IPlayer, ITeam } from './teams.types';

export interface IExtraAllBets {
  bets: IExtraBet[];
  description: string;
  extraType: TEXTRA_BETS_VALUES;
}

export interface IExtraBet {
  extraType: TEXTRA_BETS_VALUES;
  id: number;
  player: IPlayer;
  stageId: TStageId;
  team: ITeam;
  user: IUser;
}

export interface IExtraBetResult {
  extraType: TEXTRA_BETS_VALUES;
  player: IPlayer;
  stageId: TStageId;
  team: ITeam;
}

export interface IExtraResults {
  description: string;
  extraType: TEXTRA_BETS_VALUES;
  results: IExtraBetResult[];
}

export interface IPlayerWithExtras extends ITeamWithExtras {
  player: IPlayer;
}

export interface ITeamWithExtras {
  bets: IExtraBet[];
  team: ITeam;
}

export type IUserWithExtras = {
  bets: IExtraBet[];
  user: IUser;
};

export type TStageId =
  | STAGE_ID.BEFORE_QUARTERFINALS
  | STAGE_ID.BEFORE_START
  | STAGE_ID.FINAL
  | STAGE_ID.GROUP_STAGE
  | STAGE_ID.QUARTERFINALS
  | STAGE_ID.SEMIFINALS
  | STAGE_ID.WINNER;
