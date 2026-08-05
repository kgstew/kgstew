import path from 'node:path'
import { fileURLToPath } from 'node:url'

/** Repo root, resolved from this file so the tool works from any cwd. */
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')

/**
 * Originals live in the repo for convenience but are gitignored — only the
 * captions sidecars are tracked. They are never uploaded; only derivatives are.
 * Override with ASSETS_ROOT.
 */
export const ASSETS_ROOT = process.env.ASSETS_ROOT || path.join(REPO_ROOT, 'originals')

/** Manifests are small JSON and DO get committed — they're the site's content. */
export const MANIFEST_DIR = process.env.MANIFEST_DIR || path.join(REPO_ROOT, 'content/assets')

export const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || null

/** Derivative widths. Never upscale past the original. */
export const WIDTHS = [400, 800, 1200, 2000]

/** One JPEG is kept at this width for social cards and right-click-save. */
export const JPEG_WIDTH = 1600

export const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.heic', '.heif', '.tif', '.tiff', '.webp'])
export const VIDEO_EXT = new Set(['.mov', '.mp4', '.m4v', '.avi'])

/** Silent autoplay loops: short, muted, small. Anything longer belongs on a stream host. */
export const LOOP_MAX_SECONDS = 6
export const LOOP_WIDTH = 1280

/** Roles drive layout. `hero` may loop/lead; `process` and `detail` fill galleries. */
export const ROLES = ['hero', 'process', 'detail']

export const CONCURRENCY = { image: 4, video: 2 }
