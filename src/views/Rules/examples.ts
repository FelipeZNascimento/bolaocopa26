import type { IMatch, IReferee, IStadium } from '@/stores/matches.types';
import type { ITeam } from '@/stores/teams.types';

const brazil: ITeam = {
  abbreviation: 'BRA',
  abbreviationEn: 'BRA',
  colors: ['#FFCF25', '#004DE1'],
  colorsRaw: '#FFCF25,#004DE1',
  confederation: {
    abbreviation: 'CONMEBOL',
    id: 5,
    name: 'Confederação Sul-Americana de Futebol',
    nameEn: 'Confederación Sudamericana de Fútbol',
  },
  group: 'C',
  id: 43,
  idConfederation: 5,
  idFifa: 43924,
  isoCode: 'BR',
  name: 'Brasil',
  nameEn: 'Brazil',
  players: [],
};

const argentina: ITeam = {
  abbreviation: 'ARG',
  abbreviationEn: 'ARG',
  colors: ['#9CC9F2', '#FFFFFF'],
  colorsRaw: '#9CC9F2,#FFFFFF',
  confederation: {
    abbreviation: 'CONMEBOL',
    id: 5,
    name: 'Confederação Sul-Americana de Futebol',
    nameEn: 'Confederación Sudamericana de Fútbol',
  },
  group: 'J',
  id: 38,
  idConfederation: 5,
  idFifa: 43922,
  isoCode: 'AR',
  name: 'Argentina',
  nameEn: 'Argentina',
  players: [],
};

const england: ITeam = {
  abbreviation: 'ING',
  abbreviationEn: 'ENG',
  colors: ['#FFFFFF', '#CE1124'],
  colorsRaw: '#FFFFFF,#CE1124',
  confederation: {
    abbreviation: 'UEFA',
    id: 6,
    name: 'União das Associações Europeias de Futebol',
    nameEn: 'Union of European Football Associations',
  },
  group: 'L',
  id: 62,
  idConfederation: 6,
  idFifa: 43942,
  isoCode: 'GB-ENG',
  name: 'Inglaterra',
  nameEn: 'England',
  players: [],
};

const germany: ITeam = {
  abbreviation: 'ALE',
  abbreviationEn: 'GER',
  colors: ['#1F1F1F', '#FFFFFF'],
  colorsRaw: '#1F1F1F,#FFFFFF',
  confederation: {
    abbreviation: 'UEFA',
    id: 6,
    name: 'União das Associações Europeias de Futebol',
    nameEn: 'Union of European Football Associations',
  },
  group: 'E',
  id: 35,
  idConfederation: 6,
  idFifa: 43948,
  isoCode: 'DE',
  name: 'Alemanha',
  nameEn: 'Germany',
  players: [],
};

const referee: IReferee = {
  country: 'Não definido',
  countryEn: 'Undefined',
  dateOfBirth: '0000-00-00',
  id: 37,
  idFifa: 0,
  name: 'Não definido',
};

const stadium: IStadium = {
  capacity: 82500,
  city: 'Nova York',
  country: 'Estados Unidos',
  countryEn: 'United States',
  geoLatitude: '40.8128',
  geoLongitude: '-74.0742',
  id: 23,
  idCountry: 70,
  name: 'MetLife Stadium',
};

export const firstExample: IMatch = {
  awayTeam: argentina,
  bets: [],
  events: [],
  group: 'Group A',
  homeTeam: brazil,
  id: 1,
  idFifa: 12345,
  loggedUserBets: null,
  referee: referee,
  round: 1,
  score: { away: 1, awayPenalties: 0, home: 2, homePenalties: 0 },
  stadium: stadium,
  status: 1,
  timestamp: '1',
};

export const secondExample: IMatch = {
  awayTeam: germany,
  bets: [],
  events: [],
  group: 'Group A',
  homeTeam: england,
  id: 1,
  idFifa: 12345,
  loggedUserBets: null,
  referee: referee,
  round: 1,
  score: { away: 1, awayPenalties: 0, home: 1, homePenalties: 0 },
  stadium: stadium,
  status: 1,
  timestamp: '1',
};
