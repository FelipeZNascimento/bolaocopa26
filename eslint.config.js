import vueTsEslintConfig from "@vue/eslint-config-typescript";
import pluginOxlint from "eslint-plugin-oxlint";
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
  ...pluginOxlint.configs["flat/recommended"],
];
