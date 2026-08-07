import Frame from '@/components/media/Frame'
import { disciplineLabel } from '@/lib/content'

/**
 * The overview, as a single bounded plate.
 *
 * The previous version stacked title, card, field list and hero as separate
 * centred blocks, which made the hero read as an inline figure that happened to
 * be too wide for the column. The problem was never the width — it was that
 * nothing marked where the setup ended and the body began.
 *
 * A shop drawing already solves this: the sheet carries the drawing and a ruled
 * title block, bounded together, and the notes sit outside it. So the image, the
 * name and the fields are one object at `wide`, and the prose that follows is a
 * narrower column. The change in width then reads as two zones rather than as
 * an awkwardly sized picture.
 */
export default function Plate({ project, hero }) {
  const fields = [
    ['Role', project.role],
    ['Years', `${project.started} — ${project.ended}`],
    ['Disciplines', project.disciplines.map(disciplineLabel).join(' · ')],
    project.destination ? ['Where', project.destination] : null,
    project.disclosure === 'work-only' ? ['Client', 'Not named.'] : null,
  ].filter(Boolean)

  return (
    <section className="span-wide border border-ink bg-surface">
      <div className="px-5 pt-5 pb-4">
        <h1 className="text-[26px] leading-tight">{project.title}</h1>
        <p className="mt-2 max-w-[46ch] text-[18px] leading-snug text-soft">{project.card}</p>
      </div>

      {/* Edge to edge inside the plate: the image is the drawing, not a figure
          sitting on the page. Caption goes in the title block below instead. */}
      {hero ? (
        <Frame
          asset={hero}
          priority
          span="text"
          caption={false}
          sizes="(min-width: 1152px) 780px, calc(100vw - 5rem)"
          className="border-y border-ink"
        />
      ) : null}

      <dl className="grid grid-cols-1 sm:grid-cols-2">
        {fields.map(([label, value], i) => (
          <div
            key={label}
            className={`border-hairline px-5 py-3 ${i % 2 === 0 ? 'sm:border-r' : ''} ${
              i < fields.length - (fields.length % 2 === 0 ? 2 : 1) ? 'border-b' : ''
            }`}
          >
            <dt className="legend">{label}</dt>
            <dd className="mt-1 text-[15px]">{value}</dd>
          </div>
        ))}
      </dl>

      {hero?.caption ? (
        <p className="border-t border-hairline px-5 py-3 text-sm text-dim">
          {hero.caption}
          {hero.credit ? <span className="legend ml-2 align-middle">Photo {hero.credit}</span> : null}
        </p>
      ) : null}
    </section>
  )
}
