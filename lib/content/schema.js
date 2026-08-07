import {
  CONTEXTS,
  DISCIPLINE_IDS,
  ACCENTS,
  DISCLOSURE_LEVELS,
  STATUSES,
} from './taxonomy.js'

const CARD_MAX = 140
const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/

class ContentError extends Error {
  constructor(file, field, message) {
    super(`${file}\n  ${field}: ${message}`)
    this.name = 'ContentError'
    this.file = file
    this.field = field
  }
}

const fail = (file, field, message) => {
  throw new ContentError(file, field, message)
}

const oneOf = (value, allowed, file, field) => {
  if (!allowed.includes(value)) {
    fail(file, field, `expected one of ${allowed.join(' | ')}, got ${JSON.stringify(value)}`)
  }
  return value
}

/**
 * Dates are `YYYY-MM` strings, validated by shape and never handed to
 * `new Date()`.
 *
 * The old frontmatter had `date: '2023-4-21'`, which only parses via a
 * non-standard V8 fallback, and unquoted values like `2024-01-10` become a Date
 * object in gray-matter but a string everywhere else. Requiring a quoted,
 * zero-padded month removes both failure modes.
 */
const month = (value, file, field, { allowOngoing = false } = {}) => {
  if (allowOngoing && value === 'ongoing') return 'ongoing'
  if (typeof value !== 'string' || !MONTH.test(value)) {
    fail(
      file,
      field,
      `expected a quoted 'YYYY-MM'${allowOngoing ? " or 'ongoing'" : ''}, got ${JSON.stringify(value)}`
    )
  }
  return value
}

function collaborators(raw, file) {
  if (raw == null) return []
  if (!Array.isArray(raw)) fail(file, 'collaborators', 'expected a list')
  return raw.map((c, i) => {
    if (!c?.name) fail(file, `collaborators[${i}].name`, 'required')
    return { name: c.name, credit: c.credit ?? '', ...(c.url ? { url: c.url } : {}) }
  })
}

/**
 * Validate one project's frontmatter.
 *
 * Everything is checked eagerly and nothing has a silent default. A missing
 * `disclosure` throws rather than falling back to the safest value: a default
 * teaches you to omit the field, and a red build is louder than a page that
 * quietly went missing.
 */
export function parseProject(raw, body, file, slug) {
  const status = oneOf(raw.status ?? 'published', STATUSES, file, 'status')
  const published = status === 'published'

  if (!raw.title) fail(file, 'title', 'required')

  // `card` is the human stake — the line that goes on a listing. Capped so it
  // cannot quietly become a second summary, and required to publish because a
  // card is the only thing most visitors will ever read about a project.
  if (published && !raw.card) fail(file, 'card', 'required to publish')
  if (raw.card && raw.card.length > CARD_MAX) {
    fail(file, 'card', `${raw.card.length} chars, max ${CARD_MAX} — write a summary instead`)
  }

  const disclosure = oneOf(raw.disclosure, DISCLOSURE_LEVELS, file, 'disclosure')

  // The site repo is public, so a withheld name in tracked frontmatter leaks on
  // GitHub whether or not a page ever renders it. Under work-only these keys
  // are a validation error, not something to elide at render time. Use
  // `clientDescriptor` for a phrase that is safe to commit and safe to show.
  if (disclosure !== 'open') {
    for (const key of ['client', 'destination']) {
      if (raw[key] != null) {
        fail(
          file,
          key,
          `not permitted when disclosure is '${disclosure}' — this repo is public, so the ` +
            `value would leak even though no page renders it. Use clientDescriptor instead.`
        )
      }
    }
  }

  const disciplines = raw.disciplines ?? []
  if (!Array.isArray(disciplines) || disciplines.length === 0) {
    fail(file, 'disciplines', 'expected a non-empty list')
  }
  disciplines.forEach((d, i) => oneOf(d, DISCIPLINE_IDS, file, `disciplines[${i}]`))

  return {
    slug,
    title: raw.title,
    card: raw.card ?? '',
    summary: raw.summary ?? '',
    context: oneOf(raw.context, CONTEXTS, file, 'context'),
    disciplines,
    role: raw.role ?? '',
    started: month(raw.started, file, 'started'),
    ended: month(raw.ended ?? 'ongoing', file, 'ended', { allowOngoing: true }),
    disclosure,
    ...(raw.client ? { client: raw.client } : {}),
    ...(raw.clientDescriptor ? { clientDescriptor: raw.clientDescriptor } : {}),
    ...(raw.destination ? { destination: raw.destination } : {}),
    ...(raw.embargoUntil ? { embargoUntil: month(raw.embargoUntil, file, 'embargoUntil') } : {}),
    collaborators: collaborators(raw.collaborators, file),
    outcome: raw.outcome ?? '',
    accent: oneOf(raw.accent ?? 'signal', ACCENTS, file, 'accent'),
    assets: raw.assets ?? null,
    links: Array.isArray(raw.links) ? raw.links : [],
    weight: Number.isFinite(raw.weight) ? raw.weight : 1000,
    status,
    body,
    file,
  }
}

/** ~200 wpm, floored at a minute. Close enough, and it sets expectations. */
const readingMinutes = (body) => Math.max(1, Math.round(body.trim().split(/\s+/).length / 200))

export function parsePost(raw, body, file, slug) {
  if (!raw.title) fail(file, 'title', 'required')

  return {
    slug,
    title: raw.title,
    date: month(String(raw.date ?? '').slice(0, 7), file, 'date'),
    day: typeof raw.date === 'string' ? raw.date : null,
    summary: raw.summary ?? '',
    readingTime: readingMinutes(body),
    project: raw.project ?? null,
    topics: raw.topics ?? [],
    status: oneOf(raw.status ?? 'published', STATUSES, file, 'status'),
    body,
    file,
  }
}

export { ContentError }
