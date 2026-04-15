// @ts-check

import eslint from '@eslint/js';
import perfectionist from 'eslint-plugin-perfectionist';
import pluginVue from 'eslint-plugin-vue';
import vitest from '@vitest/eslint-plugin';
import vueTsEslintConfig from '@vue/eslint-config-typescript';
import oxlint from 'eslint-plugin-oxlint';
import globals from 'globals';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'dev-dist/**', 'public/**'],
  },
  eslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ...vueTsEslintConfig(),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  perfectionist.configs['recommended-natural'],
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
    },
  },
  oxlint.configs['flat/recommended'],
  {
    rules: {
      // Customize rules here
      '@typescript-eslint/no-explicit-any': 'warn',
      'vue/multi-word-component-names': 'warn',
      'vue/no-v-html': 'warn',
    },
  },
];
