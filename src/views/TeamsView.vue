<template>
  <div class="outer-teams">
    <h1>Equipes</h1>
    <PrimeSkeleton v-if="isLoading" class="skeleton-outer" />
    <div v-else class="groups-container">
      <div
        v-for="group in groupedTeams"
        :key="group.groupName"
        :class="`group-section group-${group.groupName.toLowerCase().split(' ')[1]}`"
      >
        <h2 class="group-header">
          {{ group.groupName }}
        </h2>
        <div class="teams-grid">
          <div
            v-for="team in group.teams"
            :key="team.id"
            class="team-card"
            @click="openTeamModal(team)"
          >
            <img
              :src="`https://assets.omegafox.me/copa/countries_flags/${team.isoCode.toLowerCase()}.png`"
              :alt="`${team.name} Flag`"
            />
            <div class="team-name">
              {{ team.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Team Details Modal -->
  <TeamDetailsModal
    :is-open="isModalOpen"
    :team="selectedTeam"
    :handle-close-modal="closeTeamModal"
  />
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
  flex-direction: column;
  align-items: center;
  gap: var(--l-spacing);
  padding: var(--l-spacing) 160px;
  flex: 1;

  @media (max-width: 768px) {
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
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--xl-spacing);
}

.group-section {
  box-shadow: var(--drop-shadow);
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  color: var(--color-contrast);
}

.group-header {
  font-size: var(--l-font-size);
  font-weight: 700;
  padding: var(--m-spacing) var(--l-spacing);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0;
}

.teams-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--m-spacing);
  padding: var(--m-spacing);
  justify-content: space-evenly;
}

.team-card {
  display: flex;
  flex: 1;
  max-width: 160px;
  flex-direction: column;
  align-items: center;
  // padding: var(--m-spacing);
  border-radius: var(--border-radius);
  background: color-mix(in srgb, var(--color-contrast) 5%, transparent);
  transition: all 0.2s ease;
  cursor: pointer;
  font-size: var(--m-font-size);

  @media (max-width: 768px) {
    font-size: var(--xs-font-size);
  }

  &:hover {
    background: color-mix(in srgb, var(--color-contrast) 10%, transparent);
    transform: translateY(-2px);
    box-shadow: var(--drop-shadow);
  }

  img {
    width: 100%;
    min-height: 100px;
    height: 100px;
    object-fit: cover;
    flex: 0;

    @media (max-width: 768px) {
      min-height: 80px;
      height: 80px;
    }
    @media (max-width: 480px) {
      min-height: 50px;
      height: 50px;
    }
  }

  .team-name {
    flex: 1;
    min-height: 50px;
    display: flex;
    justify-content: center;
    text-align: center;
    align-items: center;
    font-weight: 600;
    text-decoration: underline dotted;
  }
}

// Group colors
.group-a {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-green1) 15%, transparent) 0%,
    transparent 100%
  );

  .group-header {
    border-left: 4px solid var(--bolao-c-fifa-green1);
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--bolao-c-fifa-green1) 15%, transparent) 0%,
      transparent 100%
    );
  }
}

.group-b {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-red) 15%, transparent) 0%,
    transparent 100%
  );
  .group-header {
    border-left: 4px solid var(--bolao-c-fifa-red);
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--bolao-c-fifa-red) 15%, transparent) 0%,
      transparent 100%
    );
  }
}

.group-c {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-yellow) 15%, transparent) 0%,
    transparent 100%
  );
  .group-header {
    border-left: 4px solid var(--bolao-c-fifa-yellow);
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--bolao-c-fifa-yellow) 15%, transparent) 0%,
      transparent 100%
    );
  }
}

.group-d {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-blue) 15%, transparent) 0%,
    transparent 100%
  );
  .group-header {
    border-left: 4px solid var(--bolao-c-fifa-blue);
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--bolao-c-fifa-blue) 15%, transparent) 0%,
      transparent 100%
    );
  }
}

.group-e {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-orange) 15%, transparent) 0%,
    transparent 100%
  );
  .group-header {
    border-left: 4px solid var(--bolao-c-orange);
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--bolao-c-orange) 15%, transparent) 0%,
      transparent 100%
    );
  }
}

.group-f {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-green2) 15%, transparent) 0%,
    transparent 100%
  );
  .group-header {
    border-left: 4px solid var(--bolao-c-fifa-green2);
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--bolao-c-fifa-green2) 15%, transparent) 0%,
      transparent 100%
    );
  }
}

.group-g {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-lilac) 15%, transparent) 0%,
    transparent 100%
  );

  .group-header {
    border-left: 4px solid var(--bolao-c-fifa-lilac);
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--bolao-c-fifa-lilac) 15%, transparent) 0%,
      transparent 100%
    );
  }
}

.group-h {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-purple) 15%, transparent) 0%,
    transparent 100%
  );
  .group-header {
    border-left: 4px solid var(--bolao-c-fifa-purple);
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--bolao-c-fifa-purple) 15%, transparent) 0%,
      transparent 100%
    );
  }
}
</style>
