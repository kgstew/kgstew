/**
 * Canonical ordering for assets within a project.
 *
 * Deliberately dependency-free and outside `lib/content/` so that both the site
 * and `tools/ingest` (a separate package with its own node_modules) can import
 * the same function. The manifest is written sorted and read sorted; if these
 * two ever disagree, galleries reorder for reasons nobody can reproduce.
 */

const ROLE_WEIGHT = { hero: 0, process: 1, detail: 2 }

export function compareAssets(a, b) {
  const role = (ROLE_WEIGHT[a.role] ?? 3) - (ROLE_WEIGHT[b.role] ?? 3)
  if (role) return role

  const order = (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER)
  if (order) return order

  return (
    (a.capturedAt ?? '').localeCompare(b.capturedAt ?? '') ||
    (a.source ?? '').localeCompare(b.source ?? '')
  )
}

/**
 * Sort a manifest's assets into canonical order.
 *
 * Never trust `Object.values` to preserve insertion order here. Asset ids are
 * ten hex characters, so one can be an all-digit string like "4029581037" —
 * which V8 treats as an array index and hoists to the front regardless of when
 * it was inserted. Roughly one in three hundred ids; across a few hundred
 * assets it becomes likely, and the symptom is a random detail shot silently
 * appearing above the heroes.
 */
export function sortAssets(assets) {
  return Object.values(assets ?? {}).sort(compareAssets)
}
