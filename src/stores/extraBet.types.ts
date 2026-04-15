import type { TEXTRA_BETS_VALUES } from '@/constants/bets';

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
  team: ITeam;
  user: Pick<IUser, 'id' | 'isActive' | 'name' | 'nickname'>;
}

export interface IExtraBetResult {
  extraType: TEXTRA_BETS_VALUES;
  player: IPlayer;
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
  user: Pick<IUser, 'id' | 'isActive' | 'name' | 'nickname'>;
};
