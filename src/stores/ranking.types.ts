import type { IUser } from './activeProfile.types';

export interface IRankingLine {
  accumulatedScore: IRankingScore;
  isFinished: boolean;
  round: number;
  score: IRankingScore;
  user: Pick<IUser, 'id' | 'isActive' | 'name' | 'nickname'>;
}

export interface IRankingResponse {
  round: IRoundRanking[];
  season: IRankingLine[];
}

export interface IRankingScore {
  betCount: number;
  exacts: number;
  gameCount: number;
  misses: number;
  oneScores: number;
  percentage: number;
  points: number;
  position: number;
  positionVariation: number;
  winnersOnly: number;
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

export interface IRoundRanking {
  ranking: IRankingLine[];
  round: number;
}
