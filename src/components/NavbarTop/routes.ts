export enum ROUTE_ID {
  ADMIN,
  HOME,
  BET,
  MATCHES,
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
  mobileOnly?: boolean;
  name: string;
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
    id: ROUTE_ID.HOME,
    name: 'home',
    needCredentials: false,
    url: '/',
  },
  {
    id: ROUTE_ID.MATCHES,
    name: 'matches',
    needCredentials: false,
    url: '/partidas',
  },
  {
    id: ROUTE_ID.EXTRAS,
    name: 'extras',
    needCredentials: false,
    url: '/extras',
  },
  {
    id: ROUTE_ID.RANKING,
    mobileOnly: true,
    name: 'ranking',
    needCredentials: false,
    url: '/ranking',
  },
  {
    id: ROUTE_ID.RULES,
    name: 'rules',
    needCredentials: false,
    url: '/regras',
  },
  {
    id: ROUTE_ID.TEAMS,
    name: 'teams',
    needCredentials: false,
    url: '/equipes',
  },
];
