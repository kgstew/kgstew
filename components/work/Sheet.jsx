import Frame from '@/components/media/Frame'
import { disciplineLabel } from '@/lib/content'

/**
 * The project overview.
 *
 * No border. An earlier version bounded this in a box, which read as something
 * plastered onto the page — a rule around a region is redundant on a dotted
 * ground, and the two systems argue. Separation here comes from space, type and
 * position instead.
 *
 * Facts are a field run rather than ruled cells, and they absorb what used to be
 * a homeless outcome paragraph: grant, crew and where it has shown are fields,
 * because that is what they were.
 */
export default function Sheet({ project, hero }) {
  const rows = [
    ['Role', project.role],
    ['Years', `${project.started} — ${project.ended}`],
    ['Where', project.destination],
    ['Disciplines', project.disciplines.map(disciplineLabel).join(' · ')],
    project.disclosure === 'work-only' ? ['Client', 'Not named.'] : null,
    ...project.fields,
  ].filter((r) => r && r[1])

  return (
    <>
      <h1 className="text-[29px] leading-tight">{project.title}</h1>
      <p className="mt-3 max-w-[42ch] text-[20px] leading-snug text-soft">{project.card}</p>

      <dl className="mt-11 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="legend">{label}</dt>
            <dd className="mt-1.5 text-[14.5px] leading-snug">{value}</dd>
          </div>
        ))}
      </dl>

      {hero ? <Frame asset={hero} priority className="mt-12" /> : null}
    </>
  )
}
