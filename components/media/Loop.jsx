'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * A silent looping clip.
 *
 * Two reasons this is a client component, and neither can be expressed in HTML
 * attributes:
 *
 * 1. `prefers-reduced-motion`. Under reduce we render the poster as a still and
 *    never request the mp4 — pausing a video that has already downloaded
 *    respects the letter of the preference and not the point of it.
 *
 * 2. Visibility. Plain `autoPlay` on an offscreen element is unreliable: the
 *    browser is free to defer it, and in testing a loop below the fold never
 *    fetched a byte even after being scrolled into view. Gating on an
 *    IntersectionObserver makes it deterministic, and means a page carrying
 *    several loops only downloads the ones actually reached.
 *
 * Kyle builds things that move, so a still is the least interesting version of
 * the work — this is the default treatment for a kinetic project.
 */
export default function Loop({ asset, className = '', caption = true, span = 'wide' }) {
  const ref = useRef(null)
  const videoRef = useRef(null)
  const [motionOk, setMotionOk] = useState(false)
  const [reached, setReached] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setMotionOk(!mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el || !motionOk) return
    const io = new IntersectionObserver(
      ([entry]) => {
        // Only ever latches on. Once mounted the element stays mounted, so
        // scrolling away pauses rather than tearing down and re-downloading.
        if (entry.isIntersecting) setReached(true)
        const v = videoRef.current
        if (!v) return
        if (entry.isIntersecting) v.play().catch(() => {})
        else v.pause()
      },
      // Start a little before it arrives so the first frame is there on entry.
      { rootMargin: '200px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [motionOk])

  /**
   * Start playback when the element mounts.
   *
   * The observer callback that sets `reached` runs one render BEFORE the video
   * exists, so `videoRef.current` is still null at that point and the play()
   * call inside it is skipped. The element then stays intersecting, so no
   * second callback ever arrives — which left the video sitting on its poster
   * frame, indistinguishable from a still image. The `autoPlay` attribute
   * covers the same case declaratively; this makes it deterministic.
   */
  useEffect(() => {
    if (!motionOk || !reached) return
    videoRef.current?.play().catch(() => {})
  }, [motionOk, reached])

  if (!asset || asset.type !== 'video') return null

  const ratio = asset.aspect ?? 16 / 9
  const hasCaption = caption && (asset.caption || asset.credit)
  const showVideo = motionOk && reached

  return (
    <figure ref={ref} className={`${span === 'none' ? '' : span === 'full' ? 'span-full' : span === 'text' ? 'span-text' : 'span-wide'} ${className}`}>
      {showVideo ? (
        <video
          ref={videoRef}
          src={asset.loop}
          poster={asset.poster}
          width={asset.width}
          height={asset.height}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label={asset.alt || undefined}
          className="w-full bg-ground"
          style={{ aspectRatio: ratio }}
        />
      ) : (
        <img
          src={asset.poster}
          alt={asset.alt || ''}
          width={asset.width}
          height={asset.height}
          className="w-full bg-ground"
          style={{ aspectRatio: ratio }}
        />
      )}
      {hasCaption && (
        <figcaption className="mt-2 text-sm text-dim">
          {asset.caption}
          {asset.credit && <span className="legend ml-2 align-middle">Photo {asset.credit}</span>}
        </figcaption>
      )}
    </figure>
  )
}
