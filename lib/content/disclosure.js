/**
 * Disclosure enforcement.
 *
 * The principle: for a non-open project the sensitive fields **do not exist**
 * on the object a page receives. Not `null`, not gated behind a flag —
 * `undefined`, because the loader never attached them. A flag that components
 * check fails the first time a component forgets to check it; a field that
 * isn't there cannot be rendered by code that hasn't been written yet.
 */

/** Keys that would identify who the work was for, or where it went. */
const WITHHELD = ['client', 'destination', 'links']

export function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value)
    for (const v of Object.values(value)) deepFreeze(v)
  }
  return value
}

/**
 * Returns a redacted, frozen project — or `null` for embargoed, which callers
 * must treat as "does not exist" rather than "exists but hidden".
 */
export function applyDisclosure(project) {
  if (project.disclosure === 'embargoed') return null
  if (project.disclosure === 'open') return deepFreeze(project)

  const redacted = { ...project }
  for (const key of WITHHELD) delete redacted[key]

  // A collaborator's URL leaks the destination as surely as naming it — an
  // agency site or a venue page identifies the client in one click.
  redacted.collaborators = project.collaborators.map(({ name, credit }) => ({ name, credit }))

  return deepFreeze(redacted)
}

/**
 * Throw if any redaction term appears in published output.
 *
 * `terms` come from a gitignored denylist, so they can be the real strings.
 * Asset captions are scanned alongside the prose and that is the point of this
 * function: `captions.yaml` is authored in a separate sitting and a different
 * frame of mind — "describe what is in the frame" — and it is where a client's
 * name or a recognizable location realistically slips through. Nothing else in
 * the design covers that path.
 */
export function assertNoRedactedTerms(project, assets, terms) {
  if (!terms?.length) return

  const haystack = [
    project.title,
    project.summary,
    project.outcome,
    project.role,
    project.clientDescriptor,
    project.body,
    ...project.collaborators.flatMap((c) => [c.name, c.credit]),
    ...assets.flatMap((a) => [a.alt, a.caption, a.credit, a.source]),
  ]
    .filter(Boolean)
    .join('\n')
    .toLowerCase()

  for (const term of terms) {
    const needle = String(term).trim().toLowerCase()
    if (needle && haystack.includes(needle)) {
      throw new Error(
        `Redacted term "${term}" appears in published content for "${project.slug}".\n` +
          `  Checked: project prose, metadata, collaborator credits, and every asset ` +
          `alt/caption/credit.\n` +
          `  Remove it, or move the project to disclosure: work-only.`
      )
    }
  }
}
