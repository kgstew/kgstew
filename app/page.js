import Link from 'next/link'
import { featuredProjects, allPosts } from '@/lib/content'

export default function Home() {
  const featured = featuredProjects(3)
  const posts = allPosts().slice(0, 3)

  return (
    <div className="space-y-16">
      <section>
        <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          I design systems and assemble the people who build them.
        </h1>
        <p className="mt-6 max-w-prose text-lg text-soft">
          The parts are usually people first — and then whatever software and hardware those people
          need. The job is the same: build the thing in the middle that makes them work as one
          system.
        </p>
        <p className="mt-4 max-w-prose text-soft">
          It looks scattered. It&rsquo;s the qualification — you can only integrate systems you can
          speak the language of.
        </p>
      </section>

      <section>
        <h2 className="text-sm font-medium tracking-widest text-dim uppercase">Selected work</h2>
        <ul className="mt-4 divide-y divide-hairline">
          {featured.map((p) => (
            <li key={p.slug} className="py-4">
              <Link href={`/work/${p.slug}`} className="group block">
                <span className="font-medium group-hover:underline">{p.title}</span>
                <span className="mt-1 block text-sm text-soft">{p.card}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/work" className="mt-4 inline-block text-sm text-dim hover:underline">
          All work →
        </Link>
      </section>

      {posts.length > 0 && (
        <section>
          <h2 className="text-sm font-medium tracking-widest text-dim uppercase">Writing</h2>
          <ul className="mt-4 divide-y divide-hairline">
            {posts.map((p) => (
              <li key={p.slug} className="py-4">
                <Link href={`/writing/${p.slug}`} className="group block">
                  <span className="font-medium group-hover:underline">{p.title}</span>
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
