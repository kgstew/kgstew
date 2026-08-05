import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import sharp from 'sharp'

const run = promisify(execFile)

/**
 * Some iPhone HEICs trip libheif's reference-count security limit and sharp
 * refuses them outright — the burst and edited shots in particular. sharp gives
 * no way to raise that limit, so we transcode those files with a system decoder
 * first and hand sharp a buffer it will accept.
 *
 * Quality is preserved: sips writes a maximum-quality JPEG, and every derivative
 * is generated from that rather than from a resized intermediate.
 */
export async function readDecodable(file) {
  const buf = await fs.readFile(file)

  try {
    await sharp(buf, { failOn: 'none' }).metadata()
    return { buf, transcoded: false }
  } catch (err) {
    const ext = path.extname(file).toLowerCase()
    if (!['.heic', '.heif'].includes(ext)) throw err

    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'kgs-heic-'))
    const out = path.join(tmp, 'decoded.jpg')
    try {
      if (process.platform === 'darwin') {
        await run('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', 'best', file, '--out', out])
      } else {
        await run('ffmpeg', ['-y', '-loglevel', 'error', '-i', file, '-q:v', '1', out])
      }
      return { buf: await fs.readFile(out), transcoded: true }
    } finally {
      await fs.rm(tmp, { recursive: true, force: true })
    }
  }
}
