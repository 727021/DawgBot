import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import globals from 'globals'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname
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
    extends: ['next'],
    settings: {
      next: {
        rootDor: 'web/'
      }
    },
    rules: {
      '@next/next/no-html-link-for-pages': 'off'
    }
  }),
  {
    files: ['./*'],
    rules: {
      'import/no-anonymous-default-export': 'off'
    }
  },
  prettier
]
