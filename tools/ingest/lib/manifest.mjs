import fs from 'node:fs/promises'
import path from 'node:path'
import { MANIFEST_DIR } from './config.mjs'
import { exists } from './util.mjs'

/**
 * One manifest per project. Small, committed, and the only thing the site reads —
 * so a build never touches originals and never needs the Blob token.
 */
export function manifestPath(project, { dry = false } = {}) {
  return path.join(MANIFEST_DIR, `${project}${dry ? '.dry' : ''}.json`)
}

export async function readManifest(project) {
  const p = manifestPath(project)
  if (!(await exists(p))) return { project, generatedAt: null, assets: {} }
  return JSON.parse(await fs.readFile(p, 'utf8'))
}

export async function writeManifest(project, assets, { generatedAt, dry = false }) {
  await fs.mkdir(MANIFEST_DIR, { recursive: true })

  const roleWeight = { hero: 0, process: 1, detail: 2 }
  const sorted = Object.values(assets).sort((a, b) => {
    const r = (roleWeight[a.role] ?? 3) - (roleWeight[b.role] ?? 3)
    if (r) return r
    const o = (a.order ?? 1e9) - (b.order ?? 1e9)
    if (o) return o
    return (a.capturedAt ?? '').localeCompare(b.capturedAt ?? '') || a.source.localeCompare(b.source)
  })

  const doc = {
    project,
    generatedAt,
    count: sorted.length,
    assets: Object.fromEntries(sorted.map((a) => [a.id, a])),
  }
  const p = manifestPath(project, { dry })
  await fs.writeFile(p, JSON.stringify(doc, null, 2) + '\n', 'utf8')
  return p
}
