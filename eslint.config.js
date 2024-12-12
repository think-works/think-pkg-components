import prettier from "eslint-config-prettier";
import react from "eslint-plugin-react";
import hooks from "eslint-plugin-react-hooks";
import globals from "globals";
import ts from "typescript-eslint";
import eslint from "@eslint/js";

export default [
  {
    ignores: ["**/.github/**", "**/dist/**", "**/build/**", "**/iconfont/**"],
  },
  eslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  ...ts.configs.recommended,
  prettier,
  {
    languageOptions: {
      parser: ts.parser,
      globals: { ...globals.browser },
    },
    plugins: {
      react,
      "react-hooks": hooks,
      "@typescript-eslint": ts.plugin,
    },
    rules: {
      ...hooks.configs.recommended.rules,
      "no-debugger": ["warn"],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "react-hooks/exhaustive-deps": ["error"],
      "@typescript-eslint/ban-ts-comment": ["off"],
      "@typescript-eslint/no-explicit-any": ["off"],
      "@typescript-eslint/no-empty-object-type": ["off"],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/no-unused-expressions": [
        "warn",
        {
          allowTernary: true,
          allowShortCircuit: true,
        }
      ],
    },
  },
];
