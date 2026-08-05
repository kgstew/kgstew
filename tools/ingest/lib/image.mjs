import sharp from 'sharp'
import { WIDTHS, JPEG_WIDTH } from './config.mjs'
import { exifCapturedAt, hasGps, hasAnyMetadata } from './util.mjs'

/**
 * Build every web derivative for one original.
 *
 * Metadata handling: sharp drops all metadata unless `.withMetadata()` is called,
 * and we never call it. The capture date is lifted off the original first so we
 * keep the one field worth keeping; everything else — GPS included — is dropped.
 */
export async function deriveImage(buf) {
  const img = sharp(buf, { failOn: 'none' })
  const meta = await img.metadata()

  // Post-rotation dimensions: an unrotated portrait photo reports landscape.
  const swap = meta.orientation >= 5 && meta.orientation <= 8
  const width = swap ? meta.height : meta.width
  const height = swap ? meta.width : meta.height
  if (!width || !height) throw new Error('could not read image dimensions')

  const capturedAt = exifCapturedAt(meta.exif)
  const sourceHadGps = hasGps(meta.exif)

  const base = () => sharp(buf, { failOn: 'none' }).rotate()

  // Never upscale. Always include the native width, capped, so detail shots stay sharp.
  const targets = [...new Set([...WIDTHS.filter((w) => w < width), Math.min(width, 2400)])].sort(
    (a, b) => a - b
  )

  const variants = { avif: [], webp: [], jpeg: [] }

  for (const w of targets) {
    const resized = base().resize({ width: w, withoutEnlargement: true })
    const [avif, webp] = await Promise.all([
      resized.clone().avif({ quality: 55, effort: 4 }).toBuffer(),
      resized.clone().webp({ quality: 78 }).toBuffer(),
    ])
    variants.avif.push({ w, ext: 'avif', buf: avif })
    variants.webp.push({ w, ext: 'webp', buf: webp })
  }

  // One JPEG for social cards, embeds, and anyone who right-click-saves.
  const jw = Math.min(JPEG_WIDTH, width)
  variants.jpeg.push({
    w: jw,
    ext: 'jpg',
    buf: await base().resize({ width: jw, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toBuffer(),
  })

  // Tiny blurred placeholder, inlined into the manifest so first paint has something.
  const lqipBuf = await base().resize({ width: 20 }).blur(1.2).webp({ quality: 45 }).toBuffer()
  const lqip = `data:image/webp;base64,${lqipBuf.toString('base64')}`

  // Assertion, not an assumption. Checked on every format, since each encoder
  // handles metadata differently and only one of them has to leak.
  for (const [fmt, list] of Object.entries(variants)) {
    const probe = await sharp(list[0].buf).metadata()
    if (hasAnyMetadata(probe)) {
      throw new Error(`metadata survived ${fmt} encoding — refusing to publish`)
    }
  }

  return { width, height, aspect: +(width / height).toFixed(4), capturedAt, sourceHadGps, lqip, variants }
}
