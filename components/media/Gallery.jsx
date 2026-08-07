import { assetsByRole } from '@/lib/content'
import Frame from './Frame'
import Loop from './Loop'

/**
 * Returns null on an empty list, which is the whole point — nine of ten
 * projects have no photography, so a project page has to look finished without
 * one rather than showing a gap where images will eventually go.
 */
export default function Gallery({ assetKey, role = 'detail', columns = 2, className = '', span = 'wide' }) {
  const items = assetsByRole(assetKey, role)
  if (!items.length) return null

  const cols = columns === 1 ? '' : columns === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'

  return (
    <div
      className={`grid grid-cols-1 gap-6 ${cols} ${span === 'full' ? 'span-full' : span === 'text' ? 'span-text' : 'span-wide'} ${className}`}
    >
      {items.map((a) =>
        a.type === 'video' ? <Loop key={a.id} asset={a} span="text" /> : <Frame key={a.id} asset={a} span="text" />
      )}
    </div>
  )
}
