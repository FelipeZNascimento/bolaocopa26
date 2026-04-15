import type { TMatchStatus } from '@/constants/match';

import type { IUser } from './activeProfile.types';
import type { IPlayer, ITeam } from './teams.types';

export interface IBet {
  id: number;
  matchId: number;
  scoreAway: number;
  scoreHome: number;
  timestamp: string;
  user: Pick<IUser, 'id' | 'nickname'>;
}

export interface IEvent {
  description: string;
  descriptionEn: string;
  gametime: string;
  id: number;
}

export interface IMatch {
  awayTeam: ITeam;
  bets: IBet[];
  events: IMatchEvent[];
  homeTeam: ITeam;
  id: number;
  idFifa: number;
  loggedUserBets: IBet | null;
  referee: IReferee;
  round: number;
  score: IScore;
  stadium: IStadium;
  status: TMatchStatus;
  timestamp: number;
}
export interface IMatchEvent {
  event: IEvent;
  id: number;
  matchId: number;
  player: IPlayer;
  playerAssist: IPlayer | null;
}

export interface IReferee {
  country: string;
  countryEn: string;
  dateOfBirth: string;
  id: number;
  idFifa: number;
  name: string;
}

export interface IScore {
  away: number;
  awayPenalties: null | number;
  home: number;
  homePenalties: null | number;
}

export interface IStadium {
  capacity: number;
  city: string;
  country: string;
  countryEn: string;
  geoLatitude: string;
  geoLongitude: string;
  id: number;
  idCountry: number;
  name: string;
}

export type TConference = 'AFC' | 'NFC';
export type TDivision = 'East' | 'North' | 'South' | 'West';
