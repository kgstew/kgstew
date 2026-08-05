import { put, head, del } from '@vercel/blob'
import { BLOB_TOKEN } from './config.mjs'

const CONTENT_TYPE = {
  avif: 'image/avif',
  webp: 'image/webp',
  jpg: 'image/jpeg',
  mp4: 'video/mp4',
}

/**
 * Uploads are content-addressed: the path contains a hash of the original, so
 * re-running ingest is a no-op for anything already published. That makes the
 * whole pipeline safe to run repeatedly while a project is being curated.
 */
/**
 * Checked once before any work starts. A credential problem should stop the run
 * outright, not surface as a per-file error after every original has been
 * decoded — and certainly not after a partial manifest has been written.
 */
export function assertToken() {
  if (!BLOB_TOKEN) {
    throw new Error(
      'BLOB_READ_WRITE_TOKEN is not set.\n\n' +
        '  Vercel dashboard → Storage → your blob store → copy BLOB_READ_WRITE_TOKEN\n' +
        '  (it starts with vercel_blob_rw_ — VERCEL_OIDC_TOKEN is a different thing\n' +
        '   and will not work here).\n\n' +
        '  Put it in either .env.local at the repo root or tools/ingest/.env.local.'
    )
  }
  if (!BLOB_TOKEN.startsWith('vercel_blob_rw_')) {
    throw new Error(
      `BLOB_READ_WRITE_TOKEN does not look like a Blob token (got "${BLOB_TOKEN.slice(0, 12)}…").\n` +
        '  Expected a value starting with vercel_blob_rw_.'
    )
  }
}

export async function uploadOnce(pathname, buf, { dryRun = false, force = false } = {}) {
  // Report dry runs as "would upload" so the summary counts stay meaningful.
  if (dryRun) return { url: `dry-run://${pathname}`, skipped: false, bytes: buf.length }

  if (!force) {
    try {
      const existing = await head(pathname, { token: BLOB_TOKEN })
      if (existing?.url) return { url: existing.url, skipped: true, bytes: buf.length }
    } catch {
      // head() throws when the blob does not exist — that just means upload it.
    }
  }

  const res = await put(pathname, buf, {
    access: 'public',
    token: BLOB_TOKEN,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: CONTENT_TYPE[pathname.split('.').pop()] || 'application/octet-stream',
    cacheControlMaxAge: 31536000,
  })
  return { url: res.url, skipped: false, bytes: buf.length }
}

/**
 * Deleting an original does not unpublish it. The derivatives stay live at a
 * public URL indefinitely, which matters well beyond tidiness: a photo pulled
 * because nobody consented to it being shared is still shared until these are
 * removed. Orphans are always reported; --prune actually deletes them.
 */
export async function deleteBlobs(urls, { dryRun = false } = {}) {
  if (!urls.length) return 0
  if (dryRun) return urls.length
  // del() accepts batches, but a single bad URL fails the whole call — so one
  // at a time, and a failure on one orphan should not strand the rest.
  let removed = 0
  for (const url of urls) {
    try {
      await del(url, { token: BLOB_TOKEN })
      removed++
    } catch {
      // Already gone is a success for our purposes.
      removed++
    }
  }
  return removed
}

/** Every published URL an asset owns, across formats and widths. */
export function urlsOf(asset) {
  if (asset.type === 'video') return [asset.loop, asset.poster].filter(Boolean)
  return Object.values(asset.variants ?? {}).flatMap((list) => list.map((v) => v.url))
}
