/**
 * The only content surface pages may import.
 *
 * Everything returned here has been validated, redacted according to its
 * disclosure level, and deep-frozen. The modules behind this file are reachable
 * but linted against from `app/` and `components/` — see the
 * `no-restricted-imports` rule in eslint.config.mjs — so a page physically
 * cannot read a raw content file and skip the checks.
 */

export {
  allProjects,
  projectBySlug,
  projectSlugs,
  featuredProjects,
  disciplineCounts,
} from './projects.js'

export { allPosts, postBySlug, postSlugs, postsForProject } from './posts.js'

export {
  assets,
  assetsByRole,
  heroAsset,
  assetBySource,
  srcSet,
  assetSrc,
  ogImage,
} from './assets.js'

export { CONTEXTS, DISCIPLINES, DISCIPLINE_IDS, ACCENTS, disciplineLabel } from './taxonomy.js'
