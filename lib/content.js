import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const CONTENT_DIR = path.join(process.cwd(), 'data', 'blog')
const ASSET_DIR = path.join(process.cwd(), 'content', 'assets')

/** Recursively collect .mdx files, since some posts live in subdirectories. */
function walk(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) return walk(full)
    return e.isFile() && e.name.endsWith('.mdx') ? [full] : []
  })
}

function read(file) {
  const { data, content } = matter(fs.readFileSync(file, 'utf8'))
  const slug = path
    .relative(CONTENT_DIR, file)
    .replace(/\.mdx$/, '')
    .split(path.sep)
    .pop()

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ? new Date(data.date).toISOString() : null,
    summary: data.summary ?? '',
    tags: data.tags ?? [],
    draft: Boolean(data.draft),
    readingTime: Math.max(1, Math.round(readingTime(content).minutes)),
    body: content,
  }
}

/** Newest first. Drafts are excluded outside development. */
export function allPosts() {
  return walk(CONTENT_DIR)
    .map(read)
    .filter((p) => !p.draft || process.env.NODE_ENV === 'development')
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
}

export function postBySlug(slug) {
  return allPosts().find((p) => p.slug === slug) ?? null
}

export function allTags() {
  const counts = new Map()
  for (const p of allPosts()) for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1)
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
}

/**
 * Asset manifests written by tools/ingest. Read at build time only — the
 * published URLs are already in the JSON, so a build never touches Blob.
 */
export function assets(project) {
  const file = path.join(ASSET_DIR, `${project}.json`)
  if (!fs.existsSync(file)) return []
  return Object.values(JSON.parse(fs.readFileSync(file, 'utf8')).assets ?? {})
}

/** Best available <img src> for an asset, preferring the widest WebP. */
export function assetSrc(asset, width = 1200) {
  const list = asset.variants?.webp ?? asset.variants?.jpeg ?? []
  return (list.find((v) => v.w >= width) ?? list.at(-1))?.url ?? null
}
