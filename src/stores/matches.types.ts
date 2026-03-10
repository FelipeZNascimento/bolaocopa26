import type { TMatchStatus } from '@/constants/match_status';

import type { IUser } from './activeProfile.types';

export interface IBet {
  id: number;
  matchId: number;
  scoreAway: number;
  scoreHome: number;
  timestamp: string;
  user: Pick<IUser, 'id' | 'nickname'>;
}

export interface IConfederation {
  abbreviation: string;
  id: number;
  name: string;
  nameEn: string;
}

export interface IMatch {
  awayTeam: ITeam;
  bets: IBet[];
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

export interface ITeam {
  abbreviation: string;
  abbreviationEn: string;
  colors: string;
  confederation: IConfederation;
  group: string;
  id: number;
  idConfederation: number;
  idFifa: number;
  isoCode: string;
  name: string;
  nameEn: string;
}

export type TConference = 'AFC' | 'NFC';
export type TDivision = 'East' | 'North' | 'South' | 'West';
