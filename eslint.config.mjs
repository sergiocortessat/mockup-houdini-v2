import { FlatCompat } from '@eslint/eslintrc';
import unicornPlugin from 'eslint-plugin-unicorn';

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ['next/core-web-vitals'],
  }),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      unicorn: unicornPlugin,
    },
    rules: {
      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase',
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['./*', '../*'],
              message:
                'Please use the @ alias for imports (e.g., @/wallet/constants) instead of relative paths.',
            },
          ],
        },
      ],
    },
  },
  {
    ignores: [
      '**/.next',
      '**/.cache',
      '**/public',
      '**/node_modules',
      '**/dist',
      '**/.turbo',
      '**/.vercel',
      '**/coverage',
      '**/.DS_Store',
      '*.log',
      '**/next-env.d.ts',
      '**/.env*',
      '**/.vscode',
      '**/.idea',
      '**/graphql/generated.ts',
    ],
  },
];

export default eslintConfig;
