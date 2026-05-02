import type {
  IExtraAllBets,
  IExtraResults,
  IPlayerWithExtras,
  ITeamWithExtras,
  IUserWithExtras,
} from '@/stores/extraBet.types';

import { EXTRA_BETS_VALUES } from '@/constants/bets';
import { useExtraBetStore } from '@/stores/extraBet';
import { isFulfilled, isRejected } from '@/util/promiseCheck';

import ApiService from './api_request';

export default class ExtraBetService {
  private apiRequest;
  private extraBetStore;

  constructor() {
    this.apiRequest = new ApiService();
    this.extraBetStore = useExtraBetStore();
  }

  public async fetch() {
    this.extraBetStore.setLoading(true);

    try {
      const [extraResponse, extraResultsResponse] = await Promise.allSettled([
        this.apiRequest.get<{activeProfileBets: IExtraAllBets[]; bets: IExtraAllBets[],}>(`bet/extra/`),
        this.apiRequest.get<IExtraResults[]>(`bet/extra/results`),
      ]);

      if (isRejected(extraResponse) || isRejected(extraResultsResponse)) {
        throw new Error('Falha ao buscar apostas extras');
      }

      console.log(extraResponse.value);
      const extraBets = isFulfilled(extraResponse) ? extraResponse.value.bets : [];
      const activeProfileBets = isFulfilled(extraResponse) ? extraResponse.value.activeProfileBets : [];
      const extraBetsResults = isFulfilled(extraResultsResponse) ? extraResultsResponse.value : [];

      this.extraBetStore.setActiveProfileBets(activeProfileBets.map((betType) => betType.bets).flat().sort((a, b) => (a.extraType > b.extraType ? 1 : -1)));
      this.extraBetStore.setResults(extraBetsResults.sort((a, b) => (a.extraType > b.extraType ? 1 : -1)));

      const splittedBetsByTeam = this.splitBetsByTeams(
        extraBets.filter((betType) => betType.extraType !== EXTRA_BETS_VALUES.TOP_SCORER),
      );
      const topScorerBetsByPlayer = this.splitBetsByPlayers(
        extraBets.filter((betType) => betType.extraType === EXTRA_BETS_VALUES.TOP_SCORER),
      );

      const splittedBetsByUser = this.splitBetsByUsers(extraBets);
      this.extraBetStore.setTopScorerBetsByPlayer(topScorerBetsByPlayer);
      this.extraBetStore.setExtraBetsByTeam(splittedBetsByTeam);
      this.extraBetStore.setExtraBetsByUser(splittedBetsByUser);

      this.extraBetStore.setLoading(false);
    } catch (error: unknown) {
      this.extraBetStore.setLoading(false);
      this.extraBetStore.setError(new Error(String(error)));
    }
  }

  splitBetsByPlayers(extraBets: IExtraAllBets[]) {
    console.log(extraBets);
    const playersWithExtras: IPlayerWithExtras[] = [];

    extraBets.forEach((extraBetType) => {
      extraBetType.bets.forEach((bet) => {
        const existingPlayer = playersWithExtras.find((p) => p.player.id === bet.player.id);
        if (existingPlayer) {
          existingPlayer.bets.push(bet);
        } else {
          playersWithExtras.push({
            bets: [bet],
            player: bet.player,
            team: bet.team,
          });
        }
      });
    });

    return playersWithExtras;
  }

  splitBetsByTeams(extraBets: IExtraAllBets[]) {
    const teamsWithExtras: ITeamWithExtras[] = [];

    extraBets.forEach((extraBetType) => {
      extraBetType.bets.forEach((bet) => {
        const existingTeam = teamsWithExtras.find((t) => t.team.id === bet.team.id);
        if (existingTeam) {
          existingTeam.bets.push(bet);
        } else {
          teamsWithExtras.push({
            bets: [bet],
            team: bet.team,
          });
        }
      });
    });

    return teamsWithExtras;
  }

  splitBetsByUsers(extraBets: IExtraAllBets[]) {
    const usersWithExtras: IUserWithExtras[] = [];

    extraBets.forEach((extraBetType) => {
      extraBetType.bets.forEach((bet) => {
        const existingUser = usersWithExtras.find((u) => u.user.id === bet.user.id);
        if (existingUser) {
          existingUser.bets.push(bet);
        } else {
          usersWithExtras.push({
            bets: [bet],
            user: bet.user,
          });
        }
      });
    });

    return usersWithExtras;
  }

  public async update(
    updateObj: { extraType: number; teamId: null | number },
    callback?: (isSuccess: boolean, error?: Error) => void,
  ) {
    this.extraBetStore.setUpdating(true);

    try {
      await this.apiRequest.post(`bet/extra/update`, updateObj);

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
