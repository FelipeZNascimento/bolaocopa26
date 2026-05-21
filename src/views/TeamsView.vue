<template>
  <div class="outer-teams">
    <h1>{{ t('teams.title') }}</h1>
    <div
      v-if="isLoading"
      style="
        display: flex;
        flex-flow: row wrap;
        gap: var(--l-spacing);
        align-items: center;
        justify-content: center;
        width: 100%;
      "
    >
      <PrimeSkeleton
        v-for="value in 12"
        :key="value"
        class="skeleton-outer"
      />
    </div>
    <div
      v-else
      class="groups-container"
    >
      <div
        v-for="group in groupedTeams"
        :key="group.groupName"
        :class="`group-section group-${group.groupName.toLowerCase().split(' ')[1]}`"
      >
        <h2 class="group-header">
          {{ group.groupName }}
        </h2>
        <div class="teams-grid">
          <ClickableTeamCard
            v-for="team in group.teams"
            :key="team.id"
            :team="team"
            :is-loading="false"
            :handle-click="openTeamModal"
          />
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
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type { ITeam } from '@/stores/teams.types';

import ClickableTeamCard from '@/components/ClickableTeamCard.vue';
import TeamDetailsModal from '@/components/TeamDetailsModal.vue';
import { useTeamsStore } from '@/stores/teams';

// ------ Services & Stores ------
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
    if (team.id === 33) {
      return; // Skip placeholder team
    }

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
      groupName: t(`teams.group`, { group: groupName }),
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
const { t } = useI18n();
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
  width: 20% !important;
  min-height: 200px;

  @media (width <= 1024px) {
    width: 45% !important;
  }

  @media (width <= 600px) {
    width: 100% !important;
  }
}

.groups-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--xl-spacing);
  width: 100%;

  @media (width <= 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (width <= 600px) {
    grid-template-columns: 1fr;
  }
}

.group-section {
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
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--m-spacing);
  padding: var(--m-spacing);
}

// Group colors
.group-a {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-green1) 15%, transparent) 0%,
    transparent 100%
  );

  .group-header {
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--bolao-c-fifa-green1) 15%, transparent) 0%,
      transparent 100%
    );
    border-left: 4px solid var(--bolao-c-fifa-green1);
  }
}

.group-b {
  background: linear-gradient(90deg, color-mix(in srgb, var(--bolao-c-fifa-red) 15%, transparent) 0%, transparent 100%);

  .group-header {
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--bolao-c-fifa-red) 15%, transparent) 0%,
      transparent 100%
    );
    border-left: 4px solid var(--bolao-c-fifa-red);
  }
}

.group-c {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-yellow) 15%, transparent) 0%,
    transparent 100%
  );

  .group-header {
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--bolao-c-fifa-yellow) 15%, transparent) 0%,
      transparent 100%
    );
    border-left: 4px solid var(--bolao-c-fifa-yellow);
  }
}

.group-d {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-blue) 15%, transparent) 0%,
    transparent 100%
  );

  .group-header {
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--bolao-c-fifa-blue) 15%, transparent) 0%,
      transparent 100%
    );
    border-left: 4px solid var(--bolao-c-fifa-blue);
  }
}

.group-e {
  background: linear-gradient(90deg, color-mix(in srgb, var(--bolao-c-orange) 15%, transparent) 0%, transparent 100%);

  .group-header {
    background: linear-gradient(90deg, color-mix(in srgb, var(--bolao-c-orange) 15%, transparent) 0%, transparent 100%);
    border-left: 4px solid var(--bolao-c-orange);
  }
}

.group-f {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-green2) 15%, transparent) 0%,
    transparent 100%
  );

  .group-header {
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--bolao-c-fifa-green2) 15%, transparent) 0%,
      transparent 100%
    );
    border-left: 4px solid var(--bolao-c-fifa-green2);
  }
}

.group-g {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-lilac) 15%, transparent) 0%,
    transparent 100%
  );

  .group-header {
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--bolao-c-fifa-lilac) 15%, transparent) 0%,
      transparent 100%
    );
    border-left: 4px solid var(--bolao-c-fifa-lilac);
  }
}

.group-h {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-purple) 15%, transparent) 0%,
    transparent 100%
  );

  .group-header {
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--bolao-c-fifa-purple) 15%, transparent) 0%,
      transparent 100%
    );
    border-left: 4px solid var(--bolao-c-fifa-purple);
  }
}

.group-i {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-purple) 15%, transparent) 0%,
    transparent 100%
  );
  border-color: var(--bolao-c-fifa-purple);

  .group-header {
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--bolao-c-fifa-purple) 15%, transparent) 0%,
      transparent 100%
    );
    border-left: 4px solid var(--bolao-c-fifa-purple);
  }
}

.group-j {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-lightpink) 15%, transparent) 0%,
    transparent 100%
  );
  border-color: var(--bolao-c-fifa-lightpink);

  .group-header {
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--bolao-c-fifa-lightpink) 15%, transparent) 0%,
      transparent 100%
    );
    border-left: 4px solid var(--bolao-c-fifa-lightpink);
  }
}

.group-k {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-pink) 15%, transparent) 0%,
    transparent 100%
  );
  border-color: var(--bolao-c-fifa-pink);

  .group-header {
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--bolao-c-fifa-pink) 15%, transparent) 0%,
      transparent 100%
    );
    border-left: 4px solid var(--bolao-c-fifa-pink);
  }
}

.group-l {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-darkred) 15%, transparent) 0%,
    transparent 100%
  );
  border-color: var(--bolao-c-fifa-darkred);

  .group-header {
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--bolao-c-fifa-darkred) 15%, transparent) 0%,
      transparent 100%
    );
    border-left: 4px solid var(--bolao-c-fifa-darkred);
  }
}
</style>
