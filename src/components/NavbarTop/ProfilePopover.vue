<template>
  <PrimePopover
    ref="popover"
    @hide="emit('sync')"
  >
    <div class="outer-profile-popover">
      <PrimeButton
        v-if="activeProfile?.admin"
        variant="text"
        severity="secondary"
        size="small"
        :label="t('profilePopover.admin')"
        @click="handleNavigateToAdmin"
      />
      <PrimeButton
        variant="text"
        severity="secondary"
        size="small"
        :label="t('profilePopover.profile')"
        @click="
          isProfileModalOpen = true;
          popover.hide();
        "
      />
      <PrimeButton
        variant="text"
        severity="secondary"
        size="small"
        :label="t('profilePopover.password')"
        @click="
          isPasswordModalOpen = true;
          popover.hide();
        "
      />
      <PrimeButton
        variant="text"
        severity="secondary"
        size="small"
        :label="t('profilePopover.favorites')"
        @click="
          isFavoritesModalOpen = true;
          popover.hide();
        "
      />
      <PrimeButton
        severity="secondary"
        variant="link"
        size="small"
        @click="handleThemeConfig(theme === 'dark' ? 'light' : 'dark')"
      >
        <i
          :class="theme === 'dark' ? 'pi pi-sun' : 'pi pi-moon'"
          :style="{ color: theme === 'dark' ? 'var(--bolao-c-gold)' : 'var(--bolao-c-grey2)' }"
          style="font-size: var(--l-font-size)"
        />
      </PrimeButton>

      <PrimeDivider />

      <PrimeButton
        severity="secondary"
        size="small"
        :label="t('profilePopover.logout')"
        @click="handleLogout"
      />

      <PrimeDivider />

      <div class="language-switcher">
        <button
          class="flag-btn"
          :class="{ 'flag-btn--active': locale === 'pt-BR' }"
          @click="setLocale('pt-BR')"
        >
          🇧🇷
        </button>
        <button
          class="flag-btn"
          :class="{ 'flag-btn--active': locale === 'en' }"
          @click="setLocale('en')"
        >
          🇺🇸
        </button>
      </div>
    </div>
  </PrimePopover>

  <!-- Modals -->
  <ProfileModal
    :is-open="isProfileModalOpen"
    :handle-close-modal="handleCloseProfileModal"
  />
  <PasswordModal
    :is-open="isPasswordModalOpen"
    :handle-close-modal="handleClosePasswordModal"
  />
  <ManageFavoritesModal
    :is-open="isFavoritesModalOpen"
    :handle-close-modal="handleCloseFavoritesModal"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import type { TThemeValue } from '@/stores/configuration.types';

import ManageFavoritesModal from '@/components/Ranking/ManageFavoritesModal.vue';
import { LOCALE_STORAGE_KEY } from '@/i18n';
import UserService from '@/services/user';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useConfigurationStore } from '@/stores/configuration';

import PasswordModal from './ChangePasswordModal.vue';
import ProfileModal from './ProfileModal.vue';

const emit = defineEmits<{ sync: [] }>();

const { locale, t } = useI18n();
const router = useRouter();
const popover = ref();

const activeProfileStore = useActiveProfileStore();
const configurationStore = useConfigurationStore();
const userService = new UserService();

// ------ Refs ------
const isProfileModalOpen = ref(false);
const isPasswordModalOpen = ref(false);
const isFavoritesModalOpen = ref(false);

// ------ Computed Properties ------
const activeProfile = computed(() => activeProfileStore.activeProfile);
const theme = computed(() => configurationStore.theme);

// ------ Functions ------
function handleCloseFavoritesModal() {
  isFavoritesModalOpen.value = false;
  emit('sync');
}

function handleClosePasswordModal() {
  isPasswordModalOpen.value = false;
  emit('sync');
}

function handleCloseProfileModal() {
  isProfileModalOpen.value = false;
  emit('sync');
}

function handleLogout() {
  userService.logout();
  popover.value.hide();
}

function handleNavigateToAdmin() {
  popover.value?.hide();
  router.push('/admin');
}

function handleThemeConfig(newOption: TThemeValue) {
  configurationStore.setTheme(newOption);
}

function setLocale(lang: 'en' | 'pt-BR') {
  locale.value = lang;
  localStorage.setItem(LOCALE_STORAGE_KEY, lang);
}

defineExpose({
  hide: () => popover.value?.hide(),
  toggle: (event: Event) => popover.value?.toggle(event),
});
</script>

<style scoped lang="scss">
.outer-profile-popover {
  display: flex;
  flex-direction: column;
  gap: var(--m-spacing);
  padding: var(--s-spacing);
}

.language-switcher {
  display: flex;
  gap: var(--s-spacing);
  justify-content: center;
}

.flag-btn {
  padding: 4px 8px;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  background: none;
  border: 2px solid transparent;
  border-radius: 6px;
  opacity: 0.45;
  transition: all 0.2s;

  &:hover {
    opacity: 0.8;
  }

  &--active {
    border-color: var(--bolao-c-blue);
    opacity: 1;
  }
}
</style>
