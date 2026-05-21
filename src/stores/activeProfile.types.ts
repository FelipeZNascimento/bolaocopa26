export interface IUser {
  admin: boolean;
  email?: string;
  extrasCount?: number;
  favorites: number[];
  id: number;
  isActive: boolean;
  isOnline: boolean;
  name: string;
  nickname: string;
  timestamp: number;
}
