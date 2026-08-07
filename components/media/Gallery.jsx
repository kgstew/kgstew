import { assetsByRole } from '@/lib/content'
import Frame from './Frame'
import Loop from './Loop'

/**
 * A justified gallery — rows of images scaled to share a height, filling the
 * width, with nothing cropped.
 *
 * No library, and for a specific reason: what photo-gallery libraries exist to
 * solve is not knowing an image's dimensions until it loads, so they measure in
 * the browser and lay out afterwards. The ingest pipeline already records exact
 * aspect ratios in the manifest, so the layout is knowable at build time and
 * this can stay a server component with no client JavaScript.
 *
 * The mechanism is a flex row where each item's `flex-grow` is its aspect ratio.
 * Widths within a row then come out proportional to aspect, which means
 * `height = width / aspect` is the same for every item in that row — justified
 * rows without object-fit cropping. `flex-basis` sets roughly how many land per
 * row and lets it reflow responsively without a media query.
 *
 * Kyle's Fable Bound detail set is six portrait and four landscape frames. In a
 * uniform grid that produces very tall cells beside very short ones; this makes
 * each row read as one band.
 */
export default function Gallery({
  assetKey,
  role = 'detail',
  rowHeight = 240,
  className = '',
  span = 'wide',
}) {
  const items = assetsByRole(assetKey, role)
  if (!items.length) return null

  const spanClass =
    span === 'none' ? '' : span === 'full' ? 'span-full' : span === 'text' ? 'span-text' : 'span-wide'

  return (
    <div className={`flex flex-wrap gap-4 ${spanClass} ${className}`}>
      {items.map((a) => {
        const aspect = a.aspect ?? 4 / 3
        return (
          <div
            key={a.id}
            style={{ flexGrow: aspect, flexBasis: `${Math.round(aspect * rowHeight)}px` }}
            className="min-w-[min(100%,220px)]"
          >
            {a.type === 'video' ? (
              <Loop asset={a} span="none" />
            ) : (
              <Frame asset={a} span="none" sizes="(min-width: 1152px) 480px, 100vw" />
            )}
          </div>
        )
      })}
    </div>
  )
}
