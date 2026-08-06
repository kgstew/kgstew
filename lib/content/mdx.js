import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

export const CONTENT_ROOT = path.join(process.cwd(), 'content')

/** Recursive .mdx collector. Returns absolute paths, sorted for stable output. */
export function walk(dir) {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) => {
      const full = path.join(dir, e.name)
      if (e.isDirectory()) return walk(full)
      return e.isFile() && e.name.endsWith('.mdx') ? [full] : []
    })
    .sort()
}

/**
 * Read one file. The slug comes from the filename and is never read from
 * frontmatter — one source of truth, so a slug and its URL cannot drift apart.
 */
export function readDoc(file, root) {
  const { data, content } = matter(fs.readFileSync(file, 'utf8'))
  const slug = path.relative(root, file).replace(/\.mdx$/, '').split(path.sep).join('/')
  return { data, body: content, slug, file: path.relative(process.cwd(), file) }
}

/**
 * Validation and the leak scan are too expensive to redo on every call across
 * a static build, but a cache makes content edits invisible in dev.
 */
const cache = new Map()
export function memo(key, compute) {
  if (process.env.NODE_ENV === 'development') return compute()
  if (!cache.has(key)) cache.set(key, compute())
  return cache.get(key)
}
