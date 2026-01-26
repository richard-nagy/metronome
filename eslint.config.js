import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
    { ignores: ["dist"] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: 2021,
            globals: globals.browser,
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
        },
        plugins: {
            react: reactPlugin,
            "react-refresh": reactRefresh,
            prettier: prettierPlugin,
            "react-hooks": reactHooks,
        },
        rules: {
            ...reactPlugin.configs.recommended.rules,
            ...prettierConfig.rules,
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
            "prettier/prettier": "error",
            "react/react-in-jsx-scope": "off",
            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true },
            ],
            "no-console": ["error", { allow: ["warn", "error"] }],
            eqeqeq: ["error", "always"],
            "prefer-const": "error",
            semi: ["error", "always"],
            camelcase: ["error", { properties: "always" }],
        },
        settings: {
            react: { version: "detect" },
        },
    },
);
