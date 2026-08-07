import Link from 'next/link'
import { allProjects, disciplineLabel } from '@/lib/content'

export const metadata = { title: 'Work' }

/**
 * Plain listing. The Index altitude — catalog table, colour spine, filtering —
 * arrives with the design tickets; this only proves the model renders.
 */
export default function Work() {
  const projects = allProjects()

  return (
    <div className="flow">
      <h1 className="text-3xl">Work</h1>
      <ul className="mt-8 divide-y divide-hairline">
        {projects.map((p) => (
          <li key={p.slug} className="py-5">
            <Link href={`/work/${p.slug}`} className="group block">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-medium group-hover:underline">{p.title}</span>
                <span className="shrink-0 text-sm tabular-nums text-dim">
                  {p.started.slice(0, 4)}
                  {p.ended === 'ongoing' ? '–' : p.ended.slice(0, 4) !== p.started.slice(0, 4) ? `–${p.ended.slice(0, 4)}` : ''}
                </span>
              </div>
              <p className="mt-1 text-sm text-soft">{p.summary}</p>
              <p className="mt-2 text-xs tracking-wide text-dim uppercase">
                {p.disciplines.map(disciplineLabel).join(' · ')}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
