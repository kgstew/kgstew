import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeSections from '@/lib/rehype-sections'
import { mdxComponents } from '@/lib/mdx-components'
import {
  projectSlugs,
  projectBySlug,
  postsForProject,
  heroAsset,
  assetsByRole,
} from '@/lib/content'
import Loop from '@/components/media/Loop'
import Gallery from '@/components/media/Gallery'
import Specs from '@/components/work/Specs'
import Sheet from '@/components/work/Sheet'

// Derived from the same filtered list as allProjects(), so an embargoed
// project can never have a route emitted for it. dynamicParams closes the
// gap for a guessed slug.
export function generateStaticParams() {
  return projectSlugs().map((slug) => ({ slug }))
}
export const dynamicParams = false

export async function generateMetadata({ params }) {
  const { slug } = await params
  const p = projectBySlug(slug)
  return p ? { title: p.title, description: p.summary || p.card } : {}
}

export default async function Project({ params }) {
  const { slug } = await params
  const project = projectBySlug(slug)
  if (!project) notFound()

  const posts = postsForProject(slug)
  const hero = heroAsset(project.assets)
  // Hero-role videos are placed deliberately in the body — a loop of the thing
  // moving belongs next to the prose about how it moves, not stacked under the
  // hero photograph where it reads as a second, unrelated banner.
  const bodyRefsLoop = /<Figure[^>]+\.(MOV|MP4|mp4|mov)"/.test(project.body)
  const heroLoops = bodyRefsLoop
    ? []
    : assetsByRole(project.assets, 'hero').filter((a) => a.type === 'video')

  return (
    <article data-project={project.slug} className="flow">
      {/* `wide` is the page default now, so nothing here opts in. Sections carry
          their own label gutter and narrow the prose themselves. */}
      <div>
        <Sheet project={project} hero={hero} />

        {heroLoops.map((a) => (
          <Loop key={a.id} asset={a} className="mt-8" />
        ))}

        <MDXRemote
          source={project.body}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeSlug, rehypeSections],
            },
          }}
        />

        {project.outcome ? (
          <section className="sec">
            <h2>Outcome</h2>
            <p>{project.outcome}</p>
          </section>
        ) : null}

        <Specs specs={project.specs} className="mt-16" />

        <Gallery assetKey={project.assets} role="process" className="mt-16" />
        <Gallery assetKey={project.assets} role="detail" className="mt-6" />

        {project.collaborators.length > 0 && (
          <section className="sec">
            <h2>Built with</h2>
            <ul className="space-y-1 text-[15px]">
              {project.collaborators.map((c) => (
                <li key={c.name}>
                  <span className="font-medium">{c.name}</span>
                  {c.credit && <span className="text-soft"> — {c.credit}</span>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {posts.length > 0 && (
          <section className="sec">
            <h2>Writing</h2>
            <ul className="space-y-1 text-[15px]">
              {posts.map((pp) => (
                <li key={pp.slug}>
                  <Link href={`/writing/${pp.slug}`} className="text-accent-ink hover:underline">
                    {pp.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  )
}
