import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import globals from 'globals'
import { FlatCompat } from '@eslint/eslintrc'
import { join } from 'node:path'

const compat = new FlatCompat({
  baseDirectory: join(import.meta.dirname, 'web'),
  recommendedConfig: js.configs.recommended
})

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },
  ...compat.config({
    root: true,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true
      }
    },
    env: {
      browser: true,
      commonjs: true,
      es6: true
    },
    ignorePatterns: ['!**/.server', '!**/.client'],
    // Base config
    extends: ['eslint:recommended'],
    overrides: [
      // React
      {
        files: ['**/*.{js,jsx,ts,tsx}'],
        plugins: ['react', 'jsx-a11y'],
        extends: [
          'plugin:react/recommended',
          'plugin:react/jsx-runtime',
          'plugin:react-hooks/recommended',
          'plugin:jsx-a11y/recommended'
        ],
        settings: {
          react: {
            version: 'detect'
          },
          formComponents: ['Form'],
          linkComponents: [
            { name: 'Link', linkAttribute: 'to' },
            { name: 'NavLink', linkAttribute: 'to' }
          ],
          'import/resolver': {
            typescript: {}
          }
        }
      },
      // Typescript
      {
        files: ['**/*.{ts,tsx}'],
        plugins: ['@typescript-eslint', 'import'],
        parser: '@typescript-eslint/parser',
        settings: {
          'import/internal-regex': '^~/',
          'import/resolver': {
            node: {
              extensions: ['.ts', '.tsx']
            },
            typescript: {
              alwaysTryTypes: true,
              project: './web/tsconfig.json'
            }
          }
        },
        extends: [
          'plugin:@typescript-eslint/recommended',
          'plugin:import/recommended',
          'plugin:import/typescript'
        ]
      }
    ]
  }),
  {
    files: ['./*'],
    rules: {
      'import/no-anonymous-default-export': 'off'
    }
  },
  prettier
]
