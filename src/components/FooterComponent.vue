<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <div class="footer-section">
        <h3 class="section-title">{{ t('footer.about.title') }}</h3>
        <p class="about-text">{{ t('footer.about.description') }}</p>
      </div>
      <div class="footer-section footer-section--contact">
        <h3 class="section-title">{{ t('footer.contact.title') }}</h3>
        <ul class="contact-list">
          <li>
            <a
              class="contact-link"
              href="https://chat.whatsapp.com/EsOlEuAXMeIB6rf8Rq2oBc"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i class="pi pi-whatsapp" />
              {{ t('footer.contact.whatsapp') }}
            </a>
          </li>
          <li>
            <a
              class="contact-link"
              href="https://t.me/+rVP220dgf2o0ZDJh"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i class="pi pi-telegram" />
              {{ t('footer.contact.telegram') }}
            </a>
          </li>
          <li>
            <a
              class="contact-link"
              href="mailto:bolaocopa@omegafox.me"
            >
              <i class="pi pi-envelope" />
              {{ t('footer.contact.email') }}
            </a>
          </li>
        </ul>
      </div>
      <div class="footer-section footer-section--prefs">
        <h3 class="section-title">{{ t('footer.preferences.title') }}</h3>
        <div class="prefs-row">
          <span class="prefs-label">{{ t('footer.preferences.language') }}</span>
          <div class="language-switcher">
            <button
              class="flag-btn"
              :class="{ 'flag-btn--active': locale === 'pt-BR' }"
              :aria-label="t('footer.preferences.portuguese')"
              @click="setLocale('pt-BR')"
            >
              🇧🇷
            </button>
            <button
              class="flag-btn"
              :class="{ 'flag-btn--active': locale === 'en' }"
              :aria-label="t('footer.preferences.english')"
              @click="setLocale('en')"
            >
              🇺🇸
            </button>
          </div>
        </div>
        <div class="prefs-row">
          <span class="prefs-label">{{ t('footer.preferences.theme') }}</span>
          <div class="theme-switcher">
            <button
              class="theme-btn"
              :class="{ 'theme-btn--active': theme === 'light' }"
              :aria-label="t('footer.preferences.light')"
              @click="setTheme('light')"
            >
              <i class="pi pi-sun" />
            </button>
            <button
              class="theme-btn"
              :class="{ 'theme-btn--active': theme === 'dark' }"
              :aria-label="t('footer.preferences.dark')"
              @click="setTheme('dark')"
            >
              <i class="pi pi-moon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { TThemeValue } from '@/stores/configuration.types';

import { LOCALE_STORAGE_KEY } from '@/i18n';
import { useConfigurationStore } from '@/stores/configuration';

const { locale, t } = useI18n();
const configurationStore = useConfigurationStore();

const theme = computed(() => configurationStore.theme);

function setLocale(lang: 'en' | 'pt-BR') {
  locale.value = lang;
  localStorage.setItem(LOCALE_STORAGE_KEY, lang);
}

function setTheme(newTheme: TThemeValue) {
  configurationStore.setTheme(newTheme);
}
</script>

<style lang="scss" scoped>
.app-footer {
  width: 100vw;
  margin-top: auto;
  margin-left: calc(50% - 50vw);
  color: var(--bolao-c-grey2);
  background-color: var(--bolao-c-navbar);
  border-top: 8px solid var(--bolao-c-gold);
}

.footer-inner {
  display: flex;
  flex-wrap: wrap;
  gap: var(--xl-spacing);
  justify-content: center;
  max-width: 960px;
  padding: var(--xl-spacing) var(--l-spacing);
  margin: 0 auto;

  @media (width <= 768px) {
    flex-direction: column;
    gap: var(--l-spacing);
  }
}

.footer-section {
  flex: 1;
  min-width: 200px;
}

.section-title {
  margin-bottom: var(--s-spacing);
  font-size: var(--s-font-size);
  font-weight: 600;
  color: var(--bolao-c-grey1);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.about-text {
  font-size: var(--xs-font-size);
  line-height: 1.6;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: var(--s-spacing);
  padding: 0;
  margin: 0;
  list-style: none;
}

.contact-link {
  display: flex;
  gap: var(--xs-spacing);
  align-items: center;
  font-size: var(--xs-font-size);
  color: var(--bolao-c-grey2);
  text-decoration: none;
  transition: color 0.2s;

  .pi {
    font-size: var(--s-font-size);
  }

  &:hover {
    color: var(--p-text-color);
  }
}

.footer-bottom {
  padding: var(--s-spacing) var(--l-spacing);
  font-size: var(--xxs-font-size);
  text-align: center;
  border-top: 1px solid var(--bolao-c-blue3);
}

.prefs-row {
  display: flex;
  gap: var(--s-spacing);
  align-items: center;
  margin-bottom: var(--s-spacing);
}

.prefs-label {
  font-size: var(--xs-font-size);
  color: var(--bolao-c-grey3);
}

.language-switcher,
.theme-switcher {
  display: flex;
  gap: var(--xs-spacing);
}

.flag-btn {
  padding: var(--xxs-spacing) var(--xs-spacing);
  font-size: var(--m-font-size);
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
    border-color: var(--bolao-c-blue1);
    opacity: 1;
  }
}

.theme-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  cursor: pointer;
  background: none;
  border: 2px solid transparent;
  border-radius: 6px;
  opacity: 0.45;
  transition: all 0.2s;

  .pi {
    font-size: var(--s-font-size);
    color: var(--bolao-c-grey2);
  }

  &:hover {
    opacity: 0.8;
  }

  &--active {
    border-color: var(--bolao-c-blue1);
    opacity: 1;

    .pi {
      color: var(--bolao-c-gold);
    }
  }
}
</style>
