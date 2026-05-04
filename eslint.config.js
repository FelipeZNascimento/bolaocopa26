import vueTsEslintConfig from '@vue/eslint-config-typescript';
import eslintConfigPrettier from 'eslint-config-prettier';
import perfectionist from 'eslint-plugin-perfectionist';
import pluginVue from 'eslint-plugin-vue';

export default [
  {
    files: ['**/*.{ts,mts,tsx,vue}'],
    name: 'app/files-to-lint',
  },
  {
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/dev-dist/**'],
    name: 'app/files-to-ignore',
  },
  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),
  perfectionist.configs['recommended-natural'],
  {
    name: 'app/code-quality-rules',
    rules: {
      // Enforce consistent attribute order (code quality, not formatting)
      'vue/attributes-order': [
        'error',
        {
          alphabetical: false,
          order: [
            'DEFINITION', // is, v-is
            'LIST_RENDERING', // v-for
            'CONDITIONALS', // v-if, v-else-if, v-else, v-show, v-cloak
            'RENDER_MODIFIERS', // v-once, v-pre
            'GLOBAL', // id
            'UNIQUE', // ref, key
            'SLOT', // v-slot, slot
            'TWO_WAY_BINDING', // v-model
            'OTHER_DIRECTIVES', // v-custom-directive
            'OTHER_ATTR', // all other attributes (class, style, custom props, :prop, prop="value")
            'EVENTS', // @click, v-on:click
            'CONTENT', // v-html, v-text
          ],
        },
      ],
    },
  },
  // Must be last - disables all ESLint formatting rules that conflict with Prettier
  eslintConfigPrettier,
];
