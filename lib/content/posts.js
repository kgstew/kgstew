import path from 'node:path'
import { CONTENT_ROOT, walk, readDoc, memo } from './mdx.js'
import { parsePost } from './schema.js'
import { deepFreeze } from './disclosure.js'
import { projectBySlug } from './projects.js'

const WRITING_DIR = path.join(CONTENT_ROOT, 'writing')

function load() {
  return walk(WRITING_DIR)
    .map((file) => {
      const { data, body, slug, file: rel } = readDoc(file, WRITING_DIR)
      return parsePost(data, body, rel, slug)
    })
    .filter((p) => p.status === 'published')
    .map((post) => {
      // A post must not link to a project that doesn't publish. `projectBySlug`
      // already excludes embargoed ones, so this drops the reference rather
      // than rendering a link into a 404.
      if (post.project && !projectBySlug(post.project)) {
        return deepFreeze({ ...post, project: null })
      }
      return deepFreeze(post)
    })
    .sort((a, b) => (b.day ?? b.date).localeCompare(a.day ?? a.date))
}

/** Published posts, newest first. */
export function allPosts() {
  return memo('posts', load)
}

export function postBySlug(slug) {
  return allPosts().find((p) => p.slug === slug) ?? null
}

export function postSlugs() {
  return allPosts().map((p) => p.slug)
}

export function postsForProject(slug) {
  return allPosts().filter((p) => p.project === slug)
}
