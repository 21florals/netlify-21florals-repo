import { Link } from '@tanstack/react-router'
import { Menu, ShoppingBag, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useCart } from '@/lib/cart'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-1 leading-none ${className}`}>
      <span className="font-display text-[1.65em] text-bloom">21</span>
      <span className="font-display italic tracking-tight">florals</span>
    </span>
  )
}

const nav = [
  { to: '/shop', label: 'Shop all', search: {} },
  { to: '/shop', label: 'Arrangements', search: { category: 'Arrangements' } },
  { to: '/shop', label: 'Bridal', search: { category: 'Bridal' } },
  { to: '/shop', label: 'Trees', search: { category: 'Potted & Trees' } },
] as const

export function Header() {
  const { count, open } = useCart()
  const [menu, setMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [bump, setBump] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!count) return
    setBump(true)
    const t = setTimeout(() => setBump(false), 400)
    return () => clearTimeout(t)
  }, [count])

  return (
    <>
      <div className="bg-ink text-bone text-[11px] font-mono uppercase tracking-[0.2em] text-center py-2 px-4">
        Complimentary LA same-day courier · Free shipping over $175
      </div>
      <header
        className={`sticky top-0 z-40 transition-[background-color,box-shadow] duration-300 ${
          scrolled ? 'bg-bone/90 backdrop-blur-md shadow-[0_1px_0_rgba(35,27,26,0.1)]' : 'bg-bone'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 h-16 md:h-20 flex items-center justify-between gap-6">
          <button
            className="md:hidden -ml-2 p-2"
            aria-label="Open menu"
            onClick={() => setMenu(true)}
          >
            <Menu size={22} />
          </button>

          <Link to="/" className="text-2xl md:text-[1.7rem]" aria-label="21 florals home">
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm">
            {nav.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                search={item.search}
                className="relative py-1 after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full after:bg-bloom after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
              >
                {item.label}
              </Link>
            ))}
            <Link to="/" hash="atelier" className="py-1 text-ink-soft hover:text-ink">
              Atelier
            </Link>
          </nav>

          <button
            onClick={open}
            className={`relative flex items-center gap-2 rounded-full border border-ink/80 pl-3.5 pr-4 py-2 text-sm hover:bg-ink hover:text-bone transition-colors ${
              bump ? 'scale-110' : 'scale-100'
            } transition-transform`}
            aria-label={`Open bag, ${count} items`}
          >
            <ShoppingBag size={16} />
            <span className="hidden sm:inline">Bag</span>
            <span className="font-mono text-xs tabular-nums">{count}</span>
          </button>
        </div>
      </header>

      {menu && (
        <div className="fixed inset-0 z-50 bg-ink text-bone fade-in md:hidden flex flex-col">
          <div className="flex items-center justify-between px-5 h-16">
            <span className="text-2xl">
              <Logo className="[&>span:first-child]:text-blush" />
            </span>
            <button aria-label="Close menu" onClick={() => setMenu(false)} className="p-2 -mr-2">
              <X size={22} />
            </button>
          </div>
          <nav className="flex flex-col px-5 pt-8 gap-2">
            {nav.map((item, i) => (
              <Link
                key={item.label}
                to={item.to}
                search={item.search}
                onClick={() => setMenu(false)}
                className="font-display text-5xl rise"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <p className="mt-auto p-5 font-mono text-xs uppercase tracking-[0.2em] text-bone/60">
            Studio · 18543 Devonshire St, Northridge
          </p>
        </div>
      )}
    </>
  )
}
