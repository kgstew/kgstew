import { srcSet } from '@/lib/content'

/** Which grid track this occupies: the prose column, the wider track, or the
 *  full page. Defaults to `wide` — a figure sitting at prose measure wastes the
 *  room the breakout grid exists to provide. */
const spanClass = (span) => (span === 'text' ? '' : span === 'full' ? 'span-full' : 'span-wide')


/**
 * An image from the asset manifest.
 *
 * Deliberately not `next/image`. The manifest already holds five AVIF widths on
 * Blob, generated during ingest; routing them through the Vercel optimizer would
 * re-encode already-optimised bytes, bill per transformation, and discard the
 * LQIP we generated at the same time.
 *
 * The placeholder goes on the <img> itself as a background rather than in a
 * wrapper — it paints before the network responds, needs no JavaScript, and
 * there is no element left over to unstyle once the image arrives.
 */
export default function Frame({
  asset,
  span = 'wide',
  sizes,
  priority = false,
  caption = true,
  className = '',
}) {
  // sizes must track the grid or the browser keeps picking the wrong rendition —
  // this is exactly what made six of eight widths unreachable at 720px.
  const resolvedSizes =
    sizes ??
    (span === 'full'
      ? '(min-width: 1152px) 1072px, calc(100vw - 5rem)'
      : span === 'wide'
        ? '(min-width: 1152px) 780px, calc(100vw - 5rem)'
        : '(min-width: 1152px) 520px, calc(100vw - 5rem)')
  if (!asset || asset.type !== 'image') return null

  const jpeg = asset.variants?.jpeg?.at(-1)?.url
  if (!jpeg) return null

  const hasCaption = caption && (asset.caption || asset.credit)

  return (
    <figure className={`${spanClass(span)} ${className}`}>
      <picture>
        <source type="image/avif" srcSet={srcSet(asset, 'avif')} sizes={resolvedSizes} />
        <source type="image/webp" srcSet={srcSet(asset, 'webp')} sizes={resolvedSizes} />
        <img
          src={jpeg}
          alt={asset.alt || ''}
          width={asset.width}
          height={asset.height}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          className="w-full bg-ground"
          style={{
            aspectRatio: asset.aspect,
            backgroundImage: asset.lqip ? `url(${asset.lqip})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </picture>
      {hasCaption && (
        <figcaption className="mt-2 text-sm text-dim">
          {asset.caption}
          {asset.credit && (
            <span className="legend ml-2 align-middle">Photo {asset.credit}</span>
          )}
        </figcaption>
      )}
    </figure>
  )
}
