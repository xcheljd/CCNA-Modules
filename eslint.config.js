const js = require('@eslint/js');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const prettier = require('eslint-plugin-prettier');
const babelParser = require('@babel/eslint-parser');

const sharedParserOptions = {
  ecmaVersion: 2021,
  sourceType: 'module',
  ecmaFeatures: { jsx: true },
  requireConfigFile: false,
  babelOptions: { presets: ['@babel/preset-react'] },
};

const sharedRules = {
  'react/jsx-uses-react': 'error',
  'react/jsx-uses-vars': 'error',
  'react/prop-types': 'off',
  'react/react-in-jsx-scope': 'off',
  'react-hooks/rules-of-hooks': 'error',
  'react-hooks/exhaustive-deps': 'warn',
  'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  'no-console': 'off',
  'prefer-const': 'warn',
  'no-var': 'error',
  'prettier/prettier': 'warn',
};

const sharedSettings = { react: { version: 'detect' } };

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      parser: babelParser,
      parserOptions: sharedParserOptions,
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        alert: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        electronAPI: 'readonly',
      },
    },
    plugins: { react, 'react-hooks': reactHooks, prettier },
    rules: sharedRules,
    settings: sharedSettings,
  },
  {
    files: ['src/**/*.test.js', 'src/**/*.test.jsx'],
    languageOptions: {
      parser: babelParser,
      parserOptions: sharedParserOptions,
      globals: {
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        module: 'readonly',
        require: 'readonly',
        global: 'readonly',
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        process: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
    plugins: { react, 'react-hooks': reactHooks, prettier },
    rules: sharedRules,
    settings: sharedSettings,
  },
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '*.config.js',
      'webpack.config.js',
      'jest.config.js',
      'jest.setup.js',
      'jest.file-mock.js',
      '.babelrc',
      '.eslintrc.*',
    ],
  },
];
