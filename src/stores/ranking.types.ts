import type { IUser } from './activeProfile.types';

export interface IRankingLine {
  betsCount: number;
  matchesCount: number;
  score: {
    accumulatedBullseye: number;
    accumulatedPoints: number;
    accumulatedPosition: number;
    bullseye: number;
    extra: number;
    percentage: string;
    total: number;
    winner: number;
  };
  user: IRankingUser;
}
export interface IRankingResponse {
  seasonRanking: IRankingLine[];
  weeklyRanking: IWeeklyRanking[];
}

export interface IRankingUser extends IUser {
  isOnline: boolean;
  position: number;
  previousPosition: number;
  totalBets: number;
  totalBullseye: number;
  totalExtras: number;
  totalMatches: number;
  totalPercentage: string;
  totalPoints: number;
  totalWinners: number;
}

export interface IWeeklyRanking {
  isLocked: boolean;
  ranking: IRankingLine[];
  week: number;
}
