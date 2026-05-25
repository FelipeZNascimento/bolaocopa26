<template>
  <div class="standings-toolbar">
    <PrimeButton
      variant="text"
      icon="pi pi-refresh"
      :loading="isLoading"
      :label="t('standings.refresh')"
      size="small"
      @click="fetchStandings"
    />
  </div>

  <section
    v-if="isBracketLoading || bracketData.length > 0"
    class="bracket-section"
  >
    <div class="stage-tabs">
      <template v-if="isBracketLoading">
        <PrimeSkeleton
          v-for="i in 6"
          :key="i"
          class="skel-tab"
        />
      </template>
      <template v-else>
        <button
          v-for="stage in sortedStages"
          :key="stage.IdStage"
          class="stage-tab"
          :class="{ 'stage-tab--active': selectedStageId === stage.IdStage }"
          @click="selectedStageId = stage.IdStage"
        >
          {{ getStageName(stage) }}
        </button>
      </template>
    </div>

    <div class="bracket-matches">
      <template v-if="isBracketLoading">
        <div
          v-for="i in 8"
          :key="i"
          class="match-card"
        >
          <PrimeSkeleton class="skel-match" />
        </div>
      </template>
      <div
        v-for="match in selectedStageMatches"
        v-else
        :key="match.IdMatch"
        class="match-card"
      >
        <div class="match-number">{{ match.MatchNumber }}</div>
        <div
          class="match-team"
          :class="{
            'match-team--winner': isMatchWinner(match, match.HomeTeam),
            'match-team--loser': isMatchLoser(match, match.HomeTeam),
          }"
        >
          <img
            v-if="getBracketTeamFlag(match.HomeTeam)"
            class="match-flag"
            :src="`https://assets.omegafox.me/copa/countries_flags/${getBracketTeamFlag(match.HomeTeam)}.png`"
            :alt="match.HomeTeam?.Abbreviation"
          />
          <span class="match-team__name">{{
            match.HomeTeam ? getBracketTeamName(match.HomeTeam) : match.PlaceHolderA
          }}</span>
          <span
            v-if="match.HomeTeamScore !== null"
            class="match-team__score"
            >{{ match.HomeTeamScore }}</span
          >
        </div>
        <div class="match-divider" />
        <div
          class="match-team"
          :class="{
            'match-team--winner': isMatchWinner(match, match.AwayTeam),
            'match-team--loser': isMatchLoser(match, match.AwayTeam),
          }"
        >
          <img
            v-if="getBracketTeamFlag(match.AwayTeam)"
            class="match-flag"
            :src="`https://assets.omegafox.me/copa/countries_flags/${getBracketTeamFlag(match.AwayTeam)}.png`"
            :alt="match.AwayTeam?.Abbreviation"
          />
          <span class="match-team__name">{{
            match.AwayTeam ? getBracketTeamName(match.AwayTeam) : match.PlaceHolderB
          }}</span>
          <span
            v-if="match.AwayTeamScore !== null"
            class="match-team__score"
            >{{ match.AwayTeamScore }}</span
          >
        </div>
        <div
          v-if="match.HomeTeamPenaltyScore !== null"
          class="match-penalties"
        >
          ({{ match.HomeTeamPenaltyScore }}–{{ match.AwayTeamPenaltyScore }} pen)
        </div>
      </div>
    </div>

    <div class="bracket-divider" />
  </section>

  <div class="standings-grid">
    <template v-if="isLoading">
      <div
        v-for="i in 12"
        :key="i"
        class="group-card"
      >
        <PrimeSkeleton class="skel-header" />
        <div class="skel-rows">
          <PrimeSkeleton
            v-for="j in 4"
            :key="j"
            class="skel-row"
          />
        </div>
      </div>
    </template>

    <div
      v-for="group in groupedStandings"
      v-else
      :key="group.name"
      class="group-card"
    >
      <div class="group-card__header">{{ group.name }}</div>
      <table class="standings-table">
        <thead>
          <tr>
            <th class="col-pos">#</th>
            <th class="col-team">{{ t('standings.team') }}</th>
            <th class="col-stat">P</th>
            <th class="col-stat">W</th>
            <th class="col-stat">D</th>
            <th class="col-stat">L</th>
            <th class="col-stat">GD</th>
            <th class="col-pts">Pts</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="entry in group.entries"
            :key="entry.Team.IdTeam"
          >
            <td class="col-pos">
              <span
                class="pos-badge"
                :class="`pos-badge--${entry.Position}`"
                >{{ entry.Position }}</span
              >
            </td>
            <td class="col-team">
              <div class="team-cell">
                <img
                  class="team-flag"
                  :src="`https://assets.omegafox.me/copa/countries_flags/${getTeam(entry.Team.IdTeam)?.isoCode?.toLowerCase() ?? ''}.png`"
                  :alt="entry.Team.Abbreviation"
                />
                <button
                  class="team-btn"
                  @click="selectedTeam = getTeam(entry.Team.IdTeam) ?? null"
                >
                  <span
                    v-if="isSmallMobile"
                    class="team-abbr"
                    >{{ entry.Team.Abbreviation }}</span
                  >
                  <span
                    v-else
                    class="team-name"
                    >{{ getTeamName(entry.Team.IdTeam) }}</span
                  >
                </button>
              </div>
            </td>
            <td class="col-stat">{{ entry.Played }}</td>
            <td class="col-stat">{{ entry.Won }}</td>
            <td class="col-stat">{{ entry.Drawn }}</td>
            <td class="col-stat">{{ entry.Lost }}</td>
            <td
              class="col-stat"
              :class="{ 'gd--positive': entry.GoalsDiference > 0, 'gd--negative': entry.GoalsDiference < 0 }"
            >
              {{ entry.GoalsDiference > 0 ? `+${entry.GoalsDiference}` : entry.GoalsDiference }}
            </td>
            <td class="col-pts">{{ entry.Points }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <TeamDetailsModal
    :is-open="!!selectedTeam"
    :team="selectedTeam"
    :handle-close-modal="() => (selectedTeam = null)"
  />
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type { ITeam } from '@/stores/teams.types';

import TeamDetailsModal from '@/components/TeamDetailsModal.vue';
import TeamService from '@/services/team';
import { useViewport } from '@/services/viewport';
import { useTeamsStore } from '@/stores/teams';

interface IBracketMatch {
  AwayTeam: IBracketTeam | null;
  AwayTeamPenaltyScore: null | number;
  AwayTeamScore: null | number;
  HomeTeam: IBracketTeam | null;
  HomeTeamPenaltyScore: null | number;
  HomeTeamScore: null | number;
  IdMatch: string;
  MatchNumber: number;
  MatchStatus: number;
  PlaceHolderA: string;
  PlaceHolderB: string;
  Winner: null | string;
}

interface IBracketStage {
  IdStage: string;
  Matches: IBracketMatch[];
  Name: Array<{ Description: string; Locale: string }>;
  SequenceOrder: number;
}

interface IBracketTeam {
  Abbreviation: string;
  IdCountry: string;
  IdTeam: string;
  Score: null | number;
  TeamName: Array<{ Description: string; Locale: string }>;
}

interface IStandingEntry {
  Against: number;
  Drawn: number;
  For: number;
  GoalsDiference: number;
  Group: Array<{ Description: string; Locale: string }>;
  IdGroup: string;
  IsLive: boolean;
  Lost: number;
  Played: number;
  Points: number;
  Position: number;
  QualificationStatus: null | string;
  Team: IStandingTeam;
  Won: number;
}

interface IStandingTeam {
  Abbreviation: string;
  IdTeam: string;
  Name: Array<{ Description: string; Locale: string }>;
}

const teamService = new TeamService();
const teamsStore = useTeamsStore();
const { locale, t } = useI18n();
const { isSmallMobile } = useViewport();
const STANDINGS_URL = `https://api.fifa.com/api/v3/calendar/17/285023/289273/standing?language=${locale.value}`;

const standings = ref<IStandingEntry[]>([]);
const isLoading = ref(true);
const selectedTeam = ref<ITeam | null>(null);
const bracketData = ref<IBracketStage[]>([]);
const isBracketLoading = ref(false);
const selectedStageId = ref('');

const teamByFifaId = computed(() => {
  const map = new Map<number, ITeam>();
  for (const team of teamsStore.teams) {
    map.set(team.idFifa, team);
  }
  return map;
});

function getBracketTeamFlag(team: IBracketTeam | null): string {
  if (!team) return '';
  const storeTeam = getTeam(team.IdTeam);
  if (storeTeam?.isoCode) return storeTeam.isoCode.toLowerCase();
  return team.IdCountry.toLowerCase();
}

function getBracketTeamName(team: IBracketTeam): string {
  const storeTeam = getTeam(team.IdTeam);
  if (storeTeam) return locale.value === 'pt-BR' ? storeTeam.name : storeTeam.nameEn;
  return team.TeamName[0]?.Description ?? team.Abbreviation;
}

function getStageName(stage: IBracketStage): string {
  return stage.Name[0]?.Description ?? '';
}

function getTeam(fifaId: string): ITeam | undefined {
  return teamByFifaId.value.get(Number(fifaId));
}

function getTeamName(fifaId: string): string {
  const team = getTeam(fifaId);
  if (!team) return '';
  return locale.value === 'pt-BR' ? team.name : team.nameEn;
}

function isMatchLoser(match: IBracketMatch, team: IBracketTeam | null): boolean {
  if (!match.Winner || !team) return false;
  return match.Winner !== team.IdTeam;
}

function isMatchWinner(match: IBracketMatch, team: IBracketTeam | null): boolean {
  if (!match.Winner || !team) return false;
  return match.Winner === team.IdTeam;
}

const sortedStages = computed(() => [...bracketData.value].sort((a, b) => a.SequenceOrder - b.SequenceOrder));

const selectedStageMatches = computed(() => {
  const stage = bracketData.value.find((s) => s.IdStage === selectedStageId.value);
  return stage?.Matches ?? [];
});

const groupedStandings = computed(() => {
  const groupMap = new Map<string, { entries: IStandingEntry[]; name: string }>();

  for (const entry of standings.value) {
    const groupName = entry.Group[0]?.Description ?? '';
    if (!groupMap.has(entry.IdGroup)) {
      groupMap.set(entry.IdGroup, { entries: [], name: groupName });
    }
    groupMap.get(entry.IdGroup)!.entries.push(entry);
  }

  for (const group of groupMap.values()) {
    group.entries.sort((a, b) => a.Position - b.Position);
  }

  return Array.from(groupMap.values()).sort((a, b) => a.name.localeCompare(b.name));
});

onMounted(async () => {
  teamService.fetch();
  await Promise.all([fetchStandings(), fetchBracket()]);
});

async function fetchBracket() {
  // Uncomment to restrict to knockout phase only:
  // const { currentRound } = useConfigurationStore();
  // if (currentRound < 4) return;
  isBracketLoading.value = true;
  const lang = locale.value === 'pt-BR' ? 'pt' : 'en';
  try {
    const response = await fetch(`https://api.fifa.com/api/v3/seasonbracket/season/285023?language=${lang}`);
    const data = await response.json();
    const stages = (data.KnockoutStages as IBracketStage[]) ?? [];
    bracketData.value = [...stages].sort((a, b) => a.SequenceOrder - b.SequenceOrder);
    if (bracketData.value.length > 0 && !selectedStageId.value) {
      selectedStageId.value = bracketData.value[0].IdStage;
    }
  } catch {
    bracketData.value = [];
  } finally {
    isBracketLoading.value = false;
  }
}

async function fetchStandings() {
  isLoading.value = true;
  try {
    const response = await fetch(STANDINGS_URL);
    const data = await response.json();
    standings.value = (data.Results as IStandingEntry[]) ?? [];
  } catch {
    standings.value = [];
  } finally {
    isLoading.value = false;
  }
}
</script>

<style lang="scss" scoped>
.standings-toolbar {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.standings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: var(--l-spacing);
  width: 100%;

  @media (width <= 768px) {
    grid-template-columns: 1fr;
    gap: var(--m-spacing);
  }
}

.group-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--bolao-c-blue4);
  border: 1px solid var(--bolao-c-blue3);
  border-radius: var(--border-radius);
}

.group-card__header {
  padding: var(--s-spacing) var(--m-spacing);
  font-size: var(--s-font-size);
  font-weight: 800;
  color: var(--bolao-c-gold);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background-color: var(--bolao-c-blue3);
}

.skel-header {
  height: 40px;
}

.skel-rows {
  display: flex;
  flex-direction: column;
  gap: var(--xs-spacing);
  padding: var(--s-spacing);
}

.skel-row {
  height: 32px;
}

.standings-table {
  width: 100%;
  border-collapse: collapse;

  thead tr th {
    padding: var(--xs-spacing) var(--s-spacing);
    font-size: 10px;
    font-weight: 700;
    color: var(--bolao-c-white);
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
    border-bottom: 1px solid var(--bolao-c-blue3);

    &.col-team {
      text-align: left;
    }
  }

  tbody tr {
    &:not(:last-child) td {
      border-bottom: 1px solid rgb(from var(--bolao-c-blue3) r g b / 40%);
    }

    @media (hover: hover) {
      &:hover td {
        background-color: rgb(from var(--bolao-c-blue3) r g b / 30%);
      }
    }
  }

  td {
    padding: var(--xs-spacing) var(--s-spacing);
    font-size: var(--xs-font-size);
    color: var(--bolao-c-grey2);
    text-align: center;
    white-space: nowrap;
  }
}

.col-pos {
  width: 32px;
}

.col-team {
  width: auto;
  text-align: left;
}

.col-stat {
  width: 28px;
}

.col-pts {
  width: 32px;
  font-weight: 800;
}

.pos-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  font-size: 11px;
  font-weight: 700;
  color: var(--bolao-c-grey3);
  border-radius: 50%;

  &--1 {
    color: var(--bolao-c-gold);
    background-color: rgb(from var(--bolao-c-gold) r g b / 15%);
  }

  &--2 {
    color: var(--bolao-c-grey2);
    background-color: rgb(from var(--bolao-c-grey2) r g b / 15%);
  }
}

.team-cell {
  display: flex;
  gap: var(--xs-spacing);
  align-items: center;
}

.team-flag {
  width: 20px;
  height: 14px;
  object-fit: contain;
  filter: drop-shadow(0 1px 2px rgb(0 0 0 / 20%));
}

.team-btn {
  padding: 0;
  overflow: hidden;
  font-size: var(--xs-font-size);
  color: var(--bolao-c-grey1);
  text-align: left;
  white-space: nowrap;
  cursor: pointer;
  background: none;
  border: none;
  transition: color 0.2s ease;

  &:hover {
    color: var(--bolao-c-gold);
  }
}

.team-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.team-abbr {
  font-weight: 600;
}

.gd--positive {
  color: #4ade80;
}

.gd--negative {
  color: #f87171;
}

.bracket-section {
  width: 100%;
  margin-bottom: var(--l-spacing);
}

.stage-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--xs-spacing);
  align-items: center;
  margin-bottom: var(--m-spacing);
  overflow-x: auto;
}

.skel-tab {
  width: 80px;
  height: 32px;
  border-radius: var(--border-radius);
}

.stage-tab {
  padding: var(--xs-spacing) var(--s-spacing);
  font-size: var(--xs-font-size);
  font-weight: 600;
  color: var(--bolao-c-grey3);
  white-space: nowrap;
  cursor: pointer;
  background-color: var(--bolao-c-blue4);
  border: 1px solid var(--bolao-c-blue3);
  border-radius: var(--border-radius);
  transition: all 0.2s ease;

  @media (hover: hover) {
    &:hover {
      color: var(--bolao-c-white);
      border-color: var(--bolao-c-blue-l2);
    }
  }

  &.stage-tab--active {
    color: var(--bolao-c-gold);
    background-color: rgb(from var(--bolao-c-gold) r g b / 10%);
    border-color: var(--bolao-c-gold);
  }
}

.bracket-matches {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--m-spacing);
  margin-bottom: var(--l-spacing);
}

.skel-match {
  height: 88px;
}

.match-card {
  overflow: hidden;
  background-color: var(--bolao-c-blue4);
  border: 1px solid var(--bolao-c-blue3);
  border-radius: var(--border-radius);
}

.match-number {
  padding: 4px var(--s-spacing);
  font-size: 10px;
  font-weight: 600;
  color: var(--bolao-c-grey5);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background-color: var(--bolao-c-blue3);
}

.match-team {
  display: flex;
  gap: var(--xs-spacing);
  align-items: center;
  padding: var(--xs-spacing) var(--s-spacing);
  transition: opacity 0.2s ease;

  &--winner {
    background-color: rgb(from var(--bolao-c-gold) r g b / 8%);
  }

  &--loser {
    opacity: 0.5;
  }
}

.match-flag {
  width: 18px;
  height: 12px;
  object-fit: contain;
}

.match-team__name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: var(--xs-font-size);
  color: var(--bolao-c-grey1);
  white-space: nowrap;
}

.match-team__score {
  font-size: var(--s-font-size);
  font-weight: 800;
  color: var(--bolao-c-white);
}

.match-divider {
  height: 1px;
  background-color: var(--bolao-c-blue3);
}

.match-penalties {
  padding: 2px var(--s-spacing);
  font-size: 10px;
  color: var(--bolao-c-grey5);
  text-align: center;
  background-color: var(--bolao-c-blue3);
}

.bracket-divider {
  width: 100%;
  height: 1px;
  margin-bottom: var(--xl-spacing);
  background-color: var(--bolao-c-blue3);
}
</style>
