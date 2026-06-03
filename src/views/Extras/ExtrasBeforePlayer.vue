<template>
  <div class="extras-before-player-outer">
    <p
      v-if="allPlayers.length === 0"
      style="color: var(--color-text); text-align: center"
    >
      {{ t('extraBets.playersWarning') }}
    </p>
    <template v-else>
      <div class="search-bar">
        <i class="pi pi-search search-bar__icon" />
        <input
          v-model="searchQuery"
          class="search-bar__input"
          type="search"
          :placeholder="t('players.search')"
        />
      </div>
      <div class="table-card">
        <PrimeDataTable
          v-model:selection="selectedPlayer"
          :value="filteredPlayers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)"
          paginator
          :rows="10"
          :rowsPerPageOptions="[10, 50, 100]"
          size="small"
          selectionMode="single"
          striped-rows
          row-hover
          :loading="isLoading"
          @rowSelect="onPlayerClick($event.data)"
        >
          <PrimeColumn
            :header="t('players.country')"
            :sortable="true"
            :sortField="locale === 'pt-BR' ? 'team.name' : 'team.nameEn'"
            :style="{ width: isMobile ? '50%' : '25%' }"
          >
            <template #body="slotProps">
              <div style="display: flex; gap: var(--s-spacing); align-items: center">
                <img
                  v-if="slotProps.data.team.isoCode"
                  class="flag"
                  :src="`https://assets.omegafox.me/copa/countries_flags/${slotProps.data.team.isoCode.toLowerCase()}.png`"
                  :alt="locale === 'pt-BR' ? slotProps.data.team.name : slotProps.data.team.nameEn"
                />

                {{ locale === 'pt-BR' ? slotProps.data.team.name : slotProps.data.team.nameEn }}
              </div>
            </template>
          </PrimeColumn>
          <PrimeColumn
            :header="t('players.name')"
            :sortable="true"
            :sortField="'name'"
            :field="'name'"
            :style="{ width: isMobile ? '50%' : '30%' }"
          >
            <template #body="slotProps">
              <span style="margin-right: var(--s-spacing); font-size: var(--xs-font-size)">{{
                slotProps.data.position.abbreviation
              }}</span>
              <HoverablePlayerName
                v-if="!isMobile"
                :player="slotProps.data"
              />
              <span v-else>{{ slotProps.data.name }}</span>
            </template>
          </PrimeColumn>
          <PrimeColumn
            v-if="!isMobile"
            :header="t('players.club')"
            :sortable="true"
            :sortField="'club.name'"
            :field="'club.name'"
            style="width: 30%"
          >
            <template #body="slotProps">
              <div style="display: flex; gap: var(--s-spacing); align-items: center">
                <img
                  v-if="slotProps.data.team?.isoCode"
                  class="flag"
                  :src="`https://assets.omegafox.me/copa/countries_flags/${slotProps.data.club.country.isoCode.toLowerCase()}.png`"
                  :alt="locale === 'pt-BR' ? slotProps.data.club.country.name : slotProps.data.club.country.nameEn"
                />
                {{ slotProps.data.club.name }}
              </div>
            </template>
          </PrimeColumn>
          <PrimeColumn
            v-if="!isMobile"
            :header="t('players.age')"
            :sortable="true"
            :sortField="'age'"
            :field="'age'"
            style="width: 15%"
          >
            <template #body="slotProps">
              {{ getAge(slotProps.data.dateOfBirth) }}
            </template>
          </PrimeColumn>
        </PrimeDataTable>
      </div>
    </template>
  </div>

  <!-- Modals -->
  <LoginModal
    :is-open="isLoginModalOpen"
    :handle-close-modal="handleCloseLoginModal"
  />
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import type { IPlayer } from '@/stores/teams.types';
import type { IToggleOption } from '@/views/Extras/extrasView.types';

import HoverablePlayerName from '@/components/HoverablePlayerName.vue';
import LoginModal from '@/components/LoginModal.vue';
import ExtraBetService from '@/services/extra_bet';
import { useViewport } from '@/services/viewport';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useExtraBetStore } from '@/stores/extraBet';
import { useNotificationStore } from '@/stores/notification';
import { useTeamsStore } from '@/stores/teams';

const props = defineProps<{
  selectedToggle: IToggleOption;
}>();

const emit = defineEmits<{
  playerClickFail: [previousPlayer: IPlayer | null];
}>();

const { isMobile } = useViewport();

// ------ Services & Stores ------
const teamsStore = useTeamsStore();
const extraBetStore = useExtraBetStore();
const extraBetService = new ExtraBetService();
const notificationStore = useNotificationStore();
const activeProfileStore = useActiveProfileStore();
const { locale, t } = useI18n();

// ------ Refs ------
const isLoginModalOpen = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(50);
const selectedPlayer = ref<IPlayer | null>(props.selectedToggle.selectedPlayer || null);

// ------ Watchers ------
watch(
  () => props.selectedToggle.selectedPlayer,
  (newPlayer) => {
    selectedPlayer.value = newPlayer || null;
  },
);

// ------ Computed Properties ------
const isLoading = computed(() => {
  return extraBetStore.isLoading || extraBetStore.isUpdating || teamsStore.isLoading;
});

const activeProfile = computed(() => activeProfileStore.activeProfile);
const allPlayers = computed(() => teamsStore.players);

const filteredPlayers = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q || q.length < 2) return allPlayers.value;
  return allPlayers.value.filter(
    (p) =>
      p.position.description.toLowerCase().includes(q) ||
      p.position.descriptionEn.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.team.name.toLowerCase().includes(q) ||
      p.team.nameEn.toLowerCase().includes(q) ||
      p.team.abbreviation.toLowerCase().includes(q) ||
      p.team.abbreviationEn.toLowerCase().includes(q) ||
      p.club.name.toLowerCase().includes(q),
  );
});

// ------ Functions ------

function getAge(dateOfBirth: string): string {
  const age = getAgeValue(dateOfBirth);
  if (age < 0) return '–';
  return `${age} ${t('referees.yo')}`;
}

function getAgeValue(dateOfBirth: string): number {
  if (!dateOfBirth || dateOfBirth.startsWith('0000')) return -1;
  const birth = new Date(dateOfBirth);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

function handleCloseLoginModal() {
  isLoginModalOpen.value = false;
}

async function onPlayerClick(player: IPlayer) {
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
    const previousPlayer = props.selectedToggle.selectedPlayer;

    // Optimistically update UI
    if (props.selectedToggle.selectedPlayer?.id === player.id) {
      return; // No change, do nothing
    }

    await extraBetService.update(
      {
        extraType: props.selectedToggle.value,
        playerId: player.id,
        teamId: player.team?.id || null,
      },
      (isSuccess: boolean, error?: Error) => {
        if (isSuccess) {
          // Refresh the extra bets from the store to reflect the update
          extraBetService.fetch();
          notificationStore.success(
            `${t(props.selectedToggle.label)}: ${player.name}`,
            t('extraBets.notification.success'),
          );
        } else {
          console.error('Failed to update extra bet:', error);
          // Revert to previous state on failure
          if (props.selectedToggle && previousPlayer) {
            emit('playerClickFail', previousPlayer);
          }
          notificationStore.error(t('extraBets.notification.error'));
        }
      },
    );
  }
}
</script>
<style lang="scss" scoped>
.extras-before-player-outer {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.search-bar {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: var(--l-spacing) 0;
}

.search-bar__icon {
  position: absolute;
  top: 50%;
  left: var(--s-spacing);
  font-size: var(--s-font-size);
  color: var(--bolao-c-blue);
  pointer-events: none;
  transform: translateY(-50%);
}

.search-bar__input {
  display: block;
  width: 100%;
  padding: var(--s-spacing) var(--m-spacing) var(--s-spacing) 2.25rem;
  font-size: var(--s-font-size);
  color: inherit;
  outline: none;
  background-color: transparent;
  border: 2px solid var(--bolao-c-blue);
  border-radius: 999px;
  transition: box-shadow 0.2s ease;

  &:focus {
    box-shadow: 0 0 0 3px rgb(from var(--bolao-c-blue) r g b / 20%);
  }

  &::placeholder {
    color: var(--bolao-c-grey5);
  }

  &::-webkit-search-cancel-button {
    cursor: pointer;
    filter: invert(0.4);
  }
}

.table-card {
  width: 100%;
  overflow: hidden;
  background-color: var(--bolao-c-blue4);
  border: 1px solid var(--bolao-c-blue3);
  border-radius: var(--border-radius);
}

.flag {
  display: block;
  width: 20px;
  height: 14px;
  object-fit: contain;
  filter: drop-shadow(0 1px 2px rgb(0 0 0 / 20%));
}
</style>
<style lang="scss">
.p-datatable.p-datatable-striped .p-datatable-tbody > tr.p-row-odd.p-datatable-row-selected,
.p-datatable-tbody > tr.p-datatable-row-selected {
  color: var(--bolao-c-white);
  background-color: var(--bolao-c-black-t1) !important;
  box-shadow: inset 0 0 5px 3px color-mix(in srgb, var(--bolao-c-gold), transparent 10%);
  transition: all 0.2s;
}
</style>
