import type { IExtraBet, IExtraBetBet, IExtrasFetch, ITeamWithExtras } from '@/stores/extraBet.types';

import { useActiveProfileStore } from '@/stores/activeProfile';
import { useConfigurationStore } from '@/stores/configuration';
import { useExtraBetStore } from '@/stores/extraBet';
import { isFulfilled, isRejected } from '@/util/promiseCheck';

import ApiService from './api_request';

export default class ExtraBetService {
  private activeProfileStore;
  private apiRequest;
  private configurationStore;
  private extraBetStore;

  constructor() {
    this.apiRequest = new ApiService();
    this.extraBetStore = useExtraBetStore();
    this.configurationStore = useConfigurationStore();
    this.activeProfileStore = useActiveProfileStore();
  }

  public async fetch() {
    const activeProfile = this.activeProfileStore.activeProfile;
    this.extraBetStore.setLoading(true);

    try {
      const [extraResponse, extraResultsResponse] = await Promise.allSettled([
        this.apiRequest.get<IExtraBet[]>(`bet/extra/`),
        this.apiRequest.get<IExtraBetBet[]>(`bet/extra/results`),
      ]);

      if (isRejected(extraResponse) || isRejected(extraResultsResponse)) {
        throw new Error('Falha ao buscar apostas extras');
      }

      const extraBets = isFulfilled(extraResponse) ? extraResponse.value : [];
      const extraBetsResults = isFulfilled(extraResultsResponse) ? extraResultsResponse.value : [];

      let loggedUserBets: IExtraBet | null = null;
      const otherUserBets: IExtraBet[] = [];
      extraBets.forEach((bet) => {
        if (bet.user.id === activeProfile?.id) {
          loggedUserBets = bet;
        } else {
          otherUserBets.push(bet);
        }
      });

      this.extraBetStore.setLoggedUserBets(loggedUserBets);
      this.extraBetStore.setExtraBetsResults(extraBetsResults.length ? extraBetsResults : null);

      const splittedBetsByTeam = this.splitBetsByTeams(extraBets);
      this.extraBetStore.setAllUsersBetsByTeam(splittedBetsByTeam);

      this.extraBetStore.setLoading(false);
    } catch (error: unknown) {
      this.extraBetStore.setLoading(false);
      this.extraBetStore.setError(new Error(String(error)));
    }
  }

  splitBetsByTeams(extraBets: IExtraBet[]) {
    const teamsWithExtras: ITeamWithExtras[] = [];

    extraBets.forEach((userBet) => {
      userBet.bets.forEach((bet) => {
        bet.teams.forEach((team) => {
          const existingTeam = teamsWithExtras.find((t) => t.team.id === team.id);
          if (existingTeam) {
            existingTeam.bets.push({
              type: bet.type,
              user: userBet.user,
            });
          } else {
            teamsWithExtras.push({
              bets: [
                {
                  type: bet.type,
                  user: userBet.user,
                },
              ],
              team,
            });
          }
        });
      });
    });

    return teamsWithExtras;
  }

  public async update(
    updateObj: { [n: string]: null | number | number[] },
    callback?: (isSuccess: boolean, error?: Error) => void,
  ) {
    this.extraBetStore.setUpdating(true);

    try {
      await this.apiRequest.post<IExtrasFetch>(`bet/update/extra`, updateObj);

      this.extraBetStore.setUpdating(false);
      if (callback) {
        callback(true);
      }
    } catch (error: unknown) {
      this.extraBetStore.setUpdating(false);
      if (callback) {
        callback(false, error as Error);
      }
    }
  }
}
