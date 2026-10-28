import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Seal } from '@/components/Brand'
import { useCart } from '@/lib/cart'

export const Route = createFileRoute('/checkout/success')({
  component: CheckoutSuccess,
})

function CheckoutSuccess() {
  const { clear } = useCart()
  useEffect(() => clear(), [clear])

  return (
    <section className="max-w-2xl mx-auto px-5 py-24 md:py-32 text-center flex flex-col items-center">
      <Seal className="text-bloom rise" />
      <h1 className="font-display text-5xl md:text-7xl leading-[0.95] mt-8 rise">
        Thank you. <em className="text-bloom">It's blooming.</em>
      </h1>
      <p className="mt-6 text-ink-soft max-w-md rise">
        Your order is confirmed and a designer in our Los Angeles studio is already gathering your stems.
        A receipt and tracking details are on their way to your inbox.
      </p>
      <Link
        to="/shop"
        className="mt-10 rounded-full bg-ink text-bone px-8 py-4 text-sm hover:bg-bloom transition-colors"
      >
        Keep browsing
      </Link>
    </section>
  )
}
