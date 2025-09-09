import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

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
  prettier
]
