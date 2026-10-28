import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { Check, ChevronLeft, ChevronRight, Leaf, Minus, Plus, Star, Truck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import products, {
  cdn,
  defaultSelections,
  formatPrice,
  getProduct,
  priceFor,
} from '@/data/products'
import { ProductCard } from '@/components/ProductCard'
import { useCart } from '@/lib/cart'

export const Route = createFileRoute('/products/$slug')({
  loader: ({ params }) => {
    const product = getProduct(params.slug)
    if (!product) throw notFound()
    return product
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} · 21 Florals` },
          { name: 'description', content: loaderData.shortDescription },
          { property: 'og:image', content: loaderData.images[0] },
        ]
      : [],
  }),
  component: ProductPage,
})

interface View {
  src: string
  label: string
  /** Detail views zoom into the studio shot */
  zoom?: { scale: number; origin: string }
}

function Gallery({ name, images }: { name: string; images: Array<string> }) {
  const views: Array<View> = [
    { src: images[0], label: 'Studio' },
    ...images.slice(1).map((src) => ({ src, label: 'At home' })),
    { src: images[0], label: 'Petal detail', zoom: { scale: 2.1, origin: '50% 42%' } },
  ]
  const [active, setActive] = useState(0)
  const [lens, setLens] = useState<string | null>(null)
  const track = useRef<HTMLDivElement>(null)

  const go = (i: number) => {
    const next = (i + views.length) % views.length
    setActive(next)
    const el = track.current
    if (el) el.scrollTo({ left: el.clientWidth * next, behavior: 'smooth' })
  }

  return (
    <div className="md:grid md:grid-cols-[84px_1fr] gap-4">
      <div className="hidden md:flex flex-col gap-3">
        {views.map((v, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Show ${v.label} view`}
            aria-current={active === i}
            className={`relative aspect-[4/5] overflow-hidden rounded-xl bg-sand transition-all ${
              active === i ? 'ring-2 ring-ink ring-offset-2 ring-offset-bone' : 'opacity-60 hover:opacity-100'
            }`}
          >
            <img
              src={cdn(v.src, 168, 210)}
              alt=""
              className="w-full h-full object-cover"
              style={v.zoom ? { transform: `scale(${v.zoom.scale})`, transformOrigin: v.zoom.origin } : undefined}
            />
          </button>
        ))}
      </div>

      <div className="relative">
        <div
          ref={track}
          onScroll={(e) => {
            const el = e.currentTarget
            const i = Math.round(el.scrollLeft / el.clientWidth)
            if (i !== active) setActive(i)
          }}
          className="flex overflow-x-auto snap-x snap-mandatory rounded-[1.5rem] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {views.map((v, i) => (
            <div
              key={i}
              className="relative shrink-0 w-full aspect-[4/5] snap-center overflow-hidden bg-sand cursor-zoom-in"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect()
                setLens(
                  `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}% ${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`,
                )
              }}
              onMouseLeave={() => setLens(null)}
            >
              <img
                src={cdn(v.src, 1100, 1375)}
                srcSet={`${cdn(v.src, 700, 875)} 700w, ${cdn(v.src, 1100, 1375)} 1100w`}
                sizes="(min-width: 768px) 50vw, 100vw"
                alt={`${name}, ${v.label.toLowerCase()} view`}
                loading={i === 0 ? 'eager' : 'lazy'}
                className="w-full h-full object-cover transition-transform duration-300 ease-out"
                style={
                  lens && active === i
                    ? { transform: `scale(${v.zoom ? v.zoom.scale + 0.4 : 1.6})`, transformOrigin: lens }
                    : v.zoom
                      ? { transform: `scale(${v.zoom.scale})`, transformOrigin: v.zoom.origin }
                      : undefined
                }
              />
            </div>
          ))}
        </div>

        <span className="absolute top-4 left-4 rounded-full bg-paper/90 backdrop-blur px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em] pointer-events-none">
          {views[active].label}
        </span>

        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            onClick={() => go(active - 1)}
            aria-label="Previous image"
            className="size-11 rounded-full bg-paper/90 backdrop-blur flex items-center justify-center hover:bg-ink hover:text-bone transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => go(active + 1)}
            aria-label="Next image"
            className="size-11 rounded-full bg-paper/90 backdrop-blur flex items-center justify-center hover:bg-ink hover:text-bone transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="md:hidden flex justify-center gap-1.5 mt-4">
          {views.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${active === i ? 'w-6 bg-ink' : 'w-1.5 bg-ink/25'}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function ProductPage() {
  const product = Route.useLoaderData()
  const { add } = useCart()
  const [selections, setSelections] = useState(() => defaultSelections(product))
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [openDetail, setOpenDetail] = useState<string | null>('details')

  // Leave room for the mobile sticky add-to-bag bar
  useEffect(() => {
    document.body.classList.add('max-md:pb-20')
    return () => document.body.classList.remove('max-md:pb-20')
  }, [])

  useEffect(() => {
    setSelections(defaultSelections(product))
    setQuantity(1)
  }, [product.slug])

  const unit = priceFor(product, selections)
  const related = products
    .filter((p) => p.id !== product.id)
    .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category))
    .slice(0, 3)

  const addToBag = () => {
    add(product.id, selections, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const sections = [
    { id: 'details', title: 'The details', body: <ul className="space-y-2">{product.details.map((d) => <li key={d} className="flex gap-2"><span className="text-bloom">✦</span>{d}</li>)}</ul> },
    { id: 'story', title: 'The story', body: <p>{product.description}</p> },
    {
      id: 'shipping',
      title: 'Shipping & returns',
      body: (
        <p>
          {product.leadTime}. Same-day courier is available across Los Angeles County for orders
          placed before noon. Unused pieces can be returned within 30 days in their original box.
        </p>
      ),
    },
  ]

  return (
    <>
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 pt-6 md:pt-10">
        <nav className="text-xs font-mono uppercase tracking-[0.15em] text-ink-soft flex gap-2 mb-6">
          <Link to="/shop" className="hover:text-ink">Shop</Link>
          <span>/</span>
          <Link to="/shop" search={{ category: product.category }} className="hover:text-ink">
            {product.category}
          </Link>
        </nav>

        <div className="grid md:grid-cols-[1.15fr_1fr] gap-8 lg:gap-16 items-start">
          <Gallery key={product.slug} name={product.name} images={product.images} />

          <div className="rise">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-bloom">
              {product.collection}
            </p>
            <h1 className="font-display text-5xl lg:text-6xl leading-[0.95] mt-3">{product.name}</h1>

            <div className="mt-4 flex items-center gap-3 text-sm text-ink-soft">
              <span className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.round(product.rating) ? 'fill-apricot text-apricot' : 'text-ink/20'}
                  />
                ))}
              </span>
              {product.rating.toFixed(1)} · {product.reviews} reviews
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-4xl tabular-nums" aria-live="polite">
                {formatPrice(unit)}
              </span>
              {product.compareAt && unit === product.price && (
                <span className="font-mono text-ink-soft line-through">{formatPrice(product.compareAt)}</span>
              )}
              {product.badge && (
                <span className="ml-auto rounded-full bg-blush/60 text-bloom-deep px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em]">
                  {product.badge}
                </span>
              )}
            </div>
            <p className="mt-4 text-ink-soft leading-relaxed">{product.shortDescription}</p>

            <div className="mt-8 space-y-6">
              {product.options.map((option) => (
                <fieldset key={option.name}>
                  <legend className="flex w-full justify-between text-sm mb-3">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">
                      {option.name}
                    </span>
                    <span>{selections[option.name]}</span>
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value) => {
                      const active = selections[option.name] === value.label
                      return (
                        <button
                          key={value.label}
                          onClick={() => setSelections((s) => ({ ...s, [option.name]: value.label }))}
                          aria-pressed={active}
                          title={value.hint}
                          className={`rounded-2xl border px-4 py-2.5 text-sm text-left transition-all ${
                            active
                              ? 'border-ink bg-ink text-bone'
                              : 'border-ink/20 bg-paper/60 hover:border-ink'
                          }`}
                        >
                          {value.label}
                          {value.priceDelta !== 0 && (
                            <span className={`ml-2 font-mono text-xs ${active ? 'text-bone/70' : 'text-ink-soft'}`}>
                              {value.priceDelta > 0 ? '+' : '−'}
                              {formatPrice(Math.abs(value.priceDelta))}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </fieldset>
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              <div className="flex items-center rounded-full border border-ink/25 bg-paper">
                <button
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-4 hover:text-bloom"
                >
                  <Minus size={16} />
                </button>
                <span className="w-6 text-center font-mono tabular-nums">{quantity}</span>
                <button
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                  className="p-4 hover:text-bloom"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={addToBag}
                className={`flex-1 rounded-full py-4 text-sm tracking-wide flex items-center justify-center gap-2 transition-colors ${
                  added ? 'bg-olive text-paper' : 'bg-bloom text-paper hover:bg-bloom-deep'
                }`}
              >
                {added ? (
                  <>
                    <Check size={16} /> Added to bag
                  </>
                ) : (
                  <>Add to bag · {formatPrice(unit * quantity)}</>
                )}
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2.5 rounded-2xl bg-paper/70 p-3">
                <Truck size={16} className="text-bloom shrink-0" />
                <span>{product.leadTime}<br /><span className="text-ink-soft">Same-day in LA</span></span>
              </div>
              <div className="flex items-center gap-2.5 rounded-2xl bg-paper/70 p-3">
                <Leaf size={16} className="text-olive shrink-0" />
                <span>Never needs water<br /><span className="text-ink-soft">Lasts for decades</span></span>
              </div>
            </div>

            <div className="mt-8 border-t border-ink/15">
              {sections.map((s) => (
                <div key={s.id} className="border-b border-ink/15">
                  <button
                    onClick={() => setOpenDetail(openDetail === s.id ? null : s.id)}
                    aria-expanded={openDetail === s.id}
                    className="w-full flex justify-between items-center py-4 text-left"
                  >
                    <span className="font-display text-xl">{s.title}</span>
                    <Plus
                      size={18}
                      className={`transition-transform ${openDetail === s.id ? 'rotate-45' : ''}`}
                    />
                  </button>
                  {openDetail === s.id && (
                    <div className="pb-5 text-sm text-ink-soft leading-relaxed fade-in">{s.body}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="max-w-[1400px] mx-auto px-5 md:px-10 mt-28">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-4xl md:text-5xl">
            Pairs <em className="text-bloom">beautifully</em> with
          </h2>
          <Link to="/shop" className="text-sm underline underline-offset-4 hover:text-bloom shrink-0">
            Shop all
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {related.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* Mobile sticky add-to-bag */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-paper/95 backdrop-blur border-t border-ink/10 p-3 flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm truncate">{product.name}</p>
          <p className="font-mono text-xs text-ink-soft">{formatPrice(unit)}</p>
        </div>
        <button
          onClick={addToBag}
          className={`rounded-full px-6 py-3 text-sm ${added ? 'bg-olive text-paper' : 'bg-bloom text-paper'}`}
        >
          {added ? 'Added' : 'Add to bag'}
        </button>
      </div>
    </>
  )
}
