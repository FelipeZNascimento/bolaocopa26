export enum ROUTE_ID {
  HOME,
  BET,
  RESULTS,
  EXTRAS,
  RECORDS,
  RANKING,
  RULES,
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
    id: ROUTE_ID.RESULTS,
    label: 'Resultados',
    needCredentials: false,
    url: '/resultados',
  },
  {
    id: ROUTE_ID.BET,
    label: 'Apostar',
    needCredentials: true,
    url: '/apostar',
  },
  { id: ROUTE_ID.EXTRAS, label: 'Extras', needCredentials: true, url: '/extras' },
  // { id: ROUTE_ID.RECORDS, label: 'Records', url: '/records', needCredentials: false },
  { id: ROUTE_ID.RULES, label: 'Regras', needCredentials: false, url: '/regras' },
];
