import Link from 'next/link'
import { allPosts } from '@/lib/content'

export const metadata = { title: 'Writing' }

export default function Writing() {
  const posts = allPosts()

  return (
    <div className="flow">
      <h1 className="text-3xl font-bold tracking-tight">Writing</h1>
      <ul className="mt-8 divide-y divide-hairline">
        {posts.map((p) => (
          <li key={p.slug} className="py-5">
            <Link href={`/writing/${p.slug}`} className="group block">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-medium group-hover:underline">{p.title}</span>
                <time className="shrink-0 text-sm tabular-nums text-dim">
                  {p.date?.slice(0, 4)}
                </time>
              </div>
              {p.summary ? (
                <p className="mt-1 text-sm text-soft">{p.summary}</p>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
