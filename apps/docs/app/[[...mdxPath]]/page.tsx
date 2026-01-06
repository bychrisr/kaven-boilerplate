import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../mdx-components'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

export async function generateMetadata(props: any) {
  const params = await props.params
  try {
    const { metadata } = await importPage(params.mdxPath || [])
    return metadata
  } catch {
    return {
      title: 'Not Found'
    }
  }
}

const Wrapper = getMDXComponents({}).wrapper

export default async function Page(props: any) {
  const params = await props.params
  
  // Handle root page (undefined mdxPath)
  const path = params.mdxPath || []
  
  // Return 404 for known invalid paths
  const invalidPrefixes = ['.well-known', 'pt', 'en', 'es', 'favicon', 'robots', 'sitemap']
  if (path.length > 0 && invalidPrefixes.includes(path[0])) {
    return <div>Not Found</div>
  }
  
  let result
  try {
    result = await importPage(path)
  } catch (error) {
    // Return 404 for any module not found errors
    return <div>Not Found</div>
  }

  const { default: MDXContent, toc, metadata, sourceCode } = result
  
  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  )
}
