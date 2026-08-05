#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import { parseArgs } from 'node:util'

import { ASSETS_ROOT, IMAGE_EXT, VIDEO_EXT, CONCURRENCY } from './lib/config.mjs'
import { hashBytes, mapLimit, exists, bytes, log } from './lib/util.mjs'
import { deriveImage } from './lib/image.mjs'
import { readDecodable } from './lib/decode.mjs'
import { deriveVideo } from './lib/video.mjs'
import { uploadOnce, assertToken, deleteBlobs, urlsOf } from './lib/blob.mjs'
import { readSidecar, syncSidecar, missingAlt } from './lib/sidecar.mjs'
import { readManifest, writeManifest, manifestPath } from './lib/manifest.mjs'

const { values: flags } = parseArgs({
  options: {
    project: { type: 'string' },
    all: { type: 'boolean', default: false },
    init: { type: 'boolean', default: false },
    'dry-run': { type: 'boolean', default: false },
    force: { type: 'boolean', default: false },
    prune: { type: 'boolean', default: false },
    only: { type: 'string' }, // images | video
    help: { type: 'boolean', default: false },
  },
})

/** One timestamp for the whole run, so entries written together agree. */
const STAMP = new Date().toISOString()

const USAGE = `
kgstew asset ingest

  --project <slug>   ingest one project
  --all              ingest every project under ASSETS_ROOT
  --init             only create/refresh captions.yaml stubs, process nothing
  --only images|video
  --dry-run          derive and report, upload nothing
  --force            re-upload even if the blob already exists
  --prune            delete blobs for originals that are no longer present
  --help

Originals:  ${ASSETS_ROOT}
Layout:     <ASSETS_ROOT>/<project-slug>/*.{jpg,heic,mov,...}
            <ASSETS_ROOT>/<project-slug>/captions.yaml

Originals are never uploaded and never committed — only derivatives are.
All metadata is stripped, GPS included, and that is verified before publishing.
`

async function listProjects() {
  if (!(await exists(ASSETS_ROOT))) return []
  const entries = await fs.readdir(ASSETS_ROOT, { withFileTypes: true })
  return entries.filter((e) => e.isDirectory() && !e.name.startsWith('.')).map((e) => e.name)
}

async function listOriginals(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  return entries
    .filter((e) => e.isFile() && !e.name.startsWith('.'))
    .map((e) => e.name)
    .filter((n) => {
      const ext = path.extname(n).toLowerCase()
      return IMAGE_EXT.has(ext) || VIDEO_EXT.has(ext)
    })
    .sort()
}

async function ingestProject(project) {
  const dir = path.join(ASSETS_ROOT, project)
  if (!(await exists(dir))) {
    log.err(`no such project directory: ${dir}`)
    return null
  }

  const originals = await listOriginals(dir)
  if (!originals.length) {
    log.warn(`${project}: no originals found`)
    return null
  }

  const sync = await syncSidecar(dir, originals)
  if (sync.added) log.dim(`  captions.yaml: +${sync.added} new stub(s), ${sync.total} total`)
  if (flags.init) return null

  const sidecar = await readSidecar(dir)
  const previous = await readManifest(project)
  const assets = {}

  const queue = originals.filter((name) => {
    if (sidecar[name]?.skip) return false
    const ext = path.extname(name).toLowerCase()
    if (flags.only === 'images') return IMAGE_EXT.has(ext)
    if (flags.only === 'video') return VIDEO_EXT.has(ext)
    return true
  })

  const images = queue.filter((n) => IMAGE_EXT.has(path.extname(n).toLowerCase()))
  const videos = queue.filter((n) => VIDEO_EXT.has(path.extname(n).toLowerCase()))

  let uploaded = 0
  let skipped = 0
  let totalBytes = 0
  let gpsStripped = 0
  let failed = 0

  const publish = async (id, name, buf, ext, tag) => {
    const pathname = `assets/${project}/${id}/${tag}.${ext}`
    const res = await uploadOnce(pathname, buf, { dryRun: flags['dry-run'], force: flags.force })
    res.skipped ? skipped++ : uploaded++
    totalBytes += res.bytes
    return res.url
  }

  // ---- images -------------------------------------------------------------
  await mapLimit(images, CONCURRENCY.image, async (name) => {
    const file = path.join(dir, name)
    try {
      const { buf, transcoded } = await readDecodable(file)
      const id = hashBytes(buf)
      const meta = sidecar[name] ?? {}

      // Content-addressed: unchanged original + already in manifest = nothing to do.
      const prior = previous.assets?.[id]
      if (prior && !flags.force) {
        assets[id] = { ...prior, ...pickMeta(meta), source: name }
        skipped++
        log.dim(`  = ${name}`)
        return
      }

      const d = await deriveImage(buf)
      if (d.sourceHadGps) gpsStripped++

      const variants = {}
      for (const fmt of ['avif', 'webp', 'jpeg']) {
        variants[fmt] = []
        for (const v of d.variants[fmt]) {
          variants[fmt].push({ w: v.w, url: await publish(id, name, v.buf, v.ext, `${v.w}`) })
        }
      }

      assets[id] = {
        id,
        project,
        source: name,
        type: 'image',
        width: d.width,
        height: d.height,
        aspect: d.aspect,
        capturedAt: d.capturedAt,
        lqip: d.lqip,
        variants,
        ...pickMeta(meta),
      }
      log.ok(
        `${name} ${d.width}×${d.height}` +
          (d.sourceHadGps ? ' (GPS stripped)' : '') +
          (transcoded ? ' (HEIC transcoded)' : '')
      )
    } catch (err) {
      failed++
      log.err(`${name}: ${err.message}`)
    }
  })

  // ---- video --------------------------------------------------------------
  await mapLimit(videos, CONCURRENCY.video, async (name) => {
    const file = path.join(dir, name)
    try {
      const stat = await fs.stat(file)
      // Hash the path + size + mtime rather than the bytes: these are large and
      // reading a 90 MB file just to name it is wasteful.
      const id = hashBytes(Buffer.from(`${name}:${stat.size}:${stat.mtimeMs}`))
      const meta = sidecar[name] ?? {}

      const prior = previous.assets?.[id]
      if (prior && !flags.force) {
        assets[id] = { ...prior, ...pickMeta(meta), source: name }
        skipped++
        log.dim(`  = ${name}`)
        return
      }

      const d = await deriveVideo(file)
      assets[id] = {
        id,
        project,
        source: name,
        type: 'video',
        duration: d.duration,
        needsStreamHost: d.needsStreamHost,
        loop: await publish(id, name, d.loop.buf, d.loop.ext, 'loop'),
        poster: await publish(id, name, d.poster.buf, d.poster.ext, 'poster'),
        ...pickMeta(meta),
      }
      log.ok(
        `${name} → ${d.duration?.toFixed(1)}s loop` +
          (d.needsStreamHost ? ' (full version needs a stream host)' : '')
      )
    } catch (err) {
      failed++
      log.err(`${name}: ${err.message}`)
    }
  })

  // Anything in the previous manifest but not this run: the original was
  // deleted, renamed, or marked skip. Its derivatives are still public.
  // Carry forward anything a previous run flagged but never pruned, so the
  // record cannot be lost by the act of writing the manifest.
  const fresh = Object.values(previous.assets ?? {})
    .filter((a) => !assets[a.id])
    .map((a) => ({ id: a.id, source: a.source, urls: urlsOf(a), detectedAt: STAMP }))
  const carried = previous.pendingDeletion ?? []

  // The invariant that actually matters: never delete a URL a live asset still
  // points at. Identity is the URL itself, not the id or filename — a restored
  // original produces the same content hash and therefore the same URLs, and
  // deleting "its orphan record" would take the live asset down with it.
  const liveUrls = new Set(Object.values(assets).flatMap(urlsOf))
  const orphans = []
  const seenUrl = new Set()
  for (const o of [...carried, ...fresh]) {
    const urls = (o.urls ?? []).filter((u) => !liveUrls.has(u) && !seenUrl.has(u))
    if (!urls.length) continue
    urls.forEach((u) => seenUrl.add(u))
    orphans.push({ ...o, urls })
  }
  const orphanUrls = orphans.flatMap((o) => o.urls)

  const entries = Object.values(assets)
  const noAlt = missingAlt(entries)

  log.info('')
  log.info(`  ${project}: ${entries.length} asset(s) — ${uploaded} uploaded, ${skipped} unchanged`)
  log.info(`  ${bytes(totalBytes)} of derivatives${flags['dry-run'] ? ' (dry run, nothing sent)' : ''}`)
  if (gpsStripped) log.info(`  ${gpsStripped} original(s) carried GPS — removed`)
  if (noAlt.length) log.warn(`${noAlt.length} asset(s) still need alt text in captions.yaml`)

  let stillPending = orphans
  if (orphans.length) {
    log.info('')
    for (const o of orphans) log.dim(`  orphan: ${o.source} (${o.urls.length} objects)`)
    if (flags.prune) {
      const n = await deleteBlobs(orphanUrls, { dryRun: flags['dry-run'] })
      log.ok(
        `${n} orphaned object(s) deleted from Blob` +
          (flags['dry-run'] ? ' (dry run, nothing deleted)' : '')
      )
      if (!flags['dry-run']) stillPending = []
    } else {
      log.warn(
        `${orphans.length} removed original(s) still have ${orphanUrls.length} objects live ` +
          `at public URLs.\n  Re-run with --prune to delete them.`
      )
    }
  }

  // A partial run must never replace a good manifest with a worse one. If any
  // asset failed, report and leave the existing file alone — a half-written
  // manifest silently drops images from the site.
  if (failed) {
    log.err(`${failed} asset(s) failed — manifest left unchanged at ${manifestPath(project)}`)
    return { project, count: entries.length, noAlt: noAlt.length, failed }
  }

  // Dry runs still write a manifest, to a .dry.json sibling — the shape is worth
  // inspecting before committing to an upload run.
  const written = await writeManifest(project, assets, {
    generatedAt: STAMP,
    dry: flags['dry-run'],
    pendingDeletion: stillPending,
  })
  log.dim(`  manifest: ${written}`)

  return { project, count: entries.length, noAlt: noAlt.length, failed: 0 }
}

function pickMeta(m) {
  return {
    alt: m.alt || '',
    caption: m.caption || '',
    credit: m.credit || '',
    role: m.role || 'detail',
    order: m.order ?? null,
  }
}

async function main() {
  if (flags.help || (!flags.project && !flags.all)) {
    console.log(USAGE)
    process.exit(flags.help ? 0 : 1)
  }

  // Fail on credentials before decoding a single file, not after.
  if (!flags['dry-run'] && !flags.init) assertToken()

  const projects = flags.all ? await listProjects() : [flags.project]
  if (!projects.length) {
    log.err(`no projects under ${ASSETS_ROOT}`)
    log.dim('  create one:  mkdir -p ' + path.join(ASSETS_ROOT, 'fable-bound'))
    process.exit(1)
  }

  let failures = 0
  for (const p of projects) {
    log.info(`\n${p}`)
    const res = await ingestProject(p)
    failures += res?.failed ?? 0
  }
  log.info('')
  if (failures) process.exit(1)
}

main().catch((err) => {
  log.err(err.message)
  process.exit(1)
})
