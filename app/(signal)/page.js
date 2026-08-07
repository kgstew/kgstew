import Link from 'next/link'
import { featuredProjects, allPosts } from '@/lib/content'
import SignalPath from '@/components/signal/SignalPath'

/**
 * The front door.
 *
 * Order is deliberate: thesis, then evidence, then explanation. The 2013 origin
 * story sits below the work rather than above it so it reads as the reason the
 * projects look the way they do, instead of as opening sentiment.
 *
 * Headings use the global rule from base.css — Jost, sentence case, weight 600.
 * This page previously set `font-bold tracking-tight` on its own h1, which
 * computed to 700 while every project page was 600, so the "one heading system"
 * was not actually one.
 */
export default function Home() {
  const featured = featuredProjects(3)
  const posts = allPosts().slice(0, 3)

  return (
    <div className="flow gap-y-20">
      <section>
        <h1 className="max-w-[16ch] text-display text-balance">
          I design systems and assemble the people who build them.
        </h1>

        <p className="span-text mt-8 text-lg text-soft">
          The parts are usually people first — and then whatever software and hardware those people
          need. The job is the same: build the thing in the middle that makes them work as one
          system.
        </p>

        <div className="mt-12">
          <SignalPath />
        </div>

        {/* Concrete before conceptual. The claim above is only worth as much as
            this list, which is why it is four specifics and no adjectives. */}
        <p className="span-text mt-12 text-soft">
          Firmware for modular synthesizers. A mesh network coordinating sixty animatronic
          butterflies. An accounting system that finally talks to the factory floor. A twenty-foot
          viking ship that moves on pneumatics.
        </p>

        <p className="span-text mt-4 text-lg">
          It looks scattered. It&rsquo;s the qualification — you can only integrate systems you can
          speak the language of.
        </p>
      </section>

      <section>
        <h2 className="legend">Selected work</h2>
        {/* The spine is a background, not a border. `border-l-accent` and
            `divide-hairline` are both border-colour utilities at the same
            specificity, and the divider ended up inheriting currentColor on one
            row — a dark rule across the list. A background cannot collide. */}
        <ul className="mt-5 border-t border-hairline">
          {featured.map((p) => (
            <li
              key={p.slug}
              data-project={p.slug}
              className="relative border-b border-hairline"
            >
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

      {/* Below the evidence, per the design: this explains the work rather than
          introducing it. */}
      <section className="span-text">
        <h2 className="legend">Why the work looks like this</h2>
        <p className="mt-5">
          In 2013 a friend offered me a job as a junior software engineer. I had never written a line
          of code. He figured I&rsquo;d work it out. Ten years later I was managing engineering
          teams.
        </p>
        <p className="mt-4">
          That is most of what I believe about people, and it is why the projects here are almost
          never mine alone. The crews on them are full of people doing something for the first time.
        </p>
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
