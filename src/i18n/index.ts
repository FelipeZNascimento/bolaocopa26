import { createI18n } from 'vue-i18n';

import en from '@/locales/en.json';
import ptBR from '@/locales/pt-BR.json';

export type MessageSchema = typeof ptBR;

const SUPPORTED_LOCALES = ['pt-BR', 'en'] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_STORAGE_KEY = 'app-locale';

function detectLocale(): SupportedLocale {
  // 1. Prefer user's explicit choice stored in localStorage
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored && (SUPPORTED_LOCALES as readonly string[]).includes(stored)) {
    return stored as SupportedLocale;
  }

  // 2. Fall back to browser language
  const lang = navigator.language; // e.g. 'pt-BR', 'pt-PT', 'en-US', 'en'

  // Exact match
  if ((SUPPORTED_LOCALES as readonly string[]).includes(lang)) {
    return lang as SupportedLocale;
  }

  // Prefix match (e.g. 'pt' → 'pt-BR', 'en' → 'en')
  const prefix = lang.split('-')[0];
  const match = SUPPORTED_LOCALES.find((l) => l.startsWith(prefix));
  return match ?? 'en';
}

const i18n = createI18n<[MessageSchema], SupportedLocale>({
  fallbackLocale: 'en',
  legacy: false, // enables Composition API mode (useI18n)
  locale: detectLocale(),
  messages: {
    en,
    'pt-BR': ptBR,
  },
});

export default i18n;

if (import.meta.hot) {
  import.meta.hot.accept(['../locales/en.json', '../locales/pt-BR.json'], ([enModule, ptBRModule]) => {
    if (enModule) i18n.global.setLocaleMessage('en', enModule.default);
    if (ptBRModule) i18n.global.setLocaleMessage('pt-BR', ptBRModule.default);
  });
}
