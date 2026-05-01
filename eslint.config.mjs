// eslint.config.js
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/coverage/**', '**/.next/**'],
  },
  {
    rules: {
      semi: 'error',
      'prefer-const': 'error',
    },
  },
]);
