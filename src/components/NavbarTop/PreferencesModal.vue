<template>
  <PrimeDialog
    dismissableMask
    modal
    v-model:visible="isVisible"
    :draggable="false"
    position="top"
    :style="{ width: '1024px' }"
    :breakpoints="{ '1280px': '75vw', '575px': '90vw' }"
  >
    <template #header>
      <h2>Preferências</h2>
    </template>
    <div class="outer-color">
      <h3>Escolha uma cor</h3>
      <PrimeColorPicker v-model="newColor" class="buttons" />
    </div>
    <!-- <div class="preferences-group"> -->
    <div>
      <div class="outer-search-icons">
        <PrimeFloatLabel variant="in" class="input">
          <PrimeInputText name="iconSearch" type="search" v-model="iconSearch" fluid autofocus />
          <label for="iconSearch">Busque um ícone</label>
        </PrimeFloatLabel>
      </div>
      <div class="outer-pagination-icons">
        <PrimePaginator
          class="paginator"
          :first="selectedPage && selectedPage - 1"
          :rows="1"
          :totalRecords="maxNumOfPages"
          @page="(e: PageState) => (selectedPage = e.page + 1)"
        />
        <div class="outer-icons">
          <p v-if="maxNumOfIconsCurrentPage === 0">Nenhum resultado encontrado</p>
          <FontAwesomeIcon
            v-else
            v-for="index in maxNumOfIconsCurrentPage"
            v-tooltip.top="filteredIcons[calculateIconIndex(index - 1)].value"
            :key="calculateIconIndex(index - 1)"
            class="icon"
            :style="{ color: newColor }"
            :class="{
              selected: filteredIcons[calculateIconIndex(index - 1)].value === newIcon,
            }"
            :icon="filteredIcons[calculateIconIndex(index - 1)].value"
            @click="newIcon = filteredIcons[calculateIconIndex(index - 1)].value"
          />
        </div>
      </div>
    </div>
    <template #footer>
      <div class="buttons-container">
        <IconAndName
          v-if="activeProfile"
          class="iconAndName"
          :name="activeProfile?.name"
          :color="newColor"
          :icon="newIcon"
        />
        <div>
          <PrimeButton
            rounded
            :loading="isLoading"
            type="submit"
            label="Desfazer"
            variant="text"
            severity="secondary"
            icon="pi pi-refresh"
            @click="handleReset"
            style="margin-right: var(--l-spacing)"
          />
          <PrimeButton
            rounded
            :loading="isLoading"
            type="submit"
            label="Confirmar"
            variant="primary"
            severity="secondary"
            icon="pi pi-check"
            @click="handleConfirm"
          />
        </div>
        <p v-show="isUpdateSuccess">
          <PrimeTag severity="success" icon="pi pi-check" value="Alterações salvas com sucesso"></PrimeTag>
        </p>
      </div>
    </template>
  </PrimeDialog>
</template>
<script setup lang="ts">
import type { PageState } from 'primevue';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref, watch, watchEffect } from 'vue';

import { faIconsListObj } from '@/constants/font-awesome';
import UserService from '@/services/user';
import { useActiveProfileStore } from '@/stores/activeProfile';

import IconAndName from '../IconAndName.vue';

const props = defineProps<{
  handleCloseModal: () => void;
  isOpen: boolean;
}>();

// ------ Refs ------
const selectedPage = ref(0);
const newColor = ref('');
const newIcon = ref('');
const iconSearch = ref('');
const isUpdateSuccess = ref(false);
const isVisible = ref(false);

// ------ Initializations ------
const activeProfileStore = useActiveProfileStore();
const userService = new UserService();
const numOfIconsPerPage = 80;

// ------ Computed Properties ------
const filteredIcons = computed(() => {
  const filtered = faIconsListObj.filter((icon) => icon.value.includes(iconSearch.value.toLowerCase()));

  return filtered;
});

const isLoading = computed(() => activeProfileStore.isLoading);
const activeProfile = computed(() => activeProfileStore.activeProfile);
const maxNumOfPages = computed(() => Math.ceil(filteredIcons.value.length / numOfIconsPerPage));
const maxNumOfIconsCurrentPage = computed(() => {
  if (filteredIcons.value.length === 0) {
    return 0;
  }

  if (selectedPage.value === maxNumOfPages.value) {
    const lastPageLength = filteredIcons.value.length % maxNumOfPages.value;
    return lastPageLength === 0 ? numOfIconsPerPage : lastPageLength;
  }

  return filteredIcons.value.length < numOfIconsPerPage ? filteredIcons.value.length : numOfIconsPerPage;
});

// ------ Watch Effect Properties ------
watchEffect(() => (newColor.value = activeProfile.value?.color as string));
watchEffect(() => (newIcon.value = activeProfile.value?.icon as string));

// ------ Functions ------
function calculateIconIndex(index: number) {
  const iconIndex = index + selectedPage.value * numOfIconsPerPage;
  return iconIndex < filteredIcons.value.length ? iconIndex : filteredIcons.value.length - 1;
}

function handleConfirm() {
  isUpdateSuccess.value = false;
  if (newColor.value === activeProfile.value?.color && newIcon.value === activeProfile.value?.icon) {
    return updateCallback(true);
  }

  userService.updatePreferences(newColor.value, newIcon.value, updateCallback);
}

function handleReset() {
  newColor.value = activeProfile.value?.color as string;
  newIcon.value = activeProfile.value?.icon as string;
}

function resetState() {
  isUpdateSuccess.value = false;
  iconSearch.value = '';
  newColor.value = activeProfile.value?.color as string;
  newIcon.value = activeProfile.value?.icon as string;
}

function updateCallback(isSuccess: boolean) {
  if (isSuccess) {
    isUpdateSuccess.value = true;
  }
}

// ------ Watches ------
watch(
  () => props.isOpen,
  async (newValue) => {
    if (newValue) {
      isVisible.value = true;
    }
  },
);

watch(isVisible, async (newValue) => {
  if (!newValue) {
    resetState();
    props.handleCloseModal();
  }
});
</script>
<style scoped>
.preferences-group {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: var(--xxs-spacing) 0;

  .label {
    flex: 2;
  }

  .buttons {
    flex: 3;
    justify-content: flex-start;
  }
}

.outer-color {
  flex-direction: column;
  display: flex;
  gap: var(--s-spacing);
  justify-content: center;
  align-items: center;
  padding: var(--s-spacing) 0;
  font-size: var(--m-font-size);
}

.outer-search-icons {
  padding: var(--l-spacing);
}

.outer-pagination-icons {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: var(--xs-spacing);
  justify-content: center;
}

.outer-icons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--l-spacing);
  justify-content: center;
}

.icon {
  font-size: var(--l-font-size);
  padding: var(--s-spacing);
  background-color: var(--bolao-c-grey5-t1);
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background-color: var(--bolao-c-grey5-t2);
  }
}

.selected {
  background-color: var(--bolao-c-grey5);
}

.outer-color-picker {
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.iconAndName {
  font-size: var(--m-font-size);
}

.buttons-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--xs-spacing);
  width: 100%;
  padding-top: var(--l-spacing);
}
</style>
