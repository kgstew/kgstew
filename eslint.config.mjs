import js from '@eslint/js'
// v16 exports a flat-config array, not a factory. Calling it throws
// "next is not a function", which is how this config shipped broken.
import next from 'eslint-config-next/core-web-vitals'

/**
 * Content may only be read through `lib/content` — the single surface that
 * validates, redacts by disclosure level, and freezes what it returns.
 *
 * Without this a page could `readFileSync` a project's MDX and render the
 * client name a `work-only` project exists to withhold. The restriction is what
 * turns "remember to use the loader" into something the build enforces.
 */
const contentBoundary = {
  files: ['app/**/*.{js,jsx}', 'components/**/*.{js,jsx}'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'node:fs',
            message: 'Pages must not read the filesystem. Import from @/lib/content instead.',
          },
          {
            name: 'fs',
            message: 'Pages must not read the filesystem. Import from @/lib/content instead.',
          },
          {
            name: 'gray-matter',
            message: 'Parse content in lib/content, not in a page — it bypasses disclosure.',
          },
        ],
        patterns: [
          {
            group: ['@/lib/content/*', '../lib/content/*', '**/lib/content/*'],
            message:
              'Import from @/lib/content (the index) — the internal modules skip redaction.',
          },
          {
            group: ['@/content/*', '**/content/work/*', '**/content/writing/*'],
            message: 'Never import a content file directly. Use @/lib/content.',
          },
        ],
      },
    ],
  },
}

const config = [
  { ignores: ['.next/**', 'node_modules/**', 'tools/**', 'originals/**'] },
  js.configs.recommended,
  ...next,
  contentBoundary,
  {
    rules: {
      // `const { client, ...rest } = obj` is the clearest way to express
      // "everything except this key", and it's exactly what the disclosure
      // tests assert on.
      'no-unused-vars': ['error', { ignoreRestSiblings: true, argsIgnorePattern: '^_' }],
    },
  },
]

export default config
