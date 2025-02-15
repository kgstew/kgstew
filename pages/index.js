import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { allAuthors } from 'contentlayer/generated'
import About from './about'
export const getStaticProps = async () => {
  const author = allAuthors.find((p) => p.slug === 'default')
  return {
    props: {
      author,
    },
  }
}
export default function Home({ author }) {
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <About author={author} />
      </div>
    </>
  )
}
