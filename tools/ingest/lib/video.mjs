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
 * Kyle builds things that move, so a still is the least interesting version of
 * the work. Every video becomes a short silent loop for the top of a project
 * page, plus a poster frame. Anything longer than the loop window keeps its
 * duration recorded so we know it needs a streaming host rather than the repo.
 */
export async function deriveVideo(file) {
  const duration = await ffprobeDuration(file)
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'kgs-vid-'))
  const loopPath = path.join(tmp, 'loop.mp4')
  const posterPath = path.join(tmp, 'poster.jpg')

  // Even dimensions required by yuv420p; scale height to -2 to guarantee it.
  const scale = `scale=${LOOP_WIDTH}:-2:flags=lanczos`

  try {
    await run('ffmpeg', [
      '-y', '-loglevel', 'error',
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
      '-ss', String(Math.min(1, (duration || 2) / 3)),
      '-frames:v', '1',
      '-vf', scale,
      '-q:v', '4',
      '-map_metadata', '-1',
      posterPath,
    ])

    return {
      duration,
      needsStreamHost: duration != null && duration > LOOP_MAX_SECONDS,
      loop: { ext: 'mp4', buf: await fs.readFile(loopPath) },
      poster: { ext: 'jpg', buf: await fs.readFile(posterPath) },
    }
  } finally {
    await fs.rm(tmp, { recursive: true, force: true })
  }
}
