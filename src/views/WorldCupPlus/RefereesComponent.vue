<template>
  <div class="search-bar">
    <i class="pi pi-search search-bar__icon" />
    <input
      v-model="searchQuery"
      class="search-bar__input"
      type="search"
      :placeholder="t('referees.search')"
    />
  </div>

  <div class="table-card">
    <PrimeDataTable
      :value="filteredReferees"
      paginator
      :rows="10"
      :rowsPerPageOptions="[10, 50, 100]"
      size="small"
      striped-rows
      row-hover
      :loading="isLoading"
    >
      <PrimeColumn
        :header="t('referees.name')"
        :sortable="true"
        :sortField="'name'"
        :field="'name'"
        style="width: 40%"
      />
      <PrimeColumn
        :header="t('referees.country')"
        :sortable="true"
        :sortField="'country'"
        :field="'country'"
        style="width: 30%"
      >
        <template #body="slotProps">
          <div style="display: flex; gap: var(--s-spacing); align-items: center">
            <img
              class="flag"
              :src="`https://assets.omegafox.me/copa/countries_flags/${slotProps.data.isoCode.toLowerCase()}.png`"
              :alt="locale === 'pt-BR' ? slotProps.data.name : slotProps.data.nameEn"
            />
            {{ slotProps.data.country }}
          </div>
        </template>
      </PrimeColumn>
      <PrimeColumn
        :header="t('referees.age')"
        :sortable="true"
        :sortFunction="getAge"
        :field="'dateOfBirth'"
        style="width: 30%"
      >
        <template #body="slotProps">
          {{ slotProps.data.dateOfBirth }} ({{ getAge(slotProps.data.dateOfBirth) }})
        </template>
      </PrimeColumn>
    </PrimeDataTable>
  </div>

  <div
    v-if="!isLoading && filteredReferees.length === 0"
    class="empty-state"
  >
    <i class="pi pi-search" />
    <span>{{ t('referees.noResults') }}</span>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import RefereeService from '@/services/referee';
import { useRefereesStore } from '@/stores/referees';

const refereeService = new RefereeService();
const refereesStore = useRefereesStore();
const { locale, t } = useI18n();

const isLoading = ref(true);
const searchQuery = ref('');

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

const filteredReferees = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return refereesStore.referees;
  return refereesStore.referees.filter(
    (r) =>
      r.name.toLowerCase().includes(q) || r.country.toLowerCase().includes(q) || r.countryEn.toLowerCase().includes(q),
  );
});

onMounted(async () => {
  await refereeService.fetch();
  isLoading.value = false;
});
</script>

<style lang="scss" scoped>
.search-bar {
  position: relative;
  width: 100%;
  max-width: 400px;
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

.flag {
  display: block;
  width: 20px;
  height: 14px;
  object-fit: contain;
  filter: drop-shadow(0 1px 2px rgb(0 0 0 / 20%));
}
</style>
