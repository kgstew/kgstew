import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import { mdxComponents } from '@/lib/mdx-components'
import {
  projectSlugs,
  projectBySlug,
  postsForProject,
  disciplineLabel,
  heroAsset,
  assetsByRole,
} from '@/lib/content'
import Frame from '@/components/media/Frame'
import Loop from '@/components/media/Loop'
import Gallery from '@/components/media/Gallery'
import Specs from '@/components/work/Specs'

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
  // A hero-role video would otherwise render nowhere: heroAsset() only returns
  // images, and the galleries below only cover process and detail.
  const heroLoops = assetsByRole(project.assets, 'hero').filter((a) => a.type === 'video')

  return (
    <article data-project={project.slug} className="flow">
      <h1 className="text-3xl font-bold tracking-tight text-balance">{project.title}</h1>
      <p className="mt-3 text-lg text-soft">{project.card}</p>

      {hero && <Frame asset={hero} priority className="mt-8" />}
      {heroLoops.map((a) => (
        <Loop key={a.id} asset={a} className="mt-6" />
      ))}

      <dl className="field-list mt-8 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
        {project.role && (
          <>
            <dt className="text-dim">Role</dt>
            <dd>{project.role}</dd>
          </>
        )}
        <dt className="text-dim">Years</dt>
        <dd className="tabular-nums">
          {project.started} — {project.ended}
        </dd>
        <dt className="text-dim">Disciplines</dt>
        <dd>{project.disciplines.map(disciplineLabel).join(' · ')}</dd>
        {project.destination && (
          <>
            <dt className="text-dim">Where</dt>
            <dd>{project.destination}</dd>
          </>
        )}
        {project.disclosure === 'work-only' && (
          <>
            <dt className="text-dim">Client</dt>
            <dd className="text-dim">Not named.</dd>
          </>
        )}
      </dl>

      {project.outcome && <p className="mt-8 text-soft">{project.outcome}</p>}

      <div className="mt-8 space-y-4 leading-relaxed">
        <MDXRemote
          source={project.body}
          components={mdxComponents}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }}
        />
      </div>

      <Specs specs={project.specs} className="mt-10" />

      <Gallery assetKey={project.assets} role="process" className="mt-10" />
      <Gallery assetKey={project.assets} role="detail" columns={3} className="mt-6" />

      {project.collaborators.length > 0 && (
        <section className="mt-10 border-t border-hairline pt-6">
          <h2 className="text-sm tracking-widest text-dim uppercase">Built with</h2>
          <ul className="mt-3 space-y-1 text-sm">
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
        <section className="mt-10 border-t border-hairline pt-6">
          <h2 className="text-sm tracking-widest text-dim uppercase">Writing</h2>
          <ul className="mt-3 space-y-1 text-sm">
            {posts.map((p) => (
              <li key={p.slug}>
                <Link href={`/writing/${p.slug}`} className="hover:underline">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}
