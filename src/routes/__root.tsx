import { HeadContent, Link, Scripts, createRootRoute } from '@tanstack/react-router'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Brand'
import { CartDrawer } from '@/components/CartDrawer'
import { CartProvider } from '@/lib/cart'

import '../styles.css'

const siteName = '21 Florals · Premium Silk Florals, Los Angeles'
const siteDescription =
  'Hand-arranged silk florals from a Los Angeles atelier. Arrangements, stems, trees and bridal that never wilt.'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: siteName,
      },
      {
        name: 'description',
        content: siteDescription,
      },
      {
        property: 'og:title',
        content: siteName,
      },
      {
        property: 'og:description',
        content: siteDescription,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      { name: 'theme-color', content: '#f4ede3' },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300..700&family=DM+Mono:wght@400;500&family=Gloock&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="grain">
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  return (
    <section className="max-w-3xl mx-auto px-5 py-32 text-center">
      <p className="font-display text-[9rem] leading-none text-outline text-bloom">404</p>
      <h1 className="font-display text-4xl mt-4">This stem wandered off.</h1>
      <p className="mt-4 text-ink-soft">The page you are looking for is not in our studio.</p>
      <Link
        to="/shop"
        className="inline-block mt-8 rounded-full bg-ink text-bone px-7 py-3 text-sm hover:bg-bloom transition-colors"
      >
        Back to the shop
      </Link>
    </section>
  )
}
