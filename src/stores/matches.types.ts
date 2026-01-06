import type { TMatchStatus } from '@/constants/match_status';

import type { IUser } from './activeProfile.types';

export interface IBet {
  id: number;
  matchId: number;
  user: Pick<IUser, 'color' | 'icon' | 'id' | 'isOnline' | 'name'>;
  value: number;
}

export interface IMatch {
  away: ITeam;
  bets: IBet[];
  clock: string;
  home: ITeam;
  homeTeamOdds: string;
  id: number;
  loggedUserBets: IBet | null;
  overUnder: string;
  status: TMatchStatus;
  timestamp: number;
}

export interface ITeam {
  alias: string;
  background: string;
  code: string;
  conference: TConference;
  division: TDivision;
  foreground: string;
  id: number;
  name: string;
  possession: boolean;
  score: number;
  winLosses: null | string;
}

export type TConference = 'AFC' | 'NFC';
export type TDivision = 'East' | 'North' | 'South' | 'West';
