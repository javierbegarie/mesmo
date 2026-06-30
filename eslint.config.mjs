import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/dist',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
      '**/test-output',
      '**/out-tsc',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          // This workspace consumes libraries/modules as source (each project
          // exports src/index.ts via the `@org/source` condition), so apps
          // legitimately import non-buildable modules like @mesmo/candidates.
          enforceBuildableLibDependency: false,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          // Allowed import order: type:library => type:module => type:app.
          // A project may depend on its own tier and any lower (more reusable)
          // tier, never a higher one (e.g. a library cannot import a module).
          depConstraints: [
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: [
                'type:app',
                'type:module',
                'type:library',
              ],
            },
            {
              sourceTag: 'type:module',
              onlyDependOnLibsWithTags: ['type:module', 'type:library'],
            },
            {
              sourceTag: 'type:library',
              onlyDependOnLibsWithTags: ['type:library'],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
];
