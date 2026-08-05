import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import { allPosts, postBySlug } from '@/lib/content'

export function generateStaticParams() {
  return allPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = postBySlug(slug)
  return post ? { title: post.title, description: post.summary } : {}
}

export default async function Post({ params }) {
  const { slug } = await params
  const post = postBySlug(slug)
  if (!post) notFound()

  return (
    <article>
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-balance">{post.title}</h1>
        <p className="mt-3 text-sm text-neutral-500">
          <time>{post.date?.slice(0, 10)}</time>
          <span className="px-2">·</span>
          {post.readingTime} min read
        </p>
      </header>
      <div className="prose-neutral max-w-none space-y-4 leading-relaxed">
        <MDXRemote
          source={post.body}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }}
        />
      </div>
    </article>
  )
}
