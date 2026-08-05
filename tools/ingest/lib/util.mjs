import crypto from 'node:crypto'
import fs from 'node:fs/promises'

export function hashBytes(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex').slice(0, 10)
}

/**
 * EXIF DateTimeOriginal, read from the ORIGINAL before we discard metadata.
 * We want the capture date as data; we do not want the GPS tags anywhere near
 * a published file. Scanning the buffer avoids pulling in an EXIF library for
 * the one field we actually use.
 */
export function exifCapturedAt(exifBuffer) {
  if (!exifBuffer?.length) return null
  const m = exifBuffer.toString('latin1').match(/(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})/)
  if (!m) return null
  const [, y, mo, d, h, mi, s] = m
  const iso = `${y}-${mo}-${d}T${h}:${mi}:${s}`
  return Number.isNaN(Date.parse(iso)) ? null : iso
}

/**
 * True if the EXIF block contains a GPS IFD.
 *
 * GPS lives behind tag 0x8825 in IFD0 as a numeric pointer — it is not stored
 * as readable text, so scanning for the string "GPSLatitude" finds nothing even
 * on a fully geotagged photo. This walks the TIFF header properly instead.
 */
export function hasGps(exifBuffer) {
  if (!exifBuffer || exifBuffer.length < 16) return false
  const buf = exifBuffer

  // sharp hands back the payload with a leading "Exif\0\0" on some formats.
  const start = buf.slice(0, 6).toString('latin1') === 'Exif\0\0' ? 6 : 0
  const order = buf.slice(start, start + 2).toString('latin1')
  if (order !== 'II' && order !== 'MM') return false
  const le = order === 'II'

  const u16 = (o) => (le ? buf.readUInt16LE(o) : buf.readUInt16BE(o))
  const u32 = (o) => (le ? buf.readUInt32LE(o) : buf.readUInt32BE(o))

  try {
    const ifd0 = start + u32(start + 4)
    const count = u16(ifd0)
    // 12 bytes per entry, tag id in the first two.
    for (let i = 0; i < count; i++) {
      const entry = ifd0 + 2 + i * 12
      if (entry + 12 > buf.length) break
      if (u16(entry) === 0x8825) return true
    }
  } catch {
    return false
  }
  return false
}

/**
 * Nothing published should carry metadata of any kind — not GPS, not the device
 * serial, not the owner name. Asserting "no metadata at all" is both stronger
 * than hunting for specific tags and trivially verifiable.
 */
export function hasAnyMetadata(meta) {
  return Boolean(meta?.exif?.length || meta?.xmp?.length || meta?.iptc?.length)
}

export async function mapLimit(items, limit, fn) {
  const out = new Array(items.length)
  let cursor = 0
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const i = cursor++
      out[i] = await fn(items[i], i)
    }
  })
  await Promise.all(workers)
  return out
}

export async function exists(p) {
  try {
    await fs.access(p)
    return true
  } catch {
    return false
  }
}

export const bytes = (n) =>
  n > 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1e3))} kB`

const C = { dim: '\x1b[2m', red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m', reset: '\x1b[0m' }
export const log = {
  info: (...a) => console.log(...a),
  dim: (...a) => console.log(C.dim + a.join(' ') + C.reset),
  ok: (...a) => console.log(C.green + '✓' + C.reset, ...a),
  warn: (...a) => console.log(C.yellow + '!' + C.reset, ...a),
  err: (...a) => console.error(C.red + '✗' + C.reset, ...a),
}
