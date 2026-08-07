import fs from 'node:fs'
import path from 'node:path'
import { CONTENT_ROOT, walk, readDoc, memo } from './mdx.js'
import { parseProject } from './schema.js'
import { applyDisclosure, assertNoRedactedTerms } from './disclosure.js'
import { assets } from './assets.js'
import { DISCIPLINES } from './taxonomy.js'

const WORK_DIR = path.join(CONTENT_ROOT, 'work')
const REDACTIONS = path.join(CONTENT_ROOT, 'private', 'redactions.json')

/**
 * Terms that must never appear in published output. Gitignored, so it holds the
 * real strings. Absent is not an error — a fresh clone has to be able to build —
 * but it does mean the scan is a no-op, so a warning is worth the noise.
 */
function redactionTerms() {
  if (!fs.existsSync(REDACTIONS)) {
    if (process.env.NODE_ENV !== 'test') {
      console.warn('[content] no content/private/redactions.json — leak scan skipped')
    }
    return []
  }
  const parsed = JSON.parse(fs.readFileSync(REDACTIONS, 'utf8'))
  return Array.isArray(parsed) ? parsed : (parsed.terms ?? [])
}

function load() {
  const terms = redactionTerms()

  return walk(WORK_DIR)
    .map((file) => {
      const { data, body, slug, file: rel } = readDoc(file, WORK_DIR)
      return parseProject(data, body, rel, slug)
    })
    .filter((p) => p.status === 'published')
    .map((project) => {
      // Redact before scanning: a work-only project may legitimately have had a
      // client name in frontmatter stripped, and we scan what actually ships.
      const redacted = applyDisclosure(project)
      if (!redacted) return null
      assertNoRedactedTerms(redacted, assets(redacted.assets), terms)
      return redacted
    })
    .filter(Boolean)
    .sort((a, b) => a.weight - b.weight || b.started.localeCompare(a.started))
}

/** Published, non-embargoed projects in curated order. Never date order. */
export function allProjects() {
  return memo('projects', load)
}

export function projectBySlug(slug) {
  return allProjects().find((p) => p.slug === slug) ?? null
}

/**
 * Slugs for generateStaticParams. Derived from the same filtered list as
 * allProjects(), so an embargoed project cannot get a route emitted for it.
 */
export function projectSlugs() {
  return allProjects().map((p) => p.slug)
}

export function featuredProjects(n = 3) {
  return allProjects().slice(0, n)
}

/** Disciplines that actually appear, with counts, in declaration order. */
export function disciplineCounts() {
  const counts = new Map()
  for (const p of allProjects()) {
    for (const d of p.disciplines) counts.set(d, (counts.get(d) ?? 0) + 1)
  }
  return DISCIPLINES.filter((d) => counts.has(d.id)).map((d) => ({
    ...d,
    count: counts.get(d.id),
  }))
}
