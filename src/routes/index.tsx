import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import products, { categories, cdn } from '@/data/products'
import { ProductCard } from '@/components/ProductCard'
import { Marquee, Seal } from '@/components/Brand'

export const Route = createFileRoute('/')({
  component: Home,
})

const collectionCovers: Record<string, string> = {
  Arrangements: '/img/peony-2.jpg',
  'Stems & Bunches': '/img/wildflower-2.jpg',
  'Potted & Trees': '/img/olive-2.jpg',
  Garlands: '/img/bougainvillea-2.jpg',
  Bridal: '/img/bridal-2.jpg',
}

const mosaic = [
  'col-span-2 aspect-[4/5] md:col-span-3 md:row-span-2',
  'aspect-[4/5] md:col-span-3',
  'aspect-[4/5] md:col-span-3',
  'col-span-2 aspect-[16/10] md:col-span-4',
  'col-span-2 aspect-[16/10] md:col-span-2',
]

const pieces = (c: string) => {
  const n = products.filter((p) => p.category === c).length
  return `${n} ${n === 1 ? 'piece' : 'pieces'}`
}

const featured = ['golden-hour-ranunculus', 'laurel-canyon-olive-tree', 'silver-lake-peony-cloud', 'marmont-bridal-cascade']

function Home() {
  const bestsellers = featured.map((slug) => products.find((p) => p.slug === slug)!)

  return (
    <>
      {/* Hero */}
      <section className="relative max-w-[1400px] mx-auto px-5 md:px-10 pt-6 md:pt-10">
        <div className="grid lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-5 relative z-10 lg:pb-16">
            <p className="rise font-mono text-[11px] uppercase tracking-[0.25em] text-bloom">
              Silk floral atelier · Los Angeles
            </p>
            <h1 className="rise font-display text-[3.6rem] sm:text-7xl xl:text-[6.5rem] leading-[0.86] mt-5" style={{ animationDelay: '80ms' }}>
              Picked this <br />
              morning. <em className="text-bloom">Still</em>
              <br />
              <span className="text-outline">blooming</span> in 2046.
            </h1>
            <p className="rise mt-7 max-w-md text-ink-soft leading-relaxed text-[1.05rem]" style={{ animationDelay: '160ms' }}>
              Real-touch silk arrangements, hand-built in our Arts District studio from the flowers that
              grow on every LA fence, canyon and courtyard. No water, no wilting, no compromise.
            </p>
            <div className="rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: '240ms' }}>
              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-ink text-bone pl-7 pr-5 py-4 text-sm hover:bg-bloom transition-colors"
              >
                Shop the collection
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/shop"
                search={{ category: 'Bridal' }}
                className="inline-flex items-center rounded-full border border-ink/30 px-7 py-4 text-sm hover:border-ink transition-colors"
              >
                Bridal florals
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[7/8] overflow-hidden rounded-t-[999px] rounded-b-[2rem] bg-sand">
              <img
                src={cdn('/img/hero.jpg', 1400)}
                srcSet={`${cdn('/img/hero.jpg', 800)} 800w, ${cdn('/img/hero.jpg', 1400)} 1400w, ${cdn('/img/hero.jpg', 2000)} 2000w`}
                sizes="(min-width: 1024px) 58vw, 100vw"
                alt="Bougainvillea, ranunculus and garden roses spilling from a terracotta urn against a pink stucco wall"
                className="absolute inset-0 w-full h-full object-cover object-[60%_center] scale-105 rise"
              />
            </div>
            <Seal className="absolute -left-4 bottom-10 md:-left-12 text-ink bg-blush rounded-full" />
            <Link
              to="/products/$slug"
              params={{ slug: 'bougainvillea-arch-garland' }}
              className="absolute right-4 bottom-4 md:right-6 md:bottom-6 flex items-center gap-3 rounded-full bg-paper/90 backdrop-blur pl-2 pr-5 py-2 text-sm shadow-lg hover:bg-paper transition-colors"
            >
              <img
                src={cdn('/img/bougainvillea-1.jpg', 80, 80)}
                alt=""
                className="size-10 rounded-full object-cover"
              />
              <span>
                <span className="block text-[10px] font-mono uppercase tracking-[0.15em] text-ink-soft">In the shot</span>
                Bougainvillea Garland
              </span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Marquee
        className="mt-16 md:mt-20 py-5 bg-bloom text-paper font-display text-3xl md:text-5xl -rotate-1 scale-[1.02]"
        items={['Ranunculus', 'Bougainvillea', 'Bird of paradise', 'Garden roses', 'King protea', 'Olive branch', 'California poppy']}
      />

      {/* Collections */}
      <section className="max-w-[1400px] mx-auto px-5 md:px-10 mt-24 md:mt-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <h2 className="font-display text-5xl md:text-7xl leading-[0.9]">
            Shop by <em className="text-bloom">mood</em>
          </h2>
          <p className="max-w-sm text-ink-soft">
            Five ways in. Each piece is built to the same standard: petals layered by hand, stems wired to bend,
            color matched to a living bloom.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 md:auto-rows-[280px] gap-4 md:gap-5">
          {categories.map((c, i) => (
            <Link
              key={c}
              to="/shop"
              search={{ category: c }}
              className={`group relative overflow-hidden rounded-[1.5rem] bg-sand md:aspect-auto ${mosaic[i]}`}
            >
              <img
                src={cdn(collectionCovers[c], 900, 900)}
                alt=""
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.4s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-ink/0" />
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-7 flex items-end justify-between text-paper">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/70">
                    {pieces(c)}
                  </p>
                  <p className="font-display text-3xl md:text-4xl leading-none mt-1">{c}</p>
                </div>
                <span className="size-11 rounded-full bg-paper text-ink flex items-center justify-center group-hover:bg-bloom group-hover:text-paper group-hover:rotate-45 transition-all">
                  <ArrowUpRight size={18} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="max-w-[1400px] mx-auto px-5 md:px-10 mt-28 md:mt-36">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-bloom">Most loved</p>
            <h2 className="font-display text-5xl md:text-7xl leading-[0.9] mt-3">The bestsellers</h2>
          </div>
          <Link to="/shop" className="hidden sm:inline-flex items-center gap-2 text-sm underline underline-offset-4 hover:text-bloom">
            View all {products.length} <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {bestsellers.map((p, i) => (
            <div key={p.id} className={i % 2 === 1 ? 'lg:mt-16' : ''}>
              <ProductCard product={p} index={i} />
            </div>
          ))}
        </div>
      </section>

      {/* Atelier */}
      <section id="atelier" className="mt-28 md:mt-40 bg-ink text-bone scroll-mt-20">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-20 md:py-28 grid lg:grid-cols-2 gap-14 items-center">
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-[2rem] rounded-tr-[999px]">
              <img
                src={cdn('/img/atelier.jpg', 1000, 1250)}
                alt="Silk flower stems, shears and ribbon on an oak worktable in the 21 Florals studio"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="absolute -bottom-6 right-4 md:-right-6 font-display text-[7rem] md:text-[10rem] leading-none text-outline text-blush select-none" aria-hidden>
              21
            </p>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-blush">The atelier</p>
            <h2 className="font-display text-5xl md:text-6xl leading-[0.95] mt-4">
              Made on Mateo Street, <em className="text-apricot">one petal at a time.</em>
            </h2>
            <p className="mt-6 text-bone/75 leading-relaxed max-w-lg">
              21 Florals began in 2021 with a single bougainvillea garland for a friend's Echo Park wedding.
              Today our team of eleven designers works from a sunlit warehouse in the Arts District, tinting,
              layering and wiring every stem by hand. Each arrangement is photographed next to a living bloom
              before it leaves the studio. If it does not fool us, it does not ship.
            </p>
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-bone/15 pt-8">
              {[
                ['38k+', 'arrangements shipped'],
                ['4.9', 'average rating'],
                ['11', 'LA designers'],
              ].map(([n, label]) => (
                <div key={label}>
                  <dt className="font-display text-4xl md:text-5xl text-blush">{n}</dt>
                  <dd className="text-xs text-bone/60 mt-1">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Testimonial strip */}
      <section className="max-w-[1100px] mx-auto px-5 md:px-10 mt-24 md:mt-32 text-center">
        <p className="font-display text-3xl md:text-5xl leading-[1.15]">
          “Guests at our Malibu dinner kept leaning in to smell the peonies. They have been on that table for
          <em className="text-bloom"> fourteen months</em> now.”
        </p>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
          Renata Okafor · Point Dume
        </p>
      </section>
    </>
  )
}
