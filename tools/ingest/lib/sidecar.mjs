import fs from 'node:fs/promises'
import path from 'node:path'
import YAML from 'yaml'
import { ROLES } from './config.mjs'
import { exists } from './util.mjs'

/**
 * Captions live in a YAML file next to the originals, keyed by filename.
 * Kyle edits this; he never edits a component to change a caption.
 */
export function sidecarPath(projectDir) {
  return path.join(projectDir, 'captions.yaml')
}

/**
 * Strict on purpose. An unreadable sidecar used to come back as `{}`, which
 * syncSidecar then treated as "no captions yet" and helpfully overwrote with
 * fresh stubs — destroying hand-written alt text with no warning. A file that
 * exists but cannot be understood is an error, never an empty result.
 */
export async function readSidecar(projectDir) {
  const p = sidecarPath(projectDir)
  if (!(await exists(p))) return {}

  const raw = await fs.readFile(p, 'utf8')
  let parsed
  try {
    parsed = YAML.parse(raw)
  } catch (err) {
    throw new Error(`${p} is not valid YAML — fix or delete it before ingesting.\n  ${err.message}`)
  }

  if (parsed == null) return {} // genuinely empty file
  if (typeof parsed !== 'object' || !('assets' in parsed)) {
    throw new Error(
      `${p} has no top-level "assets:" key.\n` +
        '  Refusing to continue: regenerating it would discard existing captions.'
    )
  }
  return parsed.assets ?? {}
}

const TEMPLATE_HEADER = `# Captions for this project.
#
# Keyed by original filename. Edit freely — ingest reads this file and never
# overwrites what you have written. New originals get appended as empty stubs
# the next time you run:  npm run ingest -- --project <slug> --init
#
#   alt      required for anything published. Describe what is in the frame.
#   caption  optional. Shown under the image.
#   credit   optional. Photographer, if it wasn't you.
#   role     ${ROLES.join(' | ')}
#   order    optional integer. Lower sorts first.
#   skip     true to keep an original out of the site entirely.

assets:
`

function stubFor(file) {
  return { alt: '', caption: '', credit: '', role: 'detail', order: null, skip: false }
}

/**
 * Adds stubs for any originals that aren't in the sidecar yet, preserving
 * everything already written.
 *
 * Edits the parsed document in place rather than re-serialising a plain object,
 * because a round-trip through JSON silently discards every comment in the file.
 * People annotate these — "# CHECK this name", "# ask Leanne who shot this" —
 * and losing those on the next ingest is the kind of quiet damage that stops
 * anyone trusting the tool. Only writes when something actually changed.
 */
export async function syncSidecar(projectDir, filenames) {
  const p = sidecarPath(projectDir)

  if (!(await exists(p))) {
    const stubs = Object.fromEntries([...filenames].sort().map((f) => [f, stubFor(f)]))
    const body = YAML.stringify({ assets: stubs }, { lineWidth: 0 }).replace(/^assets:\n/, '')
    await fs.writeFile(p, TEMPLATE_HEADER + body, 'utf8')
    return { added: filenames.length, total: filenames.length, path: p }
  }

  const raw = await fs.readFile(p, 'utf8')
  const doc = YAML.parseDocument(raw)
  if (doc.errors?.length) {
    throw new Error(`${p} is not valid YAML — fix or delete it before ingesting.\n  ${doc.errors[0].message}`)
  }

  let assets = doc.get('assets')
  if (assets == null) {
    throw new Error(
      `${p} has no top-level "assets:" key.\n` +
        '  Refusing to continue: regenerating it would discard existing captions.'
    )
  }

  const missing = filenames.filter((f) => !assets.has(f)).sort()
  for (const f of missing) assets.set(f, doc.createNode(stubFor(f)))

  if (missing.length) await fs.writeFile(p, doc.toString({ lineWidth: 0 }), 'utf8')
  return { added: missing.length, total: assets.items.length, path: p }
}

/** Assets missing alt text — reported so nothing ships unlabelled. */
export function missingAlt(entries) {
  return entries.filter((e) => !e.skip && !e.alt?.trim()).map((e) => e.source)
}
