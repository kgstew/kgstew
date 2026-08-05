import { assets, assetSrc } from '@/lib/content'

export const metadata = { title: 'Work' }

/**
 * Placeholder index. The curated project model — disclosure fields, accent
 * colour, per-project pages — lands with the design work. For now this proves
 * the asset manifest renders end to end.
 */
export default function Work() {
  const heroes = assets('fable-bound').filter((a) => a.type === 'image' && a.role === 'hero')

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Work</h1>
      <section className="mt-10">
        <h2 className="font-medium">Fable Bound</h2>
        <p className="mt-1 max-w-prose text-neutral-600 dark:text-neutral-400">
          A viking ship that rocked when you rowed it. Most of the crew who built it had never
          welded.
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {heroes.map((a) => (
            <figure key={a.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={assetSrc(a, 800)}
                alt={a.alt}
                width={a.width}
                height={a.height}
                loading="lazy"
                className="w-full rounded-sm bg-neutral-100 dark:bg-neutral-900"
              />
              {a.caption ? (
                <figcaption className="mt-2 text-sm text-neutral-500">{a.caption}</figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      </section>
    </div>
  )
}
