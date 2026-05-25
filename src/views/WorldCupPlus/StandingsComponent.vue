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

const teamByFifaId = computed(() => {
  const map = new Map<number, ITeam>();
  for (const team of teamsStore.teams) {
    map.set(team.idFifa, team);
  }
  return map;
});

function getTeam(fifaId: string): ITeam | undefined {
  return teamByFifaId.value.get(Number(fifaId));
}

function getTeamName(fifaId: string): string {
  const team = getTeam(fifaId);
  if (!team) return '';
  return locale.value === 'pt-BR' ? team.name : team.nameEn;
}

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
  await fetchStandings();
});

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
</style>
