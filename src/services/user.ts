import { sha1 } from 'js-sha1';

import type { IUser } from '@/stores/activeProfile.types';

import { faIconsList } from '@/constants/font-awesome';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useConfigurationStore } from '@/stores/configuration';
import { useExtraBetStore } from '@/stores/extraBet';
import { useMatchesStore } from '@/stores/matches';
import { useRankingStore } from '@/stores/ranking';
import { randomHexColorGenerator } from '@/util/colorGenerator';

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
    username: string,
    callback: (isSuccess: boolean) => void,
  ) {
    this.activeProfileStore.setLoading(true);
    const encryptedPassword = sha1(password).toString();
    const randomIcon = faIconsList[Math.floor(Math.random() * faIconsList.length)];
    const randomColor = randomHexColorGenerator();

    const registerObject = {
      color: randomColor,
      email,
      fullName: name,
      icon: randomIcon,
      name: username,
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

    const updatedProfile = {
      currentPassword: sha1(currentPassword).toString(),
      newPassword: sha1(newPassword).toString(),
    };

    try {
      await this.apiRequest.post<IUser>('user/password', updatedProfile);
      this.activeProfileStore.setLoading(false);
      this.activeProfileStore.setError(null);

      return callback(true);
    } catch (error: unknown) {
      this.activeProfileStore.setLoading(false);
      this.activeProfileStore.setError(error as Error);
      return callback(false);
    }
  }

  public async updatePreferences(newColor: string, newIcon: string, callback: (isSuccess: boolean) => void) {
    this.activeProfileStore.setLoading(true);
    const updatedProfile = {
      color: this.activeProfileStore.activeProfile?.color,
      icon: newIcon || this.activeProfileStore.activeProfile?.icon,
    };

    try {
      const response = await this.apiRequest.post<IUser>('user/preferences/', updatedProfile);
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

  public async updateProfile(callback: (isSuccess: boolean) => void, name: string, username: string) {
    this.activeProfileStore.setLoading(true);

    const updatedProfile = {
      color: this.activeProfileStore.activeProfile?.color,
      email: this.activeProfileStore.activeProfile?.email,
      icon: this.activeProfileStore.activeProfile?.icon,
      name: name,
      username: username,
    };

    try {
      const response = await this.apiRequest.post<IUser>('user/profile', updatedProfile);
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
