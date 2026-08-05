#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import { parseArgs } from 'node:util'

import { ASSETS_ROOT, IMAGE_EXT, VIDEO_EXT, CONCURRENCY } from './lib/config.mjs'
import { hashBytes, mapLimit, exists, bytes, log } from './lib/util.mjs'
import { deriveImage } from './lib/image.mjs'
import { readDecodable } from './lib/decode.mjs'
import { deriveVideo } from './lib/video.mjs'
import { uploadOnce } from './lib/blob.mjs'
import { readSidecar, syncSidecar, missingAlt } from './lib/sidecar.mjs'
import { readManifest, writeManifest, manifestPath } from './lib/manifest.mjs'

const { values: flags } = parseArgs({
  options: {
    project: { type: 'string' },
    all: { type: 'boolean', default: false },
    init: { type: 'boolean', default: false },
    'dry-run': { type: 'boolean', default: false },
    force: { type: 'boolean', default: false },
    only: { type: 'string' }, // images | video
    help: { type: 'boolean', default: false },
  },
})

const USAGE = `
kgstew asset ingest

  --project <slug>   ingest one project
  --all              ingest every project under ASSETS_ROOT
  --init             only create/refresh captions.yaml stubs, process nothing
  --only images|video
  --dry-run          derive and report, upload nothing
  --force            re-upload even if the blob already exists
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
      log.err(`${name}: ${err.message}`)
    }
  })

  // Dry runs still write a manifest, to a .dry.json sibling — the shape is worth
  // inspecting before committing to an upload run.
  const written = await writeManifest(project, assets, {
    generatedAt: new Date().toISOString(),
    dry: flags['dry-run'],
  })

  const entries = Object.values(assets)
  const noAlt = missingAlt(entries)

  log.info('')
  log.info(`  ${project}: ${entries.length} asset(s) — ${uploaded} uploaded, ${skipped} unchanged`)
  log.info(`  ${bytes(totalBytes)} of derivatives${flags['dry-run'] ? ' (dry run, nothing sent)' : ''}`)
  if (gpsStripped) log.info(`  ${gpsStripped} original(s) carried GPS — removed`)
  if (noAlt.length) log.warn(`${noAlt.length} asset(s) still need alt text in captions.yaml`)
  log.dim(`  manifest: ${written}`)

  return { project, count: entries.length, noAlt: noAlt.length }
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

  const projects = flags.all ? await listProjects() : [flags.project]
  if (!projects.length) {
    log.err(`no projects under ${ASSETS_ROOT}`)
    log.dim('  create one:  mkdir -p ' + path.join(ASSETS_ROOT, 'fable-bound'))
    process.exit(1)
  }

  for (const p of projects) {
    log.info(`\n${p}`)
    await ingestProject(p)
  }
  log.info('')
}

main().catch((err) => {
  log.err(err.message)
  process.exit(1)
})
