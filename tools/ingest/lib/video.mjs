import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { LOOP_MAX_SECONDS, LOOP_WIDTH } from './config.mjs'

const run = promisify(execFile)

export async function ffprobeDuration(file) {
  const { stdout } = await run('ffprobe', [
    '-v', 'error',
    '-show_entries', 'format=duration',
    '-of', 'default=noprint_wrappers=1:nokey=1',
    file,
  ])
  return Number.parseFloat(stdout.trim()) || null
}

/**
 * Dimensions of the encoded loop, probed from the output rather than computed
 * from the source. The scale filter rounds height to an even number, so
 * deriving it arithmetically is off by one often enough to matter — and being
 * off by one is exactly what causes the layout shift these fields exist to
 * prevent.
 */
export async function ffprobeDimensions(file) {
  const { stdout } = await run('ffprobe', [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height',
    '-of', 'csv=s=x:p=0',
    file,
  ])
  const [w, h] = stdout.trim().split('x').map(Number)
  if (!w || !h) return null
  return { width: w, height: h, aspect: +(w / h).toFixed(4) }
}

/**
 * Kyle builds things that move, so a still is the least interesting version of
 * the work. Every video becomes a short silent loop for the top of a project
 * page, plus a poster frame.
 *
 * `clipStart` in captions.yaml picks which six seconds. Defaulting to the first
 * six is almost always wrong — the interesting moment is rarely at the head of
 * the file, and for one of these it was a flame effect twenty seconds in.
 */
export async function deriveVideo(file, { start = 0 } = {}) {
  const duration = await ffprobeDuration(file)
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'kgs-vid-'))
  const loopPath = path.join(tmp, 'loop.mp4')
  const posterPath = path.join(tmp, 'poster.jpg')

  // Even dimensions required by yuv420p; scale height to -2 to guarantee it.
  const scale = `scale=${LOOP_WIDTH}:-2:flags=lanczos`

  try {
    await run('ffmpeg', [
      '-y', '-loglevel', 'error',
      // -ss before -i seeks by keyframe, which is fast and accurate enough for
      // a six-second excerpt. The default of 0 keeps the old behaviour.
      ...(start ? ['-ss', String(start)] : []),
      '-i', file,
      '-t', String(LOOP_MAX_SECONDS),
      '-an',                          // silent — these autoplay
      '-vf', scale,
      '-c:v', 'libx264', '-profile:v', 'main', '-pix_fmt', 'yuv420p',
      '-crf', '26', '-preset', 'slow',
      '-movflags', '+faststart',
      '-map_metadata', '-1',          // drop location and device metadata
      loopPath,
    ])

    await run('ffmpeg', [
      '-y', '-loglevel', 'error',
      '-i', file,
      '-ss', String(start ? start + 1 : Math.min(1, (duration || 2) / 3)),
      '-frames:v', '1',
      '-vf', scale,
      '-q:v', '4',
      '-map_metadata', '-1',
      posterPath,
    ])

    const dims = await ffprobeDimensions(loopPath)

    return {
      duration,
      needsStreamHost: duration != null && duration > LOOP_MAX_SECONDS,
      // width/height/aspect let the player reserve space before the poster
      // loads. Without them a loop shifts layout — the one thing the image
      // path is careful to avoid.
      ...(dims ?? {}),
      loop: { ext: 'mp4', buf: await fs.readFile(loopPath) },
      poster: { ext: 'jpg', buf: await fs.readFile(posterPath) },
    }
  } finally {
    await fs.rm(tmp, { recursive: true, force: true })
  }
}
