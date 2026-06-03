<template>
  <div class="teams-grid">
    <ClickableTeamCard
      v-for="team in teams"
      :key="team.id"
      :team="team"
      :is-selected="selectedToggle.selectedTeam?.some((e) => e.team.id === team.id)"
      :handle-click="handleTeamClick"
      :is-loading="isLoading"
    />
  </div>
  <!-- Modals -->
  <LoginModal
    :is-open="isLoginModalOpen"
    :handle-close-modal="handleCloseLoginModal"
  />
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type { ITeam } from '@/stores/teams.types';
import type { ISelectedTeamEntry, IToggleOption } from '@/views/Extras/extrasView.types';

import ClickableTeamCard from '@/components/ClickableTeamCard.vue';
import LoginModal from '@/components/LoginModal.vue';
import ExtraBetService from '@/services/extra_bet';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useExtraBetStore } from '@/stores/extraBet';
import { useNotificationStore } from '@/stores/notification';
import { useTeamsStore } from '@/stores/teams';

const props = defineProps<{
  selectedToggle: IToggleOption;
}>();

const emit = defineEmits<{
  teamClickFail: [previousTeam: ISelectedTeamEntry[]];
}>();

// ------ Services & Stores ------
const teamsStore = useTeamsStore();
const extraBetStore = useExtraBetStore();
const extraBetService = new ExtraBetService();
const notificationStore = useNotificationStore();
const activeProfileStore = useActiveProfileStore();
const { locale, t } = useI18n();

// ------ Refs ------
const isLoginModalOpen = ref(false);

// ------ Computed Properties ------
const isLoading = computed(() => {
  return extraBetStore.isLoading || extraBetStore.isUpdating || teamsStore.isLoading;
});

const activeProfile = computed(() => activeProfileStore.activeProfile);
const teams = computed(() => {
  const filteredTeams = teamsStore.teams.filter((team) => team.id !== 33);
  return locale.value === 'pt-BR'
    ? filteredTeams.toSorted((a, b) => a.name.localeCompare(b.name))
    : filteredTeams.toSorted((a, b) => a.nameEn.localeCompare(b.nameEn));
}); // Filter out placeholder team and sort by name based on locale

// ------ Functions ------

function handleCloseLoginModal() {
  isLoginModalOpen.value = false;
}

async function handleTeamClick(team: ITeam) {
  if (!activeProfile.value) {
    isLoginModalOpen.value = true;
    return;
  }

  if (!activeProfile.value.isActive) {
    notificationStore.message(
      t('floatingButton.notifications.inactiveProfile.message'),
      t('floatingButton.notifications.inactiveProfile.title'),
    );
    return;
  }

  if (props.selectedToggle) {
    // Save the previous state for potential rollback
    const previousTeam = props.selectedToggle.selectedTeam;

    // Optimistically update UI
    if (props.selectedToggle.selectedTeam?.[0]?.team.id === team.id) {
      return; // No change, do nothing
    }

    await extraBetService.update(
      {
        extraType: props.selectedToggle.value,
        teamId: team.id,
      },
      (isSuccess: boolean, error?: Error) => {
        if (isSuccess) {
          const teamName = locale.value === 'pt-BR' ? team.name : team.nameEn;

          // Refresh the extra bets from the store to reflect the update
          extraBetService.fetch();
          notificationStore.success(
            `${t(props.selectedToggle.label)}: ${teamName || 'Nenhum'}`,
            t('extraBets.notification.success'),
          );
        } else {
          console.error('Failed to update extra bet:', error);
          // Revert to previous state on failure
          if (props.selectedToggle && previousTeam) {
            emit('teamClickFail', previousTeam);
          }
          notificationStore.error(t('extraBets.notification.error'));
        }
      },
    );
  }
}
</script>
<style lang="scss" scoped>
.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: var(--m-spacing);
  width: 100%;

  @media (width <= 768px) {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    gap: var(--s-spacing);
  }
}
</style>
