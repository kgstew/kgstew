/**
 * The parts list, in the drafting convention: reference number, what it is, and
 * the value that matters.
 *
 * Fed from frontmatter rather than MDX — see the note in lib/content/schema.js.
 * A real shop drawing carries one parts list rather than several scattered
 * through the notes, so groups render as one continuous numbered run.
 */
export default function Specs({ specs = [], className = '' }) {
  if (!specs.length) return null

  // Flatten to one numbered run up front rather than incrementing during render —
  // a counter mutated inside map() is a lint error and a genuine hazard if the
  // component ever re-renders.
  let n = 0
  const groups = specs.map((group) => ({
    group: group.group,
    rows: group.rows.map(([name, value]) => ({ name, value, ref: String(++n).padStart(2, '0') })),
  }))

  return (
    <section className={className}>
      <p className="legend mb-3">Specification</p>
      <dl className="border-t border-ink">
        {groups.map((group) => (
          <div key={group.group || 'ungrouped'}>
            {group.group ? (
              <p className="border-b border-hairline py-2 font-mono text-[10px] tracking-legend text-accent-ink uppercase">
                {group.group}
              </p>
            ) : null}
            {group.rows.map(({ name, value, ref }) => (
              <div
                key={name}
                className="grid grid-cols-[1.75rem_1fr_auto] items-baseline gap-x-4 border-b border-hairline py-2"
              >
                <span className="font-mono text-[11px] tabular-nums text-dim">{ref}</span>
                <dt className="text-[15px]">{name}</dt>
                <dd className="font-mono text-[11px] tracking-wide text-dim uppercase tabular-nums">
                  {value}
                </dd>
              </div>
            ))}
          </div>
        ))}
      </dl>
    </section>
  )
}
