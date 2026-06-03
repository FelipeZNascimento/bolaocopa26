<template>
  <div class="extras-before-player-outer">
    <p
      v-if="players.length === 0"
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
        <table class="players-table">
          <thead>
            <tr>
              <th
                class="col-country col-sortable"
                :class="{ 'col-sortable--active': sortKey === 'country' }"
                @click="setSort('country')"
              >
                <span class="th-inner">
                  {{ t('players.country') }}
                  <i :class="sortIcon('country')" />
                </span>
              </th>
              <th
                class="col-name col-sortable"
                :class="{ 'col-sortable--active': sortKey === 'name' }"
                @click="setSort('name')"
              >
                <span class="th-inner">
                  {{ t('players.name') }}
                  <i :class="sortIcon('name')" />
                </span>
              </th>
              <th
                v-if="!isMobile"
                class="col-country col-sortable"
                :class="{ 'col-sortable--active': sortKey === 'club' }"
                @click="setSort('club')"
              >
                <span class="th-inner">
                  {{ t('players.club') }}
                  <i :class="sortIcon('club')" />
                </span>
              </th>
              <th
                class="col-age col-sortable"
                :class="{ 'col-sortable--active': sortKey === 'age' }"
                @click="setSort('age')"
              >
                <span class="th-inner">
                  {{ t('players.age') }}
                  <i :class="sortIcon('age')" />
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-if="isLoading">
              <tr
                v-for="i in 20"
                :key="i"
              >
                <td class="col-name"><PrimeSkeleton class="skel-text" /></td>
                <td class="col-country"><PrimeSkeleton class="skel-text" /></td>
                <td
                  v-if="!isMobile"
                  class="col-club"
                >
                  <PrimeSkeleton class="skel-text" />
                </td>
                <td class="col-age"><PrimeSkeleton class="skel-age" /></td>
              </tr>
            </template>
            <tr
              v-for="player in sortedPlayers"
              v-else
              :key="player.id"
              :class="{ selected: player.id === selectedToggle.selectedPlayer?.id }"
              @click="() => handlePlayerClick(player)"
            >
              <td class="col-country">
                <img
                  v-if="player.team?.isoCode"
                  class="referee-flag"
                  :src="`https://assets.omegafox.me/copa/countries_flags/${player.team.isoCode.toLowerCase()}.png`"
                  :alt="getCountry(player)"
                />
                {{ getCountry(player) }}
              </td>
              <td class="col-name">{{ player.name }}</td>
              <td
                v-if="!isMobile"
                class="col-club"
              >
                <img
                  v-if="player.team?.isoCode"
                  class="referee-flag"
                  :src="`https://assets.omegafox.me/copa/countries_flags/${player.club.country.isoCode.toLowerCase()}.png`"
                  :alt="getCountry(player)"
                />{{ player.club.name }}
              </td>
              <td class="col-age">{{ getAge(player.dateOfBirth) }}</td>
            </tr>
          </tbody>
        </table>
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
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type { IPlayer } from '@/stores/teams.types';
import type { IToggleOption } from '@/views/Extras/extrasView.types';

import LoginModal from '@/components/LoginModal.vue';
import ExtraBetService from '@/services/extra_bet';
import { useViewport } from '@/services/viewport';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useExtraBetStore } from '@/stores/extraBet';
import { useNotificationStore } from '@/stores/notification';
import { useTeamsStore } from '@/stores/teams';

type TSortDir = 'asc' | 'desc';
type TSortKey = 'age' | 'club' | 'country' | 'name';

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
const sortKey = ref<TSortKey>('name');
const sortDir = ref<TSortDir>('asc');

// ------ Computed Properties ------
const isLoading = computed(() => {
  return extraBetStore.isLoading || extraBetStore.isUpdating || teamsStore.isLoading;
});

const activeProfile = computed(() => activeProfileStore.activeProfile);
const players = computed(() => teamsStore.players);

const filteredPlayers = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return teamsStore.players;
  return teamsStore.players.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.team?.name.toLowerCase().includes(q) ||
      p.team?.nameEn.toLowerCase().includes(q) ||
      p.club.name.toLowerCase().includes(q),
  );
});

const sortedPlayers = computed(() => {
  return [...filteredPlayers.value].sort((a, b) => {
    let cmp: number;
    if (sortKey.value === 'name') {
      cmp = a.name.localeCompare(b.name);
    } else if (sortKey.value === 'country') {
      cmp = getCountry(a).localeCompare(getCountry(b));
    } else {
      cmp = getAgeValue(a.dateOfBirth) - getAgeValue(b.dateOfBirth);
    }
    return sortDir.value === 'asc' ? cmp : -cmp;
  });
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

function getCountry(player: IPlayer): string {
  return locale.value === 'pt-BR' ? player.team?.name : player.team?.nameEn;
}

function handleCloseLoginModal() {
  isLoginModalOpen.value = false;
}

async function handlePlayerClick(player: IPlayer) {
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

function setSort(key: TSortKey) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortDir.value = 'asc';
  }
}

function sortIcon(key: TSortKey): string {
  if (sortKey.value !== key) return 'pi pi-sort';
  return sortDir.value === 'asc' ? 'pi pi-sort-up' : 'pi pi-sort-down';
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
  margin-bottom: var(--l-spacing);
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

.players-table {
  width: 100%;
  border-collapse: collapse;

  thead tr th {
    padding: var(--xs-spacing) var(--m-spacing);
    font-size: 10px;
    font-weight: 700;
    color: var(--color-contrast);
    text-align: left;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
    border-bottom: 1px solid var(--bolao-c-blue3);
  }

  tbody tr {
    cursor: pointer;

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
    padding: var(--m-spacing) var(--m-spacing);
    font-size: var(--xs-font-size);
    color: var(--bolao-c-grey2);
    text-align: left;

    @media (width <= 768px) {
      padding: var(--m-spacing) var(--s-spacing);
    }
  }

  .selected {
    box-shadow: inset 0 0 5px 3px color-mix(in srgb, var(--bolao-c-gold), transparent 10%);
    color: var(--bolao-c-white);
    transition: all 0.2s;

    @media (hover: hover) {
      &:hover {
        background-color: var(--bolao-c-gold-t3);
        color: black;
      }
    }
  }
}

.col-sortable {
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover,
  &.col-sortable--active {
    color: var(--bolao-c-gold);
  }
}

.th-inner {
  display: inline-flex;
  gap: 4px;
  align-items: center;
}

.col-name {
  flex: 1;
}

.col-club,
.col-country {
  display: flex;
  flex: 1;
  flex-direction: row;
  gap: var(--xs-spacing);
}

.col-age {
  width: 80px;
  text-align: center;
}

.referee-flag {
  display: block;
  width: 20px;
  height: 14px;
  object-fit: contain;
  filter: drop-shadow(0 1px 2px rgb(0 0 0 / 20%));
}

.skel-flag {
  width: 20px;
  height: 14px;
}

.skel-text {
  height: 14px;
}

.skel-age {
  width: 40px;
  height: 14px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  gap: var(--s-spacing);
  align-items: center;
  justify-content: center;
  padding: var(--xxl-spacing);
  font-size: var(--m-font-size);
  color: var(--color-text);
  opacity: 0.6;
}
</style>
