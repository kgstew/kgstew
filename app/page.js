import { allPosts } from '@/lib/content'

export default function Home() {
  const recent = allPosts().slice(0, 5)

  return (
    <div className="space-y-16">
      <section>
        <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          I design systems and assemble the people who build them.
        </h1>
        <p className="mt-6 max-w-prose text-lg text-neutral-600 dark:text-neutral-400">
          Sometimes the parts are software services, sometimes hardware modules, sometimes people.
          The job is the same: build the thing in the middle that makes them work as one system.
        </p>
        <p className="mt-4 max-w-prose text-neutral-600 dark:text-neutral-400">
          It looks scattered. It&rsquo;s the qualification — you can only integrate systems you can
          speak the language of.
        </p>
      </section>

      <section>
        <h2 className="text-sm font-medium tracking-widest text-neutral-500 uppercase">Recent</h2>
        <ul className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
          {recent.map((p) => (
            <li key={p.slug} className="py-4">
              <a href={`/writing/${p.slug}`} className="group block">
                <span className="font-medium group-hover:underline">{p.title}</span>
                {p.summary ? (
                  <span className="mt-1 block text-sm text-neutral-600 dark:text-neutral-400">
                    {p.summary}
                  </span>
                ) : null}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
