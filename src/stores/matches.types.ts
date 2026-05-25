import type { TMatchStatus } from '@/constants/match';

import type { IUser } from './activeProfile.types';
import type { IPlayer, ITeam } from './teams.types';

export interface IBet {
  id: number;
  matchId: number;
  scoreAway: null | number;
  scoreHome: null | number;
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
  gametime?: null | string;
  group: null | string;
  homeTeam: ITeam;
  id: number;
  idFifa: number;
  loggedUserBets: IBet | null;
  pointsAwarded?: IPointsAwarded;
  referee: IReferee;
  round: number;
  score: IScore;
  stadium: IStadium;
  status: TMatchStatus;
  timestamp: string;
}

export interface IMatchEvent {
  event: IEvent;
  id: number;
  matchId: number;
  player: IPlayer;
  playerAssist: IPlayer | null;
}

export interface IPointsAwarded {
  exact: number;
  minimal: number;
  miss: number;
  partial: number;
}

export interface IReferee {
  country: string;
  countryEn: string;
  dateOfBirth: string;
  id: number;
  idFifa: number;
  isoCode: string;
  name: string;
}

export interface IScore {
  away: number;
  awayPenalties: number;
  home: number;
  homePenalties: number;
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
  isoCode: string;
  name: string;
  url: string;
}

export type TConference = 'AFC' | 'NFC';
export type TDivision = 'East' | 'North' | 'South' | 'West';
