/**
 * Closed vocabularies. Everything here is validated against at load time, so an
 * unknown value is a build error rather than a silently empty filter chip.
 *
 * The old tag list mixed four axes — audience (`professional`), medium
 * (`software`, `hardware`), activity (`create`, `volunteer`) and domain
 * (`community`, `hospitality`) — which is why nothing could be filtered
 * meaningfully. These are two axes, and only one of them is user-facing.
 */

/** Which hat. One per project, required. */
export const CONTEXTS = ['professional', 'art', 'community']

/**
 * What the making required. Multi-value, and the only filter on /work.
 *
 * Rule for adding a term: it needs three projects. `show-control` is currently
 * admitted below that bar on the strength of three staged-but-unwritten show
 * pieces; if they don't materialise, fold it into `embedded`.
 */
export const DISCIPLINES = [
  { id: 'software', label: 'Software', blurb: 'Web, backend, apps, data' },
  { id: 'embedded', label: 'Embedded', blurb: 'Firmware, microcontrollers, real-time signal' },
  { id: 'fabrication', label: 'Fabrication', blurb: 'Wood, steel, welding, structures' },
  { id: 'show-control', label: 'Show control', blurb: 'Light, sound, motion, sequencing' },
  { id: 'organizing', label: 'Organizing', blurb: 'Recruiting, training and running crews' },
  { id: 'operations', label: 'Operations', blurb: 'Budget, logistics, keeping a thing alive' },
]

export const DISCIPLINE_IDS = DISCIPLINES.map((d) => d.id)

/**
 * Accent tokens, named for where the colour was sampled from rather than what
 * it looks like. A closed set because a free hex is invisible to the Tailwind
 * JIT and an unbounded palette stops being a palette.
 *
 * Hex values live in app/styles/accents.css — this is only the allowed names.
 */
export const ACCENTS = ['harbour', 'garden', 'delta', 'mural', 'brass', 'signal']

/**
 * `open`       — client and destination may be named
 * `work-only`  — describe the work, never the client or destination
 * `embargoed`  — do not render at all
 */
export const DISCLOSURE_LEVELS = ['open', 'work-only', 'embargoed']

export const STATUSES = ['published', 'draft']

export function disciplineLabel(id) {
  return DISCIPLINES.find((d) => d.id === id)?.label ?? id
}
