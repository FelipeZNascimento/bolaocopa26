<template>
  <span
    class="player-name-hover"
    @click="openTeamModal()"
  >
    {{ team.name }}
  </span>

  <!-- Team Details Modal -->
  <TeamDetailsModal
    :is-open="isTeamModalOpen"
    :team="team"
    :handle-close-modal="closeTeamModal"
  />
</template>
<script setup lang="ts">
import { ref } from 'vue';

import type { ITeam } from '@/stores/teams.types';

import TeamDetailsModal from '@/components/TeamDetailsModal.vue';
defineProps<{
  team: ITeam;
}>();

// ------ Refs ------
const isTeamModalOpen = ref(false);

// ------ Functions ------
function closeTeamModal() {
  isTeamModalOpen.value = false;
}

function openTeamModal() {
  isTeamModalOpen.value = true;
}
</script>
<style lang="scss" scoped>
.player-name-hover {
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: underline;
  text-decoration-style: dotted;
  text-underline-offset: 2px;

  &:hover {
    color: var(--bolao-c-gold);
    text-decoration-style: solid;
  }
}
</style>
