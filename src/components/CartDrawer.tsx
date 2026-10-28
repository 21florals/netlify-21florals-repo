import { Link } from '@tanstack/react-router'
import { Minus, Plus, ShoppingBag, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useCart } from '@/lib/cart'
import { cdn, formatPrice } from '@/data/products'
import { createCheckoutSession, getStripeEnabled } from '@/lib/stripe'

const FREE_SHIPPING = 175

export function CartDrawer() {
  const { lines, subtotal, isOpen, close, setQuantity, remove } = useCart()
  const [stripeEnabled, setStripeEnabled] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && stripeEnabled === null) getStripeEnabled().then(setStripeEnabled)
  }, [isOpen, stripeEnabled])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close])

  if (!isOpen) return null

  const remaining = Math.max(FREE_SHIPPING - subtotal, 0)

  const checkout = async () => {
    setLoading(true)
    setError(null)
    try {
      const url = await createCheckoutSession({
        data: lines.map(({ productId, selections, quantity }) => ({
          productId,
          selections,
          quantity,
        })),
      })
      if (url) window.location.href = url
    } catch {
      setError('We could not start checkout. Please try again in a moment.')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Your bag">
      <button
        aria-label="Close bag"
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px] fade-in"
        onClick={close}
      />
      <aside className="drawer-in absolute right-0 top-0 h-full w-full sm:w-[440px] bg-paper flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 h-20 border-b border-ink/10">
          <h2 className="font-display text-3xl">
            Your bag <span className="font-mono text-sm align-middle text-ink-soft">({lines.length})</span>
          </h2>
          <button onClick={close} aria-label="Close bag" className="p-2 -mr-2 hover:rotate-90 transition-transform">
            <X size={22} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-10 gap-5">
            <div className="size-24 rounded-full bg-blush/50 flex items-center justify-center">
              <ShoppingBag size={32} className="text-bloom" />
            </div>
            <p className="font-display text-3xl">Nothing blooming here yet.</p>
            <p className="text-ink-soft text-sm">
              Our arrangements never wilt, so there is no rush, but there is plenty to love.
            </p>
            <Link
              to="/shop"
              onClick={close}
              className="mt-2 rounded-full bg-ink text-bone px-7 py-3 text-sm hover:bg-bloom transition-colors"
            >
              Browse the collection
            </Link>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-ink/10">
              <p className="text-xs font-mono uppercase tracking-[0.15em] text-ink-soft">
                {remaining > 0
                  ? `${formatPrice(remaining)} away from free shipping`
                  : 'You have unlocked free shipping'}
              </p>
              <div className="mt-2 h-1 rounded-full bg-sand overflow-hidden">
                <div
                  className="h-full bg-bloom origin-left transition-transform duration-500"
                  style={{ transform: `scaleX(${Math.min(subtotal / FREE_SHIPPING, 1)})` }}
                />
              </div>
            </div>

            <ul className="flex-1 overflow-y-auto divide-y divide-ink/10 px-6">
              {lines.map((line) => (
                <li key={line.key} className="py-5 flex gap-4">
                  <Link
                    to="/products/$slug"
                    params={{ slug: line.product.slug }}
                    onClick={close}
                    className="shrink-0 w-24 aspect-[4/5] overflow-hidden rounded-lg bg-sand"
                  >
                    <img
                      src={cdn(line.product.images[0], 192, 240)}
                      alt={line.product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex justify-between gap-3">
                      <p className="font-display text-lg leading-tight">{line.product.name}</p>
                      <p className="font-mono text-sm tabular-nums">
                        {formatPrice(line.unitPrice * line.quantity)}
                      </p>
                    </div>
                    <p className="text-xs text-ink-soft mt-1">
                      {Object.values(line.selections).join(' · ')}
                    </p>
                    <div className="mt-auto pt-3 flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-ink/20">
                        <button
                          aria-label="Decrease quantity"
                          className="p-2 hover:text-bloom"
                          onClick={() => setQuantity(line.key, line.quantity - 1)}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center font-mono text-sm tabular-nums">
                          {line.quantity}
                        </span>
                        <button
                          aria-label="Increase quantity"
                          className="p-2 hover:text-bloom"
                          onClick={() => setQuantity(line.key, line.quantity + 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => remove(line.key)}
                        className="text-xs underline underline-offset-4 text-ink-soft hover:text-bloom"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-ink/10 p-6 space-y-4 bg-bone">
              <div className="flex justify-between items-baseline">
                <span className="text-sm">Subtotal</span>
                <span className="font-display text-3xl tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-ink-soft">Taxes and shipping calculated at checkout.</p>
              {error && <p className="text-sm text-bloom-deep">{error}</p>}
              <button
                onClick={checkout}
                disabled={loading || stripeEnabled !== true}
                className="w-full rounded-full bg-bloom text-paper py-4 text-sm tracking-wide hover:bg-bloom-deep transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? 'Opening secure checkout…'
                  : stripeEnabled === false
                    ? 'Checkout opening soon'
                    : 'Checkout'}
              </button>
              {stripeEnabled === false && (
                <p className="text-xs text-center text-ink-soft">
                  Online payments are being set up. Call the studio at (818) 856-0033 to order.
                </p>
              )}
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
