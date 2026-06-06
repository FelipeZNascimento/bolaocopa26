<template>
  <PrimePaginator
    :rows="50"
    :totalRecords="filteredPlayers.length !== allPlayers.length ? filteredPlayers.length : allPlayers.length"
    :rowsPerPageOptions="[50, 100, 200]"
    @page="(e: PageState) => (currentPage = e.page + 1)"
    @update:rows="(rows: number) => (itemsPerPage = rows)"
  />
  <div class="search-bar">
    <i class="pi pi-search search-bar__icon" />
    <input
      v-model="searchQuery"
      class="search-bar__input"
      type="search"
      :placeholder="t('players.search')"
    />
  </div>

  <div class="items-grid">
    <template v-if="isLoading">
      <PlayerStickerComponent
        v-for="i in 24"
        :key="i"
        :player="null"
        loading
      />
    </template>

    <PlayerStickerComponent
      v-for="player in filteredPlayers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)"
      v-else
      :key="player.id"
      :player="player"
    />
  </div>

  <div
    v-if="!isLoading && filteredPlayers.length === 0"
    class="empty-state"
  >
    <i class="pi pi-search" />
    <span>{{ t('players.noResults') }}</span>
  </div>
</template>

<script lang="ts" setup>
import type { PageState } from 'primevue/paginator';

import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import PlayerStickerComponent from '@/components/PlayerStickerComponent.vue';
import TeamService from '@/services/team';
import { useTeamsStore } from '@/stores/teams';

const teamService = new TeamService();
const teamsStore = useTeamsStore();
const { locale, t } = useI18n();

const positionSortOrder: Record<number, number> = {
  1: 1, // Técnico
  2: 2, // Goleiro
  3: 3, // Zagueiro
  4: 4, // Lateral
  5: 5, // Meia
  6: 6, // Meia
  7: 3, // Defensor
};

const isLoading = computed(() => teamsStore.isLoading);
const allPlayers = computed(() =>
  teamsStore.teams
    .filter((team) => team.id !== 33)
    .flatMap((team) => team.players)
    .sort((a, b) => {
      const compareTeam =
        locale.value === 'pt-BR' ? a.team.name.localeCompare(b.team.name) : a.team.nameEn.localeCompare(b.team.nameEn);
      const comparePosition = positionSortOrder[a.position.id] - positionSortOrder[b.position.id];
      const compareName = a.name.localeCompare(b.name);

      return compareTeam || comparePosition || compareName;
    }),
);

const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(50);

const filteredPlayers = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q || q.length < 2) return allPlayers.value;

  return allPlayers.value.filter(
    (player) =>
      player.position.description.toLowerCase().includes(q) ||
      player.position.descriptionEn.toLowerCase().includes(q) ||
      player.name.toLowerCase().includes(q) ||
      player.team.name.toLowerCase().includes(q) ||
      player.team.nameEn.toLowerCase().includes(q) ||
      player.team.abbreviation.toLowerCase().includes(q) ||
      player.team.abbreviationEn.toLowerCase().includes(q) ||
      player.club.name.toLowerCase().includes(q),
  );
});

teamService.fetch();
</script>

<style lang="scss" scoped>
.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--m-spacing);
  width: 100%;

  @media (width <= 600px) {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--s-spacing);
  }

  @media (width <= 400px) {
    grid-template-columns: repeat(2, 1fr);
  }
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
