import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { z } from 'zod'
import products, { categories, palettes } from '@/data/products'
import { ProductCard } from '@/components/ProductCard'

const sorts = {
  featured: 'Featured',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
  rating: 'Top rated',
} as const

const priceBands = {
  under100: { label: 'Under $100', min: 0, max: 99 },
  '100to200': { label: '$100–$200', min: 100, max: 200 },
  '200to300': { label: '$200–$300', min: 201, max: 300 },
  over300: { label: '$300+', min: 301, max: Infinity },
} as const

const searchSchema = z.object({
  q: z.string().optional(),
  category: z.enum(categories as [string, ...Array<string>]).optional(),
  palette: z.enum(palettes.map((p) => p.name) as [string, ...Array<string>]).optional(),
  price: z.enum(Object.keys(priceBands) as [keyof typeof priceBands]).optional(),
  sort: z.enum(Object.keys(sorts) as [keyof typeof sorts]).optional(),
})

type ShopSearch = z.infer<typeof searchSchema>

export const Route = createFileRoute('/shop')({
  validateSearch: (search: Record<string, unknown>): ShopSearch => {
    const parsed = searchSchema.safeParse(search)
    return parsed.success ? parsed.data : {}
  },
  head: () => ({ meta: [{ title: 'Shop silk florals · 21 Florals' }] }),
  component: Shop,
})

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full border px-4 py-2 text-sm transition-colors ${
        active
          ? 'bg-ink text-bone border-ink'
          : 'border-ink/20 hover:border-ink bg-paper/60'
      }`}
    >
      {children}
    </button>
  )
}

function Shop() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: '/shop' })
  const [query, setQuery] = useState(search.q ?? '')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const update = (patch: Partial<ShopSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true, resetScroll: false })

  // Debounce typing into the URL
  useEffect(() => {
    const t = setTimeout(() => {
      if ((search.q ?? '') !== query) update({ q: query || undefined })
    }, 220)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => setQuery(search.q ?? ''), [search.q])

  const results = useMemo(() => {
    const q = (search.q ?? '').trim().toLowerCase()
    const band = search.price ? priceBands[search.price] : null
    const list = products.filter((p) => {
      if (search.category && p.category !== search.category) return false
      if (search.palette && p.palette !== search.palette) return false
      if (band && (p.price < band.min || p.price > band.max)) return false
      if (q) {
        const haystack = [p.name, p.collection, p.category, p.palette, p.shortDescription, p.description]
          .join(' ')
          .toLowerCase()
        return q.split(/\s+/).every((word) => haystack.includes(word))
      }
      return true
    })
    switch (search.sort) {
      case 'price-asc':
        return [...list].sort((a, b) => a.price - b.price)
      case 'price-desc':
        return [...list].sort((a, b) => b.price - a.price)
      case 'rating':
        return [...list].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
      default:
        return list
    }
  }, [search])

  const activeCount = [search.q, search.category, search.palette, search.price].filter(Boolean).length
  const clearAll = () => {
    setQuery('')
    navigate({ search: { sort: search.sort }, replace: true, resetScroll: false })
  }

  const filterPanel = (
    <div className="space-y-8">
      <fieldset>
        <legend className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft mb-3">
          Palette
        </legend>
        <div className="flex flex-wrap gap-2">
          {palettes.map((p) => (
            <button
              key={p.name}
              onClick={() => update({ palette: search.palette === p.name ? undefined : p.name })}
              aria-pressed={search.palette === p.name}
              className={`flex items-center gap-2 rounded-full border pl-1.5 pr-3.5 py-1.5 text-sm transition-colors ${
                search.palette === p.name ? 'border-ink bg-paper' : 'border-ink/15 hover:border-ink/50'
              }`}
            >
              <span
                className={`size-5 rounded-full ring-1 ring-ink/10 ${search.palette === p.name ? 'ring-2 ring-offset-1 ring-ink' : ''}`}
                style={{ background: p.swatch }}
              />
              {p.name}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft mb-3">
          Price
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(priceBands).map(([key, band]) => (
            <Chip
              key={key}
              active={search.price === key}
              onClick={() =>
                update({ price: search.price === key ? undefined : (key as keyof typeof priceBands) })
              }
            >
              {band.label}
            </Chip>
          ))}
        </div>
      </fieldset>
      {activeCount > 0 && (
        <button onClick={clearAll} className="text-sm underline underline-offset-4 hover:text-bloom">
          Clear all filters
        </button>
      )}
    </div>
  )

  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-10">
      <section className="pt-10 md:pt-16 pb-8 grid md:grid-cols-[1fr_auto] gap-6 items-end">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-bloom">
            The collection · {products.length} pieces
          </p>
          <h1 className="font-display text-6xl md:text-8xl leading-[0.9] mt-3">
            {search.category ?? (
              <>
                Every stem, <em className="text-bloom">forever.</em>
              </>
            )}
          </h1>
        </div>
        <label className="relative block w-full md:w-80">
          <span className="sr-only">Search florals</span>
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search peonies, olive, bridal…"
            className="w-full rounded-full border border-ink/20 bg-paper pl-11 pr-10 py-3.5 text-sm outline-none focus:border-ink focus:ring-4 focus:ring-blush/50 transition"
          />
          {query && (
            <button
              aria-label="Clear search"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ink-soft hover:text-ink"
            >
              <X size={16} />
            </button>
          )}
        </label>
      </section>

      <div className="sticky top-16 md:top-20 z-30 -mx-5 md:-mx-10 px-5 md:px-10 py-3 bg-bone/90 backdrop-blur-md border-y border-ink/10 flex items-center gap-3">
        <div className="flex gap-2 overflow-x-auto flex-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Chip active={!search.category} onClick={() => update({ category: undefined })}>
            All
          </Chip>
          {categories.map((c) => (
            <Chip
              key={c}
              active={search.category === c}
              onClick={() => update({ category: search.category === c ? undefined : c })}
            >
              {c}
            </Chip>
          ))}
        </div>
        <button
          onClick={() => setFiltersOpen(true)}
          className="lg:hidden shrink-0 flex items-center gap-2 rounded-full border border-ink/20 px-4 py-2 text-sm"
        >
          <SlidersHorizontal size={15} />
          Filter
        </button>
        <select
          value={search.sort ?? 'featured'}
          onChange={(e) =>
            update({ sort: e.target.value === 'featured' ? undefined : (e.target.value as keyof typeof sorts) })
          }
          aria-label="Sort products"
          className="hidden sm:block shrink-0 rounded-full border border-ink/20 bg-paper px-4 py-2 text-sm outline-none focus:border-ink"
        >
          {Object.entries(sorts).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-10 pt-8">
        <aside className="hidden lg:block">
          <div className="sticky top-44">{filterPanel}</div>
        </aside>

        <div>
          <p className="text-sm text-ink-soft mb-6" aria-live="polite">
            Showing <span className="font-mono text-ink">{results.length}</span>{' '}
            {results.length === 1 ? 'piece' : 'pieces'}
            {search.q && (
              <>
                {' '}for “<span className="text-ink">{search.q}</span>”
              </>
            )}
          </p>

          {results.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-ink/25 py-24 px-6 text-center">
              <p className="font-display text-4xl">No blooms match that.</p>
              <p className="mt-3 text-ink-soft max-w-md mx-auto">
                Try a different flower, palette or price, or ask our studio for a custom arrangement.
              </p>
              <button
                onClick={clearAll}
                className="mt-6 rounded-full bg-ink text-bone px-6 py-3 text-sm hover:bg-bloom transition-colors"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12">
              {results.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}

          <div className="mt-20 rounded-[1.5rem] bg-bloom text-paper p-8 md:p-12 grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <p className="font-display text-3xl md:text-4xl leading-tight">
                Dreaming of something we haven't made yet?
              </p>
              <p className="mt-2 text-paper/80 text-sm">
                Our designers build custom installations for homes, hotels and weddings across Southern California.
              </p>
            </div>
            <Link
              to="/"
              hash="atelier"
              className="justify-self-start rounded-full bg-paper text-ink px-6 py-3 text-sm hover:bg-blush transition-colors"
            >
              Visit the atelier
            </Link>
          </div>
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button
            aria-label="Close filters"
            className="absolute inset-0 bg-ink/40 fade-in"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute bottom-0 inset-x-0 rounded-t-[1.75rem] bg-paper p-6 pb-8 rise max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <p className="font-display text-3xl">Filter</p>
              <button onClick={() => setFiltersOpen(false)} aria-label="Close filters" className="p-2 -mr-2">
                <X size={22} />
              </button>
            </div>
            <fieldset className="mb-8 sm:hidden">
              <legend className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft mb-3">
                Sort
              </legend>
              <div className="flex flex-wrap gap-2">
                {Object.entries(sorts).map(([value, label]) => (
                  <Chip
                    key={value}
                    active={(search.sort ?? 'featured') === value}
                    onClick={() =>
                      update({ sort: value === 'featured' ? undefined : (value as keyof typeof sorts) })
                    }
                  >
                    {label}
                  </Chip>
                ))}
              </div>
            </fieldset>
            {filterPanel}
            <button
              onClick={() => setFiltersOpen(false)}
              className="mt-8 w-full rounded-full bg-ink text-bone py-4 text-sm"
            >
              Show {results.length} {results.length === 1 ? 'piece' : 'pieces'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
