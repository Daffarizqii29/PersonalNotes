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
    'no-param-reassign': ['error', { props: false }],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

    'react/prop-types': 'off',
    'react/require-default-props': 'off',

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
      rules: {
        'max-len': 'off',
      },
    },
    {
      files: ['cypress/**/*.{js,jsx,ts,tsx}'],
      env: {
        mocha: true,
      },
      globals: {
        cy: 'readonly',
        Cypress: 'readonly',
        expect: 'readonly',
        assert: 'readonly',
        chai: 'readonly',
      },
      rules: {
        'max-len': 'off',
      },
    },
  ],
  ignorePatterns: ['dist', 'node_modules'],
};