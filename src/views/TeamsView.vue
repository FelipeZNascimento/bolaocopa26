<template>
  <div class="outer-teams">
    <h1>Equipes</h1>
    <PrimeSkeleton v-if="isLoading" class="skeleton-outer" />
    <div v-else class="groups-container">
      <div v-for="group in groupedTeams" :key="group.groupName"
        :class="`group-section group-${group.groupName.toLowerCase().split(' ')[1]}`">
        <h2 class="group-header">
          {{ group.groupName }}
        </h2>
        <div class="teams-grid">
          <div v-for="team in group.teams" :key="team.id" class="team-card" @click="openTeamModal(team)">
            <img :src="`https://assets.omegafox.me/copa/countries_flags/${team.isoCode.toLowerCase()}.png`"
              :alt="`${team.name} Flag`" />
            <div class="team-name">
              {{ team.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Team Details Modal -->
  <TeamDetailsModal :is-open="isModalOpen" :team="selectedTeam" :handle-close-modal="closeTeamModal" />
</template>
<script setup lang="ts">
import { computed, ref } from "vue";

import type { ITeam } from "@/stores/teams.types";

import TeamDetailsModal from "@/components/TeamDetailsModal.vue";
import TeamService from "@/services/team";
import { useTeamsStore } from "@/stores/teams";

// ------ Services & Stores ------
const teamService = new TeamService();
const teamsStore = useTeamsStore();

// ------ Refs ------
const selectedTeam = ref<ITeam | null>(null);
const isModalOpen = ref(false);

// ------ Computed Properties ------
const isLoading = computed(() => teamsStore.isLoading);
// const error = computed(() => teamsStore.error);
const teams = computed(() => teamsStore.teams);

const groupedTeams = computed(() => {
  const groups = new Map<string, ITeam[]>();

  // Group teams by their group property
  teams.value.forEach((team) => {
    const groupKey = team.group;
    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey)!.push(team);
  });

  // Sort groups alphabetically and teams within each group
  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([groupName, teams]) => ({
      groupName: `Grupo ${groupName}`,
      teams: teams.sort((a, b) => a.name.localeCompare(b.name)),
    }));
});

function closeTeamModal() {
  selectedTeam.value = null;
  isModalOpen.value = false;
}

// ------ Functions ------
function openTeamModal(team: ITeam) {
  selectedTeam.value = team;
  isModalOpen.value = true;
}

// ------ Initialization ------
teamService.fetch();
</script>
<style lang="scss" scoped>
.outer-teams {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--l-spacing);
  align-items: center;
  padding: var(--l-spacing) 160px;

  @media (width <=768px) {
    padding: var(--xxl-spacing) var(--s-spacing);
  }

  h1 {
    margin: 0;
  }
}

.skeleton-outer {
  width: 100%;
  min-height: 400px;
}

.groups-container {
  display: flex;
  flex-direction: column;
  gap: var(--xl-spacing);
  width: 100%;
}

.group-section {
  width: 100%;
  overflow: hidden;
  color: var(--color-contrast);
  border-radius: 8px;
  box-shadow: var(--drop-shadow);
}

.group-header {
  padding: var(--m-spacing) var(--l-spacing);
  margin: 0;
  font-size: var(--l-font-size);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.teams-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--m-spacing);
  justify-content: space-evenly;
  padding: var(--m-spacing);
}

.team-card {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  max-width: 160px;
  font-size: var(--m-font-size);
  cursor: pointer;
  background: color-mix(in srgb, var(--color-contrast) 5%, transparent);

  // padding: var(--m-spacing);
  border-radius: var(--border-radius);
  transition: all 0.2s ease;

  @media (width <=768px) {
    font-size: var(--xs-font-size);
  }

  &:hover {
    background: color-mix(in srgb, var(--color-contrast) 10%, transparent);
    box-shadow: var(--drop-shadow);
    transform: translateY(-2px);
  }

  img {
    flex: 0;
    width: 100%;
    height: 100px;
    min-height: 100px;
    object-fit: cover;

    @media (width <=768px) {
      height: 80px;
      min-height: 80px;
    }

    @media (width <=480px) {
      height: 50px;
      min-height: 50px;
    }
  }

  .team-name {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    min-height: 50px;
    font-weight: 600;
    text-align: center;
    text-decoration: underline dotted;
  }
}

// Group colors
.group-a {
  background: linear-gradient(90deg,
      color-mix(in srgb, var(--bolao-c-fifa-green1) 15%, transparent) 0%,
      transparent 100%);

  .group-header {
    background: linear-gradient(90deg,
        color-mix(in srgb, var(--bolao-c-fifa-green1) 15%, transparent) 0%,
        transparent 100%);
    border-left: 4px solid var(--bolao-c-fifa-green1);
  }
}

.group-b {
  background: linear-gradient(90deg,
      color-mix(in srgb, var(--bolao-c-fifa-red) 15%, transparent) 0%,
      transparent 100%);

  .group-header {
    background: linear-gradient(90deg,
        color-mix(in srgb, var(--bolao-c-fifa-red) 15%, transparent) 0%,
        transparent 100%);
    border-left: 4px solid var(--bolao-c-fifa-red);
  }
}

.group-c {
  background: linear-gradient(90deg,
      color-mix(in srgb, var(--bolao-c-fifa-yellow) 15%, transparent) 0%,
      transparent 100%);

  .group-header {
    background: linear-gradient(90deg,
        color-mix(in srgb, var(--bolao-c-fifa-yellow) 15%, transparent) 0%,
        transparent 100%);
    border-left: 4px solid var(--bolao-c-fifa-yellow);
  }
}

.group-d {
  background: linear-gradient(90deg,
      color-mix(in srgb, var(--bolao-c-fifa-blue) 15%, transparent) 0%,
      transparent 100%);

  .group-header {
    background: linear-gradient(90deg,
        color-mix(in srgb, var(--bolao-c-fifa-blue) 15%, transparent) 0%,
        transparent 100%);
    border-left: 4px solid var(--bolao-c-fifa-blue);
  }
}

.group-e {
  background: linear-gradient(90deg,
      color-mix(in srgb, var(--bolao-c-orange) 15%, transparent) 0%,
      transparent 100%);

  .group-header {
    background: linear-gradient(90deg,
        color-mix(in srgb, var(--bolao-c-orange) 15%, transparent) 0%,
        transparent 100%);
    border-left: 4px solid var(--bolao-c-orange);
  }
}

.group-f {
  background: linear-gradient(90deg,
      color-mix(in srgb, var(--bolao-c-fifa-green2) 15%, transparent) 0%,
      transparent 100%);

  .group-header {
    background: linear-gradient(90deg,
        color-mix(in srgb, var(--bolao-c-fifa-green2) 15%, transparent) 0%,
        transparent 100%);
    border-left: 4px solid var(--bolao-c-fifa-green2);
  }
}

.group-g {
  background: linear-gradient(90deg,
      color-mix(in srgb, var(--bolao-c-fifa-lilac) 15%, transparent) 0%,
      transparent 100%);

  .group-header {
    background: linear-gradient(90deg,
        color-mix(in srgb, var(--bolao-c-fifa-lilac) 15%, transparent) 0%,
        transparent 100%);
    border-left: 4px solid var(--bolao-c-fifa-lilac);
  }
}

.group-h {
  background: linear-gradient(90deg,
      color-mix(in srgb, var(--bolao-c-fifa-purple) 15%, transparent) 0%,
      transparent 100%);

  .group-header {
    background: linear-gradient(90deg,
        color-mix(in srgb, var(--bolao-c-fifa-purple) 15%, transparent) 0%,
        transparent 100%);
    border-left: 4px solid var(--bolao-c-fifa-purple);
  }
}
</style>
