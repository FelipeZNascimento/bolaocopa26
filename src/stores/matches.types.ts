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
  code: string;
  description: string;
  descriptionEn: string;
  fifaId: number;
  id: number;
}

export interface IMatch {
  attendance: null | string;
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
  subs: ISub[];
  timestamp: number;
  weather: IWeather;
}

export interface IMatchEvent {
  coach: boolean;
  event: IEvent;
  gametime: string;
  id?: number;
  matchId: number;
  player: IPlayer;
  playerAssist: IPlayer | null;
  teamId: number;
}

export interface IPlayByPlay {
  Event: IPlayByPlayEvent[];
}
export interface IPlayByPlayEvent {
  EventDescription: { Description: string; Locale: string }[];
  EventId: string;
  IdPlayer?: string;
  IdTeam: string;
  MatchMinute: string;
  PositionX: string;
  PositionY: string;
  TypeLocalized: { Description: string; Locale: string }[];
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

export interface ISub {
  event: IEvent;
  gametime: string;
  player: IPlayer;
  playerAssist: IPlayer | null;
  teamId: number;
}

export interface IWeather {
  description: null | string;
  humidity: null | string;
  temperature: null | string;
  windSpeed: null | string;
}

export type TConference = 'AFC' | 'NFC';
export type TDivision = 'East' | 'North' | 'South' | 'West';
