import { Link, createFileRoute } from '@tanstack/react-router'
import { useCart } from '@/lib/cart'

export const Route = createFileRoute('/checkout/cancel')({
  component: CheckoutCancel,
})

function CheckoutCancel() {
  const { open } = useCart()

  return (
    <section className="max-w-2xl mx-auto px-5 py-24 md:py-32 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-bloom">Checkout paused</p>
      <h1 className="font-display text-5xl md:text-7xl leading-[0.95] mt-5">
        No rush. <em className="text-bloom">They'll keep.</em>
      </h1>
      <p className="mt-6 text-ink-soft max-w-md mx-auto">
        Your payment was not completed and nothing was charged. Everything is still waiting in your bag.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <button
          onClick={open}
          className="rounded-full bg-bloom text-paper px-8 py-4 text-sm hover:bg-bloom-deep transition-colors"
        >
          Return to bag
        </button>
        <Link
          to="/shop"
          className="rounded-full border border-ink/30 px-8 py-4 text-sm hover:border-ink transition-colors"
        >
          Back to the shop
        </Link>
      </div>
    </section>
  )
}
