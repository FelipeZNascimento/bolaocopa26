<template>
  <PrimePanel style="width: 100%" header="Resultado da Aposta" toggleable>
    <p>
      <span style="color: var(--bolao-c-mint); font-weight: bold">Na Mosca</span>: acertar o vencedor e a margem de
      vitória.
    </p>
    <p>
      <span style="color: var(--bolao-c-blue); font-weight: bold">Vencedor Correto</span>: acertar o vencedor mas errar
      a margem de vitória.
    </p>
    <p>
      <span style="color: var(--bolao-c-red); font-weight: bold">Errar o vencedor</span>: zero pontos. Sem choro nem
      vela nem fica amarela gravada com o nome dela.
    </p>
    <p style="padding-top: var(--l-spacing)">
      Caso uma partida termine em empate, um acerto parcial é concedido a todos que apostaram em vitória difícil.
    </p>
  </PrimePanel>
  <PrimePanel style="width: 100%" header="Quanto vale uma aposta" toggleable>
    <p style="padding-bottom: var(--l-spacing)">
      Ao longo da temporada, as apostas mudam de valor. Quanto mais importante uma partida, mais pontos tem uma aposta
      correta.
    </p>
    <PrimeDataTable showGridlines rowHover :value="tableScores">
      <PrimeColumn field="text" header="Fase"></PrimeColumn>
      <PrimeColumn field="valueBullseye" header="Mosca" style="color: var(--bolao-c-mint); font-weight: bold">
      </PrimeColumn>
      <PrimeColumn field="valueWinner" header="Vencedor" style="color: var(--bolao-c-blue); font-weight: bold">
      </PrimeColumn>
    </PrimeDataTable>
  </PrimePanel>
  <PrimePanel style="width: 100%" header="Exemplos" toggleable>
    <p>
      <span style="font-weight: bold">Fácil</span>: quando o vencedor tem
      <span style="font-weight: bold">mais de 7 pontos</span> de vantagem sobre o perdedor.
    </p>
    <p style="padding-bottom: var(--l-spacing)">
      No exemplo abaixo, os Packers tem 20 pontos de vantagem. Ou seja, uma vitória fácil.
    </p>
    <MatchComponent :match="easyMatch" isDemo :isGridMode="false" />
    <p style="padding-top: var(--l-spacing)">
      <span style="font-weight: bold">Difícil</span>: quando o time vencedor tem
      <span style="font-weight: bold">7 pontos ou menos</span>
      de vantagem sobre o perdedor.
    </p>
    <p style="padding-bottom: var(--l-spacing)">
      No exemplo abaixo, os Packers tem apenas 4 pontos de vantagem sobre os Bears. Ou seja, uma vitória difícil.
    </p>
    <MatchComponent :match="hardMatch" isDemo :isGridMode="false" />
  </PrimePanel>
</template>
<script setup lang="ts">
import type { IMatch } from '@/stores/matches.types';

import MatchComponent from '@/components/Match/MatchComponent.vue';

const tableScores = [
  {
    text: 'Temporada Regular',
    valueBullseye: '10',
    valueWinner: '05',
  },
  {
    text: 'Wild Card e Divisional Round',
    valueBullseye: '20',
    valueWinner: '10',
  },
  {
    text: 'Finais de Conferência',
    valueBullseye: '40',
    valueWinner: '20',
  },
  {
    text: 'Super Bowl',
    valueBullseye: '80',
    valueWinner: '40',
  },
];

const easyMatch: IMatch = {
  away: {
    alias: 'Bears',
    background: '#00123f',
    code: 'CHI',
    conference: 'NFC',
    division: 'North',
    foreground: '#f26522',
    id: 6,
    name: 'Chicago Bears',
    possession: true,
    score: 17,
    winLosses: '0-0',
  },
  bets: [],
  clock: '00:00',
  home: {
    alias: 'Packers',
    background: '#1e3630',
    code: 'GB',
    conference: 'NFC',
    division: 'North',
    foreground: '#feb60e',
    id: 12,
    name: 'Green Bay Packers',
    possession: true,
    score: 37,
    winLosses: '0-0',
  },
  homeTeamOdds: '-2.5',
  id: 4455,
  loggedUserBets: null,
  overUnder: 'o47.5',
  status: 0,
  timestamp: 1757276700,
};

const hardMatch: IMatch = {
  away: {
    alias: 'Bears',
    background: '#00123f',
    code: 'CHI',
    conference: 'NFC',
    division: 'North',
    foreground: '#f26522',
    id: 6,
    name: 'Chicago Bears',
    possession: true,
    score: 13,
    winLosses: '0-0',
  },
  bets: [],
  clock: '00:00',
  home: {
    alias: 'Packers',
    background: '#1e3630',
    code: 'GB',
    conference: 'NFC',
    division: 'North',
    foreground: '#feb60e',
    id: 12,
    name: 'Green Bay Packers',
    possession: true,
    score: 17,
    winLosses: '0-0',
  },
  homeTeamOdds: '-2.5',
  id: 4455,
  loggedUserBets: null,
  overUnder: 'o47.5',
  status: 0,
  timestamp: 1757276700,
};
</script>
<style lang="scss" scoped></style>
