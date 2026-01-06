import type { ExtraBetsValues } from '@/constants/bets';

import type { IUser } from './activeProfile.types';
import type { ITeam } from './matches.types';

export interface IBetByCategory {
  conference: Pick<IUser, 'color' | 'icon' | 'id' | 'name'>[];
  division: Pick<IUser, 'color' | 'icon' | 'id' | 'name'>[];
  superbowl: Pick<IUser, 'color' | 'icon' | 'id' | 'name'>[];
  wildcard: Pick<IUser, 'color' | 'icon' | 'id' | 'name'>[];
}

export interface IConferenceTeams {
  East: TExtrasTeam[];
  North: TExtrasTeam[];
  South: TExtrasTeam[];
  West: TExtrasTeam[];
}

export interface IExtraBet {
  bets: IExtraBetBet[];
  user: Pick<IUser, 'color' | 'icon' | 'id' | 'name'>;
}
export interface IExtraBetBet {
  teams: ITeam[];
  type: ExtraBetsValues;
}

export interface IExtraBetUserObj {
  bets: IExtraBet[];
  user: Pick<IUser, 'color' | 'icon' | 'id' | 'name'>;
}
export interface IExtrasFetch {
  bets: IExtraBetUserObj[];
  results: IExtraBet[];
  season: string;
  userBets: IExtraBet[];
}

export interface ITeamWithExtras {
  bets: ITeamWithExtrasBet[];
  team: ITeam;
}

export interface ITeamWithExtrasBet {
  type: ExtraBetsValues;
  user: Pick<IUser, 'color' | 'icon' | 'id' | 'name'>;
}

export type TConference = 'AFC' | 'NFC';

export type TConferenceChampions = {
  [key in TConference]: null | TExtrasTeam;
};

export type TDivision = 'East' | 'North' | 'South' | 'West';

export type TDivisionChampions = {
  [key in TConference]: {
    [key in TDivision]: null | TExtrasTeam;
  };
};

export type TExtrasAfterToggle = 'Geral' | 'Minhas';

export type TExtrasBeforeToggle = 'Playoffs' | TConference;

export type TExtrasTeam = Pick<
  ITeam,
  'alias' | 'background' | 'code' | 'conference' | 'division' | 'foreground' | 'id' | 'name' | 'winLosses'
> & {
  conference: TConference;
  division: TDivision;
};
export type TSelectedDivisionChampions = { [key in TDivision]: null | TExtrasTeam };

export type TWildcards = {
  [key in TConference]: TExtrasTeam[];
};
