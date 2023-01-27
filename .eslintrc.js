module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json"],
    sourceType: "module",
  },
  ignorePatterns: ["/build/**/*", "jest.config.js", ".eslintrc.js"],
  plugins: ["@typescript-eslint", "import"],
  rules: {
    quotes: ["error", "double"],
    "import/no-unresolved": 0,
    "object-curly-spacing": "off",
    indent: "off",
    "comma-dangle": ["error", "never"],
  },

  settings: {
    "import/resolver": {
      node: {
        extensions: [".json", ".ts"],
        moduleDirectory: ["node_modules", "src/"],
      },
    },
  },
};
