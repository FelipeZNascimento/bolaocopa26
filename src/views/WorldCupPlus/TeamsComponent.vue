<template>
  <div class="search-bar">
    <i class="pi pi-search search-bar__icon" />
    <input
      v-model="searchQuery"
      class="search-bar__input"
      type="search"
      :placeholder="t('teams.search')"
    />
  </div>
  <p>{{ locale }}</p>
  <div class="items-grid">
    <template v-if="isLoading">
      <WorldCupLandscapeStickerComponent
        v-for="i in 32"
        :key="i"
        color="var(--bolao-c-blue-l2)"
        color-dark="var(--bolao-c-blue)"
        loading
      />
    </template>

    <WorldCupLandscapeStickerComponent
      v-for="team in filteredTeams"
      v-else
      :key="team.id"
      color="var(--bolao-c-blue-l2)"
      color-dark="var(--bolao-c-blue)"
      clickable
      @click="openTeamModal(team)"
    >
      <template #photo>
        <img
          :src="`https://assets.omegafox.me/copa/countries_flags/${team.isoCode.toLowerCase()}.png`"
          :alt="locale === 'pt-BR' ? team.name : team.nameEn"
          class="sticker-flag"
          loading="lazy"
        />
      </template>
      <template #overlay>
        <strong class="overlay-name">{{ locale === 'pt-BR' ? team.name : team.nameEn }}</strong>
        <span class="overlay-sub">
          <span class="overlay-group">{{ t('teams.group', { group: team.group }) }}</span>
          <span class="overlay-sep">·</span>
          <span>{{ team.confederation.abbreviation }}</span>
        </span>
      </template>
    </WorldCupLandscapeStickerComponent>
  </div>

  <div
    v-if="!isLoading && filteredTeams.length === 0"
    class="empty-state"
  >
    <i class="pi pi-search" />
    <span>{{ t('teams.noResults') }}</span>
  </div>

  <TeamDetailsModal
    :is-open="isModalOpen"
    :team="selectedTeam"
    :handle-close-modal="closeTeamModal"
  />
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type { ITeam } from '@/stores/teams.types';

import TeamDetailsModal from '@/components/TeamDetailsModal.vue';
import WorldCupLandscapeStickerComponent from '@/components/WorldCupLandscapeStickerComponent.vue';
import TeamService from '@/services/team';
import { useTeamsStore } from '@/stores/teams';

const teamService = new TeamService();
const teamsStore = useTeamsStore();
const { locale, t } = useI18n();

const isLoading = computed(() => teamsStore.isLoading);
const teams = computed(() => teamsStore.teams.filter((team) => team.id !== 33));

const searchQuery = ref('');

const filteredTeams = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q)
    return locale.value === 'pt-BR'
      ? teams.value.toSorted((a, b) => a.name.localeCompare(b.name))
      : teams.value.toSorted((a, b) => a.nameEn.localeCompare(b.nameEn));

  const filtered = teams.value.filter(
    (team) =>
      team.name.toLowerCase().includes(q) ||
      team.nameEn.toLowerCase().includes(q) ||
      team.abbreviation.toLowerCase().includes(q) ||
      team.abbreviationEn.toLowerCase().includes(q) ||
      team.confederation.name.toLowerCase().includes(q) ||
      team.confederation.nameEn.toLowerCase().includes(q) ||
      team.confederation.abbreviation.toLowerCase().includes(q),
  );

  return locale.value === 'pt-BR'
    ? filtered.toSorted((a, b) => a.name.localeCompare(b.name))
    : filtered.toSorted((a, b) => a.nameEn.localeCompare(b.nameEn));
});

const selectedTeam = ref<ITeam | null>(null);
const isModalOpen = ref(false);

function closeTeamModal() {
  selectedTeam.value = null;
  isModalOpen.value = false;
}

function openTeamModal(team: ITeam) {
  selectedTeam.value = team;
  isModalOpen.value = true;
}

teamService.fetch();
</script>

<style lang="scss" scoped>
.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--l-spacing);
  width: 100%;

  @media (width <= 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--m-spacing);
  }

  @media (width <= 425px) {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--m-spacing);
  }
}

.sticker-flag {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.overlay-name {
  display: block;
  font-size: var(--m-font-size);
  font-weight: 800;
  line-height: 1.2;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.03em;

  @media (width <= 768px) {
    font-size: var(--s-font-size);
  }
}

.overlay-sub {
  display: flex;
  gap: 4px;
  align-items: center;
  font-size: 11px;
  color: rgb(255 255 255 / 75%);
}

.overlay-group {
  font-weight: 700;
  color: rgb(255 255 255 / 90%);
}

.overlay-sep {
  color: rgb(255 255 255 / 40%);
}

.search-bar {
  position: relative;
  width: 100%;
  max-width: 360px;
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
    color: currentcolor;
    opacity: 0.4;
  }
}

.empty-state {
  display: flex;
  gap: var(--s-spacing);
  align-items: center;
  justify-content: center;
  padding: var(--xl-spacing);
  font-size: var(--s-font-size);
  color: var(--color-text);
  opacity: 0.6;

  i {
    font-size: var(--m-font-size);
  }
}
</style>
