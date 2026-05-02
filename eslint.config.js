import vueTsEslintConfig from "@vue/eslint-config-typescript";
import perfectionist from "eslint-plugin-perfectionist";
import pluginVue from "eslint-plugin-vue";

export default [
  {
    files: ["**/*.{ts,mts,tsx,vue}"],
    name: "app/files-to-lint",
  },
  {
    ignores: [
      "**/dist/**",
      "**/dist-ssr/**",
      "**/coverage/**",
      "**/dev-dist/**",
    ],
    name: "app/files-to-ignore",
  },
  ...pluginVue.configs["flat/essential"],
  ...vueTsEslintConfig(),
  perfectionist.configs["recommended-natural"],
  {
    name: "app/typescript-formatting",
    files: ["**/*.{ts,mts,tsx}"],
    rules: {
      "indent": ["error", 2, { "SwitchCase": 1 }],
      "no-trailing-spaces": "error",
      "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0 }],
      "comma-dangle": ["error", "always-multiline"],
    },
  },
  {
    name: "app/vue-template-formatting",
    rules: {
      "vue/first-attribute-linebreak": [
        "warn",
        {
          multiline: "below",
          singleline: "ignore",
        },
      ],
      "vue/html-closing-bracket-newline": [
        "warn",
        {
          multiline: "always",
          singleline: "never",
        },
      ],
      // Proper indentation for Vue templates
      "vue/html-indent": [
        "warn",
        2,
        {
          alignAttributesVertically: false,
          attribute: 1,
          baseIndent: 1,
          closeBracket: 0,
        },
      ],
      // Enforce attributes on new lines when line is too long
      "vue/max-attributes-per-line": [
        "warn",
        {
          multiline: { max: 1 },
          singleline: { max: 3 },
        },
      ],
      // Script indentation
      "vue/script-indent": [
        "error",
        2,
        {
          baseIndent: 0,
          switchCase: 1,
        },
      ],
    },
  },
];
