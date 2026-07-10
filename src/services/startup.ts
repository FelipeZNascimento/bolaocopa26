import type { IUser } from '@/stores/activeProfile.types';
import type {
  TMatchListSorting,
  TRankingPositionValue,
  TThemeValue,
  TViewBetOptionValue,
  TViewNeymarValue,
} from '@/stores/configuration.types';
import type { IMatch } from '@/stores/matches.types';
import type { IRankingResponse } from '@/stores/ranking.types';
import type { IPlayer, ITeam } from '@/stores/teams.types';

import { detectLocale, LOCALE_STORAGE_KEY } from '@/i18n';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { type TServerHealth, useAdminStore } from '@/stores/admin';
import { useClockStore } from '@/stores/clock';
import { useConfigurationStore } from '@/stores/configuration';
import { useExtraBetStore } from '@/stores/extraBet';
import { useMatchesStore } from '@/stores/matches';
import { useRankingStore } from '@/stores/ranking';
import { useTeamsStore } from '@/stores/teams';
import { isFulfilled, isRejected } from '@/util/promiseCheck';

import ApiService from './api_request';

export interface InitializeObj {
  currentEdition: number;
  currentRound: number;
  editionStart: string;
}

export default class StartupService {
  private activeProfileStore;
  private adminStore;
  private apiRequest;
  private clockStore;
  private configurationStore;
  private extraBetStore;
  private matchesStore;
  private rankingStore;
  private teamsStore;

  constructor() {
    this.apiRequest = new ApiService();
    this.adminStore = useAdminStore();
    this.activeProfileStore = useActiveProfileStore();
    this.configurationStore = useConfigurationStore();
    this.extraBetStore = useExtraBetStore();
    this.teamsStore = useTeamsStore();
    this.matchesStore = useMatchesStore();
    this.rankingStore = useRankingStore();
    this.clockStore = useClockStore();
  }

  cacheFlush() {
    this.apiRequest.get('admin/flush', undefined, { retries: 3 });
  }

  public async initialize() {
    this.clockStore.startClock();
    this.initializeLocalStoragePreferences();
    this.activeProfileStore.setLoading(true);
    this.configurationStore.setLoading(true);
    this.extraBetStore.setLoading(true);
    try {
      const [activeProfileResponse, editionResponse, teamResponse, playerResponse, matchesResponse, rankingResponse] =
        await Promise.allSettled([
          this.apiRequest.get<IUser>('user/activeProfile', undefined, { retries: 3 }),
          this.apiRequest.get<InitializeObj>('edition/current', undefined, { retries: 3 }),
          this.apiRequest.get<ITeam[]>('team/all/', undefined, { retries: 3 }),
          this.apiRequest.get<IPlayer[]>('team/players/', undefined, { retries: 3 }),
          this.apiRequest.get<{ liveMatches: IMatch[]; matches: IMatch[]; nextMatches: IMatch[] }>(
            `match/`,
            undefined,
            {
              retries: 3,
            },
          ),
          this.apiRequest.get<IRankingResponse>(`ranking/edition/`),
        ]);

      if (
        isRejected(activeProfileResponse) ||
        isRejected(editionResponse) ||
        isRejected(teamResponse) ||
        isRejected(playerResponse) ||
        isRejected(matchesResponse) ||
        isRejected(rankingResponse)
      ) {
        throw new Error('Falha ao inicializar a aplicação');
      }

      const loggedUser = isFulfilled(activeProfileResponse) ? activeProfileResponse.value : null;
      const seasonData = isFulfilled(editionResponse) ? editionResponse.value : null;
      const teamsData = isFulfilled(teamResponse) ? teamResponse.value : [];
      const playersData = isFulfilled(playerResponse) ? playerResponse.value : [];
      const matchesData = isFulfilled(matchesResponse) ? matchesResponse.value : null;
      const rankingData = isFulfilled(rankingResponse) ? rankingResponse.value : null;

      // Set Teams store properties
      this.teamsStore.setTeams(teamsData);

      // Set Players store properties
      this.teamsStore.setPlayers(playersData);

      // Set Active Profile store properties
      this.activeProfileStore.setLoading(false);
      this.activeProfileStore.setActiveProfile(loggedUser);

      // Sync localStorage locale to DB for logged-in users
      if (loggedUser) {
        const locale = localStorage.getItem(LOCALE_STORAGE_KEY) ?? 'pt-BR';
        this.apiRequest.post('user/locale', { locale }).catch(console.error);
      }

      // Set Configuration store properties
      this.configurationStore.setLoading(false);
      if (seasonData) {
        this.configurationStore.setCurrentEdition(seasonData.currentEdition);
        this.configurationStore.setCurrentRound(seasonData.currentRound);
        this.configurationStore.setSelectedRound(seasonData.currentRound);
        this.configurationStore.setEditionStart(parseInt(seasonData.editionStart));
        this.configurationStore.setError(null);
      }

      // Set Extras store properties
      this.extraBetStore.setLoading(false);

      // Set Matches store properties
      if (matchesData) {
        this.matchesStore.setMatches(matchesData.matches);
        this.matchesStore.setLiveMatches(matchesData.liveMatches);
        this.matchesStore.setNextMatches(matchesData.nextMatches);

        this.matchesStore.setLoading(false);
        this.matchesStore.setError(null);
      }

      if (rankingData) {
        this.rankingStore.setEditionRankingWithoutExtras(rankingData.editionWithoutExtras);
        this.rankingStore.setEditionRanking(rankingData.edition);
        this.rankingStore.setRounds(rankingData.round);
        this.rankingStore.setErrorSeason(null);
      }

      return;
    } catch (error: unknown) {
      this.activeProfileStore.setLoading(false);
      this.configurationStore.setLoading(false);
      this.extraBetStore.setLoading(false);
      console.error('[StartupService.initialize]', error);
      this.configurationStore.setError(new Error(error instanceof Error ? error.message : String(error)));
      return;
    }
  }

  initializeLocalStoragePreferences() {
    const themePreference = localStorage.getItem('theme-preference');
    const rankingPositionPreference = localStorage.getItem('ranking-position') as TRankingPositionValue;
    const matchListSortingPreference = localStorage.getItem('match-list-sorting') as TMatchListSorting;
    const viewBetOptionPreference = localStorage.getItem('view-bet-option') as TViewBetOptionValue;
    const neymarVisibilityPreference = localStorage.getItem('view-neymar-option') as TViewNeymarValue;
    const localePreference = detectLocale(); // This will also validate the locale against supported ones

    this.configurationStore.setLanguage(localePreference as 'en' | 'pt-BR');
    localStorage.setItem(LOCALE_STORAGE_KEY, localePreference);

    if (matchListSortingPreference) {
      this.configurationStore.setMatchListSorting(matchListSortingPreference);
    } else {
      localStorage.setItem('match-list-sorting', 'group');
    }

    if (rankingPositionPreference) {
      this.configurationStore.setRankingPosition(rankingPositionPreference);
    } else {
      localStorage.setItem('ranking-position', 'active');
    }

    if (viewBetOptionPreference) {
      this.configurationStore.setViewBetOption(viewBetOptionPreference);
    } else {
      localStorage.setItem('view-bet-option', 'viewBets');
    }

    if (neymarVisibilityPreference) {
      this.configurationStore.setNeymarVisibility(neymarVisibilityPreference);
    } else {
      localStorage.setItem('view-neymar-option', 'viewNeymar');
    }

    if (themePreference) {
      this.configurationStore.setTheme(themePreference as TThemeValue);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.configurationStore.setTheme('dark');
    } else {
      this.configurationStore.setTheme('light');
    }
  }

  async serverHealth() {
    const response: TServerHealth = await this.apiRequest.get('app/health', undefined, { retries: 3 });
    this.adminStore.setServerHealth(response);
  }
}
