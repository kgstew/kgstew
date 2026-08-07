import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import { mdxComponents } from '@/lib/mdx-components'
import { postSlugs, postBySlug } from '@/lib/content'

export function generateStaticParams() {
  return postSlugs().map((slug) => ({ slug }))
}
export const dynamicParams = false

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
    <article data-surface="reading" className="flow">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-balance">{post.title}</h1>
        <p className="mt-3 text-sm text-dim">
          <time>{post.day ?? post.date}</time>
          <span className="px-2">·</span>
          {post.readingTime} min read
        </p>
      </header>
      <div className="prose-neutral space-y-4 leading-relaxed">
        <MDXRemote
          source={post.body}
          components={mdxComponents}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }}
        />
      </div>
    </article>
  )
}
