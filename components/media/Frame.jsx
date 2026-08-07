import { srcSet } from '@/lib/content'

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
  sizes = '(min-width: 768px) 42rem, 100vw',
  priority = false,
  caption = true,
  className = '',
}) {
  if (!asset || asset.type !== 'image') return null

  const jpeg = asset.variants?.jpeg?.at(-1)?.url
  if (!jpeg) return null

  const hasCaption = caption && (asset.caption || asset.credit)

  return (
    <figure className={className}>
      <picture>
        <source type="image/avif" srcSet={srcSet(asset, 'avif')} sizes={sizes} />
        <source type="image/webp" srcSet={srcSet(asset, 'webp')} sizes={sizes} />
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
