import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import { projectSlugs, projectBySlug, postsForProject, disciplineLabel } from '@/lib/content'

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

  return (
    <article data-project={project.slug}>
      <h1 className="text-3xl font-bold tracking-tight text-balance">{project.title}</h1>
      <p className="mt-3 max-w-prose text-lg text-neutral-700">{project.card}</p>

      <dl className="mt-8 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
        {project.role && (
          <>
            <dt className="text-neutral-500">Role</dt>
            <dd>{project.role}</dd>
          </>
        )}
        <dt className="text-neutral-500">Years</dt>
        <dd className="tabular-nums">
          {project.started} — {project.ended}
        </dd>
        <dt className="text-neutral-500">Disciplines</dt>
        <dd>{project.disciplines.map(disciplineLabel).join(' · ')}</dd>
        {project.destination && (
          <>
            <dt className="text-neutral-500">Where</dt>
            <dd>{project.destination}</dd>
          </>
        )}
        {project.disclosure === 'work-only' && (
          <>
            <dt className="text-neutral-500">Client</dt>
            <dd className="text-neutral-500">Not named.</dd>
          </>
        )}
      </dl>

      {project.outcome && <p className="mt-8 max-w-prose text-neutral-700">{project.outcome}</p>}

      <div className="mt-8 max-w-prose space-y-4 leading-relaxed">
        <MDXRemote
          source={project.body}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }}
        />
      </div>

      {project.collaborators.length > 0 && (
        <section className="mt-10 border-t border-neutral-200 pt-6">
          <h2 className="text-sm tracking-widest text-neutral-500 uppercase">Built with</h2>
          <ul className="mt-3 space-y-1 text-sm">
            {project.collaborators.map((c) => (
              <li key={c.name}>
                <span className="font-medium">{c.name}</span>
                {c.credit && <span className="text-neutral-600"> — {c.credit}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {posts.length > 0 && (
        <section className="mt-10 border-t border-neutral-200 pt-6">
          <h2 className="text-sm tracking-widest text-neutral-500 uppercase">Writing</h2>
          <ul className="mt-3 space-y-1 text-sm">
            {posts.map((p) => (
              <li key={p.slug}>
                <a href={`/writing/${p.slug}`} className="hover:underline">
                  {p.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}
