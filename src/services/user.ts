import { sha1 } from 'js-sha1';

import type { IUser } from '@/stores/activeProfile.types';

import { useActiveProfileStore } from '@/stores/activeProfile';
import { useConfigurationStore } from '@/stores/configuration';
import { useExtraBetStore } from '@/stores/extraBet';
import { useMatchesStore } from '@/stores/matches';
import { useRankingStore } from '@/stores/ranking';

import ApiService from './api_request';

export default class UserService {
  private activeProfileStore;
  private apiRequest;
  private configurationStore;
  private extraBetStore;
  private matchesStore;
  private rankingStore;

  constructor() {
    this.apiRequest = new ApiService();
    this.activeProfileStore = useActiveProfileStore();
    this.rankingStore = useRankingStore();
    this.extraBetStore = useExtraBetStore();
    this.matchesStore = useMatchesStore();
    this.configurationStore = useConfigurationStore();
  }

  public async forgotPassword(email: string, callback: (isSuccess: boolean) => void) {
    this.activeProfileStore.setLoading(true);
    const forgotPasswordObject = {
      email,
    };

    try {
      const response = await this.apiRequest.post<IUser>('user/forgot-password', forgotPasswordObject);
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

  public async login(email: string, password: string, callback: (isSuccess: boolean) => void) {
    this.activeProfileStore.setLoading(true);
    const encryptedPassword = sha1(password).toString();
    const loginObject = {
      email,
      password: encryptedPassword,
    };

    try {
      const response = await this.apiRequest.post<IUser>('user/login', loginObject);
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

  public async logout() {
    this.activeProfileStore.setLoading(true);
    try {
      await this.apiRequest.get<IUser>('user/logout');
      this.activeProfileStore.setLoading(false);
      this.activeProfileStore.setActiveProfile(null);
      this.activeProfileStore.setError(null);
      this.rankingStore.setInitialState();
      this.configurationStore.setInitialState();
      this.matchesStore.resetLoggedUserBets();
      this.extraBetStore.resetLoggedUserBets();
    } catch (error: any) {
      this.activeProfileStore.setLoading(false);
      this.activeProfileStore.setError(new Error(error));
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
      const response = await this.apiRequest.post<IUser>('user/register', registerObject);
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

  public async updatePassword(currentPassword: string, newPassword: string, callback: (isSuccess: boolean) => void) {
    this.activeProfileStore.setLoading(true);

    try {
      const updatedProfile = {
        currentPassword: sha1(currentPassword).toString(),
        newPassword: sha1(newPassword).toString(),
      };

      await this.apiRequest.post<IUser>('user/update-password', updatedProfile);
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
      const response = await this.apiRequest.post<IUser>('user/update-password', resetPasswordObject);
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
      const response = await this.apiRequest.post<IUser>('user/update-profile', updatedProfile);
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
