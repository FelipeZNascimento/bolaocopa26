export interface IUser {
  admin: boolean;
  email?: string;
  extrasCount?: number;
  favorites: number[];
  id: number;
  isActive: boolean;
  isOnline: boolean;
  locale: string;
  name: string;
  nickname: string;
  timestamp: number;
}
