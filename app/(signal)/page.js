import Link from 'next/link'
import { featuredProjects, allPosts } from '@/lib/content'
import SignalPath from '@/components/signal/SignalPath'

/**
 * The front door.
 *
 * Direction A from the /design comparison: capability-led. The page states what
 * Kyle does and what a reader gets, in three buckets he named — engineering,
 * leadership, teams.
 *
 * What this replaced and why: the previous copy argued about his range instead
 * of describing his work. "It looks scattered — it's the qualification" was a
 * rebuttal to an earlier draft of mine that leaked into public copy; on the page
 * it planted a doubt the reader did not have and then defended against it.
 * Specifics like "seventy-four fixtures on a Hong Kong lobby ceiling" moved out
 * too — true, and too granular for a front door. Evidence at that resolution
 * belongs on the project pages, which is where the links go.
 *
 * No origin story here. It was placed below the work on the reasoning that it
 * would read as explanation rather than as opening sentiment; Kyle cut it as
 * "completely out of place" on a page whose job is stating capability. The text
 * is kept in kgstew-notes/positioning.md if it finds a home later.
 *
 * American English throughout the site, per Kyle.
 */

const CAPABILITIES = [
  {
    name: 'Engineering',
    lead: 'Embedded firmware, control and show systems, production software, networking, and the integrations between them.',
    body: 'I specify how a system fits together and then build the parts nobody else is covering — regularly in hardware and codebases I have not seen before. The recurring job is making separate things work as one: a factory floor and an accounting system, a lighting rig and a live music cue, sixty independent controllers and one flock.',
  },
  {
    name: 'Leadership',
    lead: 'Ten years at one company, from a junior engineer who had never written code to IoT Director.',
    body: 'Hiring, managing managers, running several product teams at once, and owning what ships. Most of the work is translating between technical and non-technical groups until both are describing the same system — which is also what makes me useful to artists and clients who have never specified engineering work before.',
  },
  {
    name: 'Teams',
    lead: 'Assembling and running the group that does the work, paid or volunteer.',
    body: 'Recruiting, scoping, scheduling, fundraising, and keeping momentum through builds that run for a year. I am better at coordinating engineers, fabricators, and artists than at being any one of them, and the projects here are almost never mine alone.',
  },
]

export default function Home() {
  const featured = featuredProjects(3)
  const posts = allPosts().slice(0, 3)

  return (
    <div className="flow gap-y-20">
      <section>
        <h1 className="max-w-[20ch] text-display text-balance">
          I design technical systems and run the teams that build them.
        </h1>

        <p className="span-text mt-8 text-lg text-soft">
          Since 2013 I have worked across embedded firmware, control systems, and production
          software, and across the teams and organizations that ship them. The constant is
          integration: deciding how separate parts fit together, then building the parts that do not
          exist yet.
        </p>

        <div className="mt-14">
          <SignalPath />
        </div>
      </section>

      <section>
        <div className="grid gap-10 sm:grid-cols-3">
          {CAPABILITIES.map(({ name, lead, body }) => (
            <div key={name}>
              <h2 className="legend">{name}</h2>
              <p className="mt-3 text-[15px] leading-relaxed">{lead}</p>
              <p className="mt-3 text-sm text-soft">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="legend">Selected work</h2>
        {/* The spine is a background, not a border. `border-l-accent` and
            `divide-hairline` are both border-color utilities at the same
            specificity, and the divider ended up inheriting currentColor on one
            row — a dark rule across the list. A background cannot collide. */}
        <ul className="mt-5 border-t border-hairline">
          {featured.map((p) => (
            <li key={p.slug} data-project={p.slug} className="relative border-b border-hairline">
              <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[2px] bg-accent" />
              <Link href={`/work/${p.slug}`} className="group block py-4 pl-4">
                <span className="font-display font-semibold tracking-signal group-hover:underline">
                  {p.title}
                </span>
                <span className="mt-1 block text-sm text-soft">{p.summary}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/work" className="mt-5 inline-block text-sm text-dim hover:text-ink">
          All work →
        </Link>
      </section>

      {posts.length > 0 && (
        <section>
          <h2 className="legend">Writing</h2>
          <ul className="mt-5 border-t border-hairline">
            {posts.map((p) => (
              <li key={p.slug} className="border-b border-hairline">
                <Link href={`/writing/${p.slug}`} className="group block py-4">
                  <span className="font-display font-semibold tracking-signal group-hover:underline">
                    {p.title}
                  </span>
                  <span className="mt-1 block text-sm text-soft">{p.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
