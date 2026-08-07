/**
 * Report ingested assets that no page renders.
 *
 * The crew photograph on Fable Bound was ingested, captioned, uploaded and live
 * at a public URL, and appeared on no page for weeks. Four images carried
 * `role: hero`; `heroAsset()` returns the first one by order, so the other three
 * rendered nowhere and nothing anywhere said so. From the outside that is
 * indistinguishable from a failed ingest, which is how it was reported.
 *
 * This reconstructs what a project page actually renders and diffs it against
 * the manifest. It mirrors the placement logic in app/(draft)/work/[slug]/page.js
 * rather than importing it, because that module is a server component — so the
 * two can drift. The acceptance test for this script is that it finds the three
 * Fable Bound orphans; if page.js changes how it places assets and this is not
 * updated, that test starts failing rather than the check going quiet.
 *
 * Exits 0 with findings on purpose. An unplaced asset is an editorial loose end,
 * not a disclosure risk — only Kyle can decide where a photograph belongs, and a
 * hard failure would block committing until he did. The leak scan is the
 * opposite case and does fail.
 */
import fs from 'node:fs'
import path from 'node:path'
import { sortAssets } from '../lib/asset-order.js'

const ASSET_DIR = 'content/assets'
const WORK_DIR = 'content/work'

// Roles the project page renders as a gallery. Kept as data so adding a gallery
// to the page is a one-line change here too.
const GALLERY_ROLES = ['process', 'detail']

/**
 * `assets` in the manifest is an object keyed by id, not an array. The first
 * version of this file did `.assets ?? []` and tested `!all.length`, which is
 * always true for an object — so it silently skipped every project and reported
 * a clean run. Going through the same sortAssets the site uses avoids both that
 * and the `Object.values` ordering trap documented in lib/asset-order.js.
 */
function manifestAssets(key) {
  const file = path.join(ASSET_DIR, `${key}.json`)
  if (!fs.existsSync(file)) return []
  const raw = JSON.parse(fs.readFileSync(file, 'utf8')).assets
  if (!raw || typeof raw !== 'object') return []
  return sortAssets(raw)
}

function placedInBody(body) {
  // Only string props survive next-mdx-remote v6, so every explicit placement is
  // a literal src="..." and a regex sees all of them.
  return new Set([...body.matchAll(/src="([^"]+)"/g)].map((m) => m[1]))
}

let totalOrphans = 0
let projectsInspected = 0
let assetsInspected = 0

for (const file of fs.readdirSync(WORK_DIR).filter((f) => f.endsWith('.mdx'))) {
  const slug = path.basename(file, '.mdx')
  const raw = fs.readFileSync(path.join(WORK_DIR, file), 'utf8')

  // The manifest key is the `assets:` frontmatter value, which is usually but
  // not necessarily the slug.
  const keyMatch = raw.match(/^assets:\s*(\S+)\s*$/m)
  const key = keyMatch ? keyMatch[1].replace(/['"]/g, '') : slug

  const all = manifestAssets(key)
  if (!all.length) continue
  projectsInspected += 1
  assetsInspected += all.length

  const body = raw.replace(/^---\n[\s\S]*?\n---\n/, '')
  const explicit = placedInBody(body)

  const rendered = new Set()

  // The hero: first image with role hero, by manifest order.
  const hero = all.find((a) => a.type === 'image' && a.role === 'hero')
  if (hero) rendered.add(hero.source)

  // Hero videos are placed in the body when the body references any video,
  // otherwise stacked under the hero image.
  const bodyRefsLoop = /src="[^"]+\.(?:MOV|MP4|mp4|mov)"/.test(body)
  if (!bodyRefsLoop) {
    for (const a of all) if (a.role === 'hero' && a.type === 'video') rendered.add(a.source)
  }

  for (const a of all) {
    if (GALLERY_ROLES.includes(a.role)) rendered.add(a.source)
    if (explicit.has(a.source)) rendered.add(a.source)
  }

  const orphans = all.filter((a) => !rendered.has(a.source))
  if (!orphans.length) continue

  totalOrphans += orphans.length
  console.log(`\n${slug} — ${orphans.length} asset(s) render nowhere:`)
  for (const a of orphans) {
    const why =
      a.role === 'hero'
        ? 'role: hero, but the page renders only the first hero image'
        : `role: ${a.role || '(none)'} — no page renders this role`
    console.log(`  ${a.source.padEnd(30)} ${why}`)
  }
  console.log(`  Fix: place it with <Figure project="${key}" src="..." />, or change its role.`)
}

// Report the denominator. "No orphans" and "inspected nothing" print
// identically otherwise, which is how the first version of this check passed.
if (assetsInspected === 0) {
  console.log('\n[assets] no manifests found — nothing was inspected')
} else if (totalOrphans === 0) {
  console.log(
    `\n[assets] ${assetsInspected} asset(s) across ${projectsInspected} project(s), all rendered`
  )
} else {
  console.log(
    `\n[assets] ${totalOrphans} of ${assetsInspected} asset(s) render nowhere. ` +
      'Ingested and public, but on no page.'
  )
}
