import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head, Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import 'katex/dist/katex.min.css'
import '../styles/globals.css'

export const metadata = {
  title: 'Kaven Platform Documentation',
  description: 'Official documentation for the Kaven Platform.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const pageMap = await getPageMap()
  return (
    <html lang="pt-BR" dir="ltr" suppressHydrationWarning>
      <Head>
        {/* Custom Head tags if needed */}
      </Head>
      <body suppressHydrationWarning>
        <Layout
          navbar={
            <Navbar
              logo={<span className="font-bold">Kaven Platform</span>}
              projectLink="https://github.com/bychrisr/kaven-boilerplate"
            />
          }
          search={<Search placeholder="Buscar documentação..." />}
          footer={<Footer>Kaven Platform {new Date().getFullYear()} © All rights reserved.</Footer>}
          pageMap={pageMap}
          editLink="Edit this page on GitHub"
          docsRepositoryBase="https://github.com/bychrisr/kaven-boilerplate/tree/main/apps/docs"
          sidebar={{ defaultMenuCollapseLevel: 1, autoCollapse: true }}
          toc={{ float: true }}
          darkMode
          nextThemes={{ defaultTheme: 'system' }}
          navigation
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
