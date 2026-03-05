module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
      },
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': ['warn', { extensions: ['.jsx'] }],
    'import/extensions': ['error', 'ignorePackages', { js: 'never', jsx: 'never' }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    // Redux Toolkit (Immer) uses "mutating" style updates in reducers.
    'no-param-reassign': ['error', { props: false }],
    // Allow unused "_" parameters (common in map callbacks / thunk args).
    'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

    // We don't use prop-types in this project (state shape comes from API + Redux).
    'react/prop-types': 'off',
    'react/require-default-props': 'off',

    // Allow devDependencies imports in dev/test/e2e files.
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: [
        'vite.config.js',
        '**/*.test.js',
        '**/*.test.jsx',
        'src/setupTests.js',
        'cypress/**',
        'cypress.config.js',
      ],
    }],

    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'function-declaration',
        unnamedComponents: 'arrow-function',
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.test.js', '**/*.test.jsx', 'src/setupTests.js'],
      env: {
        jest: true,
      },
    },
    {
      files: ['cypress/**'],
      env: {
        mocha: true,
      },
    },
  ],
  ignorePatterns: ['dist', 'node_modules'],
};
