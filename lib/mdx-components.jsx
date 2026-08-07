import { assetBySource } from '@/lib/content'
import Frame from '@/components/media/Frame'
import Loop from '@/components/media/Loop'
import Gallery from '@/components/media/Gallery'

/**
 * `src` is the ORIGINAL FILENAME, not an asset id. Ids are sha256 prefixes like
 * `ef98d42090` and nobody is going to hand-write one in prose — captions.yaml is
 * keyed by filename, so this matches how the captions were authored:
 *
 *   <Figure project="fable-bound" src="IMG_6613.HEIC" />
 */
function Figure({ project, src, ...rest }) {
  const asset = assetBySource(project, src)
  if (!asset) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error(
        `<Figure> found no asset "${src}" in the "${project}" manifest.\n` +
          `  Check the filename against originals/${project}/captions.yaml, or re-run ingest.`
      )
    }
    return null
  }
  return asset.type === 'video' ? <Loop asset={asset} {...rest} /> : <Frame asset={asset} {...rest} />
}

function Aside({ children }) {
  return (
    <aside className="my-8 border-l-2 border-accent pl-4 text-soft">{children}</aside>
  )
}

/**
 * Throws in development on a bare <img>. The migrated posts are full of
 * `/static/images/blog/...` paths that no longer resolve, and a broken-image
 * icon in a gallery is the kind of thing nobody notices until it ships.
 */
function Img(props) {
  if (process.env.NODE_ENV === 'development') {
    throw new Error(
      `Bare <img src="${props.src}"> in MDX.\n` +
        `  Use <Figure project="…" src="ORIGINAL.HEIC" /> so the image comes from the manifest ` +
        `with real alt text, AVIF variants and a placeholder.`
    )
  }
  // eslint-disable-next-line jsx-a11y/alt-text
  return <img {...props} />
}

function A({ href = '', children, ...rest }) {
  const external = /^https?:\/\//.test(href)
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      className="text-accent-ink underline underline-offset-2"
      {...rest}
    >
      {children}
    </a>
  )
}

/**
 * Note on props: next-mdx-remote v6 strips JSX *expression* attributes as part of
 * its fix for evaluating untrusted MDX. Only string props survive here, so
 * `<Gallery columns={3} />` in MDX silently falls back to the default. Anything
 * structured belongs in frontmatter, rendered by the page.
 */
export const mdxComponents = { Figure, Loop, Gallery, Aside, img: Img, a: A }
