import { sha1 } from 'js-sha1';

import type { IUser } from '@/stores/activeProfile.types';

import { useActiveProfileStore } from '@/stores/activeProfile';
import { useAdminStore } from '@/stores/admin';
import { useConfigurationStore } from '@/stores/configuration';
import { useExtraBetStore } from '@/stores/extraBet';
import { useMatchesStore } from '@/stores/matches';
import { useRankingStore } from '@/stores/ranking';

import ApiService from './api_request';
import StartupService from './startup';

export default class UserService {
  private activeProfileStore;
  private adminStore;
  private apiService;
  private configurationStore;
  private extraBetStore;
  private matchesStore;
  private rankingStore;
  private startupService;

  constructor() {
    this.apiService = new ApiService();
    this.startupService = new StartupService();
    this.adminStore = useAdminStore();
    this.activeProfileStore = useActiveProfileStore();
    this.rankingStore = useRankingStore();
    this.extraBetStore = useExtraBetStore();
    this.matchesStore = useMatchesStore();
    this.configurationStore = useConfigurationStore();
  }

  public async activateUser(userId: number, newStatus: boolean, callback: (isSuccess: boolean) => void) {
    const activeProfile = this.activeProfileStore.activeProfile;
    if (!activeProfile || !activeProfile.admin) {
      console.error('Unauthorized: Only admins can activate users.');
      return callback(false);
    }

    this.adminStore.setLoading(true);

    try {
      const response = await this.apiService.post<IUser[]>('user/activate', { newStatus, userId });
      this.adminStore.setUsers(response);
      this.adminStore.setLoading(false);
      return callback(true);
    } catch (error: unknown) {
      console.error('Failed to activate user:', error);
      this.adminStore.setError(error as Error);
      this.adminStore.setLoading(false);
      return callback(false);
    }
  }

  public async deleteUser(userId: number, callback: (isSuccess: boolean) => void) {
    const activeProfile = this.activeProfileStore.activeProfile;
    if (!activeProfile || !activeProfile.admin) {
      console.error('Unauthorized: Only admins can delete users.');
      return callback(false);
    }

    this.adminStore.setLoading(true);

    try {
      const response = await this.apiService.post<IUser[]>('user/delete-from-edition', { userId });
      this.adminStore.setUsers(response);
      this.adminStore.setLoading(false);
      return callback(true);
    } catch (error: unknown) {
      console.error('Failed to delete user:', error);
      this.adminStore.setError(error as Error);
      this.adminStore.setLoading(false);
      return callback(false);
    }
  }

  public async forgotPassword(email: string, callback: (isSuccess: boolean) => void) {
    this.activeProfileStore.setLoading(true);
    const forgotPasswordObject = { email };

    try {
      const response = await this.apiService.post<IUser>('user/forgot-password', forgotPasswordObject);
      this.activeProfileStore.setLoading(false);
      this.activeProfileStore.setActiveProfile(response);
      this.activeProfileStore.setError(null);
      return callback(true);
    } catch (error: unknown) {
      this.activeProfileStore.setLoading(false);
      this.activeProfileStore.setError(error as Error);
      return callback(false);
    }
  }
  public async getAll(callback: (isSuccess: boolean) => void) {
    const activeProfile = this.activeProfileStore.activeProfile;
    if (!activeProfile || !activeProfile.admin) {
      console.error('Unauthorized: Only admins can fetch all users.');
      return callback(false);
    }

    this.adminStore.setLoading(true);

    try {
      const response = await this.apiService.get<IUser[]>('user/all');
      this.adminStore.setUsers(response);
      this.adminStore.setLoading(false);
      return callback(true);
    } catch (error: unknown) {
      console.error('Failed to fetch users:', error);
      this.adminStore.setError(error as Error);
      this.adminStore.setLoading(false);
      return callback(false);
    }
  }

  public isFavorite(targetUserId: number): boolean {
    const activeProfile = this.activeProfileStore.activeProfile;
    return activeProfile?.favorites.includes(targetUserId) ?? false;
  }

  public async login(email: string, password: string, callback: (isSuccess: boolean) => void) {
    this.activeProfileStore.setLoading(true);
    const encryptedPassword = sha1(password).toString();
    const loginObject = {
      email,
      password: encryptedPassword,
    };

    try {
      const response = await this.apiService.post<IUser>('user/login', loginObject);
      this.activeProfileStore.setLoading(false);
      this.activeProfileStore.setActiveProfile(response);
      this.activeProfileStore.setError(null);
      this.startupService.initialize(() => {}); // Re-initialize to refresh data after password reset

      return callback(true);
    } catch (error: unknown) {
      this.activeProfileStore.setLoading(false);
      this.activeProfileStore.setError(error as Error);
      return callback(false);
    }
  }

  public async logout() {
    this.activeProfileStore.setLoading(true);
    try {
      this.activeProfileStore.setLoading(false);
      this.activeProfileStore.setActiveProfile(null);
      this.activeProfileStore.setError(null);
      this.rankingStore.setInitialState();
      this.configurationStore.setInitialState();
      this.matchesStore.resetLoggedUserBets();
      this.extraBetStore.resetActiveProfileBets();
      await this.apiService.get<IUser>('user/logout');
    } catch (error: unknown) {
      this.activeProfileStore.setLoading(false);
      this.activeProfileStore.setError(new Error(error instanceof Error ? error.message : String(error)));
    }
  }

  public async signup(
    email: string,
    password: string,
    name: string,
    nickname: string,
    callback: (isSuccess: boolean) => void,
  ) {
    this.activeProfileStore.setLoading(true);
    const encryptedPassword = sha1(password).toString();

    const registerObject = {
      email,
      name,
      nickname,
      password: encryptedPassword,
    };

    try {
      const response = await this.apiService.post<IUser>('user/register', registerObject);
      this.activeProfileStore.setLoading(false);
      this.activeProfileStore.setActiveProfile(response);
      this.activeProfileStore.setError(null);

      console.log('User registered successfully:', response);
      return callback(true);
    } catch (error: unknown) {
      this.activeProfileStore.setLoading(false);
      this.activeProfileStore.setError(error as Error);

      return callback(false);
    }
  }

  public async updateFavorites(newFavorites: number[], callback: (isSuccess: boolean) => void) {
    const activeProfile = this.activeProfileStore.activeProfile;
    if (!activeProfile) {
      return false;
    }

    try {
      activeProfile.favorites = newFavorites;
      await this.apiService.post<IUser>('user/update-favorites', { favorites: newFavorites });
      return callback(true);
    } catch (error: unknown) {
      console.error('Failed to update favorites:', error);
      return callback(false);
    }
  }

  public async updatePassword(currentPassword: string, newPassword: string, callback: (isSuccess: boolean) => void) {
    this.activeProfileStore.setLoading(true);

    try {
      const updatedProfile = {
        currentPassword: sha1(currentPassword).toString(),
        newPassword: sha1(newPassword).toString(),
      };

      await this.apiService.post<IUser>('user/update-password', updatedProfile);
      this.activeProfileStore.setLoading(false);
      this.activeProfileStore.setError(null);

      return callback(true);
    } catch (error: unknown) {
      this.activeProfileStore.setLoading(false);
      this.activeProfileStore.setError(error as Error);
      return callback(false);
    }
  }

  public async updatePasswordFromToken(email: string, newPassword: string, token: string) {
    this.activeProfileStore.setLoading(true);

    const resetPasswordObject = {
      email,
      newPassword: sha1(newPassword).toString(),
      token,
    };

    try {
      const response = await this.apiService.post<IUser>('user/update-password', resetPasswordObject);
      this.activeProfileStore.setLoading(false);
      this.activeProfileStore.setError(null);
      return response;
    } catch (error: unknown) {
      this.activeProfileStore.setLoading(false);
      this.activeProfileStore.setError(error as Error);
      throw error; // Re-throw the error so it can be caught by the caller
    }
  }

  public async updateProfile(callback: (isSuccess: boolean) => void, name: string, nickname: string) {
    this.activeProfileStore.setLoading(true);

    const updatedProfile = {
      name: name,
      nickname: nickname,
    };

    try {
      const response = await this.apiService.post<IUser>('user/update-profile', updatedProfile);
      this.activeProfileStore.setLoading(false);
      this.activeProfileStore.setActiveProfile(response);
      this.activeProfileStore.setError(null);

      return callback(true);
    } catch (error: unknown) {
      this.activeProfileStore.setLoading(false);
      this.activeProfileStore.setError(error as Error);
      return callback(false);
    }
  }
}
