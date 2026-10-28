import { Link } from '@tanstack/react-router'
import { Plus, Star } from 'lucide-react'
import { cdn, defaultSelections, formatPrice } from '@/data/products'
import type { Product } from '@/data/products'
import { useCart } from '@/lib/cart'

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { add } = useCart()
  return (
    <article
      className="group relative rise"
      style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
    >
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        className="block relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-sand"
      >
        <img
          src={cdn(product.images[0], 640, 800)}
          srcSet={`${cdn(product.images[0], 400, 500)} 400w, ${cdn(product.images[0], 640, 800)} 640w`}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
        />
        {product.images[1] && (
          <img
            src={cdn(product.images[1], 640, 800)}
            alt=""
            aria-hidden
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          />
        )}
        {product.badge && (
          <span className="absolute top-3 left-3 rounded-full bg-paper/90 backdrop-blur px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em]">
            {product.badge}
          </span>
        )}
      </Link>
      <button
        onClick={() => add(product.id, defaultSelections(product))}
        aria-label={`Quick add ${product.name} to bag`}
        className="absolute right-3 bottom-[7.25rem] size-11 rounded-full bg-ink text-bone flex items-center justify-center shadow-lg md:opacity-0 md:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 focus-visible:opacity-100 transition-all hover:bg-bloom hover:rotate-90"
      >
        <Plus size={18} />
      </button>
      <div className="pt-4 h-[6.5rem]">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
          {product.collection}
        </p>
        <div className="mt-1.5 flex items-start justify-between gap-4">
          <Link
            to="/products/$slug"
            params={{ slug: product.slug }}
            className="font-display text-xl leading-tight hover:text-bloom transition-colors"
          >
            {product.name}
          </Link>
          <div className="text-right shrink-0">
            <p className="font-mono text-sm tabular-nums">{formatPrice(product.price)}</p>
            {product.compareAt && (
              <p className="font-mono text-xs line-through text-ink-soft/70">
                {formatPrice(product.compareAt)}
              </p>
            )}
          </div>
        </div>
        <p className="mt-1.5 flex items-center gap-1 text-xs text-ink-soft">
          <Star size={12} className="fill-apricot text-apricot" />
          {product.rating.toFixed(1)} · {product.reviews} reviews
        </p>
      </div>
    </article>
  )
}
