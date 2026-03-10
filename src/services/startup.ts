import type { IUser } from '@/stores/activeProfile.types';
import type { TRankingPositionValue, TGamesViewValue } from '@/stores/configuration.types';
import type { IConferenceTeams } from '@/stores/extraBet.types';

import { useActiveProfileStore } from '@/stores/activeProfile';
import { useConfigurationStore } from '@/stores/configuration';
import { useExtraBetStore } from '@/stores/extraBet';
import { isFulfilled, isRejected } from '@/util/promiseCheck';

import ApiService from './api_request';

export interface InitializeObj {
  currentEdition: number;
  currentRound: number;
  editionStart: string;
}

export interface TeamByConferenceAndDivision {
  AFC: IConferenceTeams;
  NFC: IConferenceTeams;
}

export default class StartupService {
  private activeProfileStore;
  private apiRequest;
  private configurationStore;
  private extraBetStore;

  constructor() {
    this.apiRequest = new ApiService();
    this.activeProfileStore = useActiveProfileStore();
    this.configurationStore = useConfigurationStore();
    this.extraBetStore = useExtraBetStore();
  }

  public async initialize(callback: (isSuccess: boolean) => void) {
    this.initializeLocalStoragePreferences();
    this.activeProfileStore.setLoading(true);
    this.configurationStore.setLoading(true);
    this.extraBetStore.setLoading(true);
    try {
      const [activeProfileResponse, seasonResponse, teamResponse] = await Promise.allSettled([
        this.apiRequest.get<IUser>('user/activeProfile'),
        this.apiRequest.get<InitializeObj>('season/current'),
        this.apiRequest.get<TeamByConferenceAndDivision>('team/all/'),
      ]);

      if (isRejected(activeProfileResponse) || isRejected(seasonResponse) || isRejected(teamResponse)) {
        throw new Error('Falha ao inicializar a aplicação');
      }

      const loggedUser = isFulfilled(activeProfileResponse) ? activeProfileResponse.value : null;
      const seasonData = isFulfilled(seasonResponse) ? seasonResponse.value : null;
      const teamByConferenceAndDivision = isFulfilled(teamResponse) ? teamResponse.value : null;

      // Set Active Profile store properties
      this.activeProfileStore.setLoading(false);
      this.activeProfileStore.setActiveProfile(loggedUser);

      // Set Configuration store properties
      this.configurationStore.setLoading(false);
      if (seasonData) {
        this.configurationStore.setCurrentEdition(seasonData.currentEdition);
        // this.configurationStore.setCurrentRound(seasonData.currentRound);
        this.configurationStore.setCurrentRound(1);
        this.configurationStore.setSelectedRound(1);
        this.configurationStore.setEditionStart(parseInt(seasonData.editionStart));
        this.configurationStore.setError(null);
      }

      // Set Extras store properties
      this.extraBetStore.setLoading(false);
      if (teamByConferenceAndDivision) {
        this.extraBetStore.setAfcTeams(teamByConferenceAndDivision.AFC);
        this.extraBetStore.setNfcTeams(teamByConferenceAndDivision.NFC);
      }

      return callback(true);
    } catch (error: any) {
      this.activeProfileStore.setLoading(false);
      this.configurationStore.setLoading(false);
      this.extraBetStore.setLoading(false);
      this.configurationStore.setError(new Error(error));
      return callback(false);
    }
  }

  initializeLocalStoragePreferences() {
    const themePreference = localStorage.getItem('theme-preference');
    const gamesViewPreference = localStorage.getItem('results-view') as TGamesViewValue;
    const rankingPositionPreference = localStorage.getItem('ranking-position') as TRankingPositionValue;

    if (rankingPositionPreference) {
      this.configurationStore.setRankingPosition(rankingPositionPreference);
    } else {
      localStorage.setItem('ranking-position', 'active');
    }

    if (gamesViewPreference) {
      this.configurationStore.setGamesView(gamesViewPreference);
    } else {
      localStorage.setItem('results-view', 'grid');
    }

    if (themePreference) {
      document.documentElement.setAttribute('data-theme', themePreference);
      if (themePreference === 'light') {
        this.configurationStore.setTheme('light');
        document.documentElement.classList.remove('dark-mode');
      } else {
        this.configurationStore.setTheme('dark');
        document.documentElement.classList.add('dark-mode');
      }
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.configurationStore.setTheme('dark');
    } else {
      this.configurationStore.setTheme('light');
    }
  }
}
