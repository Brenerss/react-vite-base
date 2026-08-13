import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import checkFile from "eslint-plugin-check-file";

export default [
  {
    files: ["**/*.yaml", "**/*.webp"],
    processor: "check-file/eslint-processor-check-file",
  },
  {
    ignores: ["dist", "build", "node_modules", "eslint.config.js"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooks,
      "check-file": checkFile,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "check-file/no-index": "error",
      "check-file/filename-blocklist": [
        "error",
        {
          "**/*.model.ts": "*.models.ts",
          "**/*.util.ts": "*.utils.ts",
        },
      ],
      "check-file/folder-match-with-fex": [
        "error",
        {
          "*.test.{js,jsx,ts,tsx}": "**/__tests__/",
          "*.styled.{jsx,tsx}": "**/components/",
        },
      ],
      "check-file/filename-naming-convention": [
        "error",
        {
          "**/*.{jsx,tsx}": "PASCAL_CASE",
          "**/*.{js,ts}": "CAMEL_CASE",
        },
      ],
      "check-file/folder-naming-convention": [
        "error",
        {
          "src/components/*/": "PASCAL_CASE",
          "src/!(components)/**/!(__tests__)/": "CAMEL_CASE",
        },
      ],
    },
  },
];
