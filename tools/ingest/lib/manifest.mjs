import fs from 'node:fs/promises'
import path from 'node:path'
import { MANIFEST_DIR } from './config.mjs'
import { exists } from './util.mjs'
import { sortAssets } from '../../../lib/asset-order.js'

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

export async function writeManifest(
  project,
  assets,
  { generatedAt, dry = false, pendingDeletion = [] }
) {
  await fs.mkdir(MANIFEST_DIR, { recursive: true })

  // Shared with the site's reader so the two can never disagree.
  const sorted = sortAssets(assets)

  const doc = {
    project,
    generatedAt,
    count: sorted.length,
    // Derivatives of removed originals that are still live on Blob. Persisted
    // so the record survives the run that noticed them — otherwise writing the
    // manifest is what destroys the only list of what needs deleting.
    ...(pendingDeletion.length ? { pendingDeletion } : {}),
    assets: Object.fromEntries(sorted.map((a) => [a.id, a])),
  }
  const p = manifestPath(project, { dry })
  await fs.writeFile(p, JSON.stringify(doc, null, 2) + '\n', 'utf8')
  return p
}
