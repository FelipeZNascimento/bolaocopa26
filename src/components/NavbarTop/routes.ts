export enum ROUTE_ID {
  HOME,
  BET,
  GAMES,
  EXTRAS,
  RECORDS,
  RANKING,
  RULES,
  PROFILE,
  LOGIN,
  TEAMS,
}

export interface TROUTE {
  id: ROUTE_ID;
  label: string;
  needCredentials: boolean;
  url?: string;
}

export const ROUTES = [
  // {
  //   id: ROUTE_ID.HOME,
  //   label: 'Home',
  //   url: '/home',
  //   needCredentials: false,
  // },
  {
    id: ROUTE_ID.GAMES,
    label: 'Jogos',
    needCredentials: false,
    url: '/jogos',
  },
  {
    id: ROUTE_ID.BET,
    label: 'Apostar',
    needCredentials: true,
    url: '/apostar',
  },
  { id: ROUTE_ID.EXTRAS, label: 'Extras', needCredentials: false, url: '/extras' },
  { id: ROUTE_ID.RANKING, label: 'Ranking', needCredentials: false, url: '/ranking' },
  { id: ROUTE_ID.RULES, label: 'Regras', needCredentials: false, url: '/regras' },
  { id: ROUTE_ID.TEAMS, label: 'Equipes', needCredentials: false, url: '/equipes' },
];
