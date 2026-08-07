import { allPosts } from '@/lib/legacy-content'

export const metadata = { title: 'Writing' }

export default function Writing() {
  const posts = allPosts()

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Writing</h1>
      <ul className="mt-8 divide-y divide-neutral-200 dark:divide-neutral-800">
        {posts.map((p) => (
          <li key={p.slug} className="py-5">
            <a href={`/writing/${p.slug}`} className="group block">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-medium group-hover:underline">{p.title}</span>
                <time className="shrink-0 text-sm tabular-nums text-neutral-500">
                  {p.date?.slice(0, 4)}
                </time>
              </div>
              {p.summary ? (
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{p.summary}</p>
              ) : null}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
