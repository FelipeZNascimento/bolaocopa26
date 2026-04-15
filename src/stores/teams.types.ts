export interface IClub {
  country: ICountry;
  id: number;
  name: string;
}

export interface IConfederation {
  abbreviation: string;
  id: number;
  name: string;
  nameEn: string;
}

export interface ICountry {
  abbreviation: string;
  abbreviationEn: string;
  id: number;
  isoCode: string;
  name: string;
  nameEn: string;
}
export interface IFifaInfo {
  id: number;
  pictureId: string;
}

export interface IPlayer {
  club: IClub;
  dateOfBirth: string;
  fifa: IFifaInfo;
  height: number;
  id: number;
  name: string;
  number: number;
  position: IPosition;
  team: ITeam;
}

export interface IPosition {
  abbreviation: string;
  abbreviationEn: string;
  description: string;
  descriptionEn: string;
  id: number;
}

export interface ITeam {
  abbreviation: string;
  abbreviationEn: string;
  colors: string[];
  colorsRaw: string;
  confederation: IConfederation;
  group: string;
  id: number;
  idConfederation: number;
  idFifa: number;
  isoCode: string;
  name: string;
  nameEn: string;
  players: IPlayer[];
}
