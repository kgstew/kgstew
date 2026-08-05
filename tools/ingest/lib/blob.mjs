import { put, head } from '@vercel/blob'
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
export async function uploadOnce(pathname, buf, { dryRun = false, force = false } = {}) {
  // Report dry runs as "would upload" so the summary counts stay meaningful.
  if (dryRun) return { url: `dry-run://${pathname}`, skipped: false, bytes: buf.length }

  if (!BLOB_TOKEN) {
    throw new Error(
      'BLOB_READ_WRITE_TOKEN is not set.\n' +
        '  1. Create a Blob store: https://vercel.com/dashboard/stores\n' +
        '  2. Copy its read/write token\n' +
        '  3. export BLOB_READ_WRITE_TOKEN=... (or add it to tools/ingest/.env.local)'
    )
  }

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
