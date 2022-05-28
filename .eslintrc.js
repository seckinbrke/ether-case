module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin','import'],
  extends: ['airbnb-base','airbnb-typescript/base'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    "max-classes-per-file":"off",
    "import/prefer-default-export":"off",
    "import/no-cycle":"off",
    "max-len": ["error", { "code":160, "tabWidth": 2 }],
    "prefer-arrow-callback": ["error", { "allowNamedFunctions": true }],
    "no-underscore-dangle": ["error", { "allow": ["_id", "_doc"] }],
    "no-prototype-builtins": "warn",
    "no-restricted-properties": "off",
    "operator-linebreak": "off",
    //"brace-style": ["error", "stroustrup"],
    //"indent": ["error", 2],
    "@typescript-eslint/naming-convention": [
      "warn",
      {
        selector: "variable",
        format: ["camelCase",'PascalCase','UPPER_CASE'],
        leadingUnderscore: 'allow',
      },
    ],
  },
};
