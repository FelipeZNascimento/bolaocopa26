export default {
  extends: [
    "stylelint-config-standard-scss",
    "stylelint-config-recommended-vue/scss",
    "stylelint-config-recess-order",
  ],
  ignoreFiles: [
    "**/dist/**",
    "**/dist-ssr/**",
    "**/coverage/**",
    "**/dev-dist/**",
    "**/node_modules/**",
  ],
  plugins: ["@stylistic/stylelint-plugin"],
  rules: {
    // Enforce consistent indentation
    "@stylistic/indentation": 2,

    // Allow unknown CSS variables and functions
    "function-no-unknown": null,
    // Allow empty sources (e.g., <style> blocks with just imports)
    "no-empty-source": null,

    // Allow custom properties without vendor prefixes
    "property-no-vendor-prefix": null,

    // Disable SCSS specific rules if needed
    "scss/at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "tailwind",
          "apply",
          "variants",
          "responsive",
          "screen",
        ],
      },
    ],

    // Disable class pattern enforcement (allows BEM, camelCase, etc.)
    "selector-class-pattern": null,

    "value-no-vendor-prefix": null,
  },
};
