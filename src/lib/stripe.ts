import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import products, { priceFor } from '@/data/products'

export const getStripeEnabled = createServerFn({ method: 'GET' }).handler(
  () => !!process.env.STRIPE_SECRET_KEY,
)

const checkoutInput = z.array(
  z.object({
    productId: z.number(),
    selections: z.record(z.string(), z.string()),
    quantity: z.number().int().min(1).max(20),
  }),
).min(1)

export const createCheckoutSession = createServerFn({ method: 'POST' })
  .inputValidator((lines: z.infer<typeof checkoutInput>) => checkoutInput.parse(lines))
  .handler(async ({ data: lines }) => {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Stripe is not configured')
    }
    const { default: Stripe } = await import('stripe')
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const { getRequestUrl } = await import('@tanstack/react-start/server')
    const origin = process.env.URL ?? getRequestUrl().origin

    // Prices are always recomputed on the server from the catalog
    const lineItems = lines.map((line) => {
      const product = products.find((p) => p.id === line.productId)
      if (!product) throw new Error('Product not found')
      const variant = product.options
        .map((o) => line.selections[o.name])
        .filter(Boolean)
        .join(' · ')
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: variant || product.shortDescription,
            images: [`${origin}${product.images[0]}`],
          },
          unit_amount: Math.round(priceFor(product, line.selections) * 100),
        },
        quantity: line.quantity,
      }
    })

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'hosted',
      line_items: lineItems,
      mode: 'payment',
      billing_address_collection: 'auto',
      phone_number_collection: { enabled: true },
      automatic_tax: { enabled: true },
      allow_promotion_codes: true,
      submit_type: 'auto',
      shipping_address_collection: { allowed_countries: ['US'] },
      consent_collection: { terms_of_service: 'required' },
      locale: 'en',
      saved_payment_method_options: { payment_method_save: 'enabled' },
      origin_context: 'web',
      // Not yet in the stripe-node 20.x types; passed through to the API as-is
      ...({ integration_identifier: 'hosted_web_0001' } as Record<string, string>),
      success_url: `${origin}/checkout/success`,
      cancel_url: `${origin}/checkout/cancel`,
    })

    return session.url
  })
