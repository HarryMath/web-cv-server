module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
    browser: false
  },
  ignorePatterns: ['.eslintrc.js', 'dist/**/*'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/explicit-function-return-type': 2,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-explicit-any': 1,
    'no-empty': 0,
    'camelcase': 1,
    'quotes': [2, 'single'],
    'semi': [2, 'always'],
    '@typescript-eslint/no-floating-promises': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    'prettier/prettier': [
      0,
      {
        'endOfLine': 'auto',
      }
    ]
  }
};
