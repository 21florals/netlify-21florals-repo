# Stripe Integration TODO

The storefront already had a hosted Stripe Checkout integration, so only the parameters of the existing `stripe.checkout.sessions.create(...)` call were updated to match the Checkout Studio configuration. No new files, routes or endpoints were added.

## Values to Replace

None of the values in the Checkout Session call are placeholders. The project's existing values were kept:

**Files containing these values:**
- [src/lib/stripe.ts](src/lib/stripe.ts)

| Field | Current Value | Notes |
|-------|--------------|-------|
| mode | `payment` | Correct for one-time purchases of floral arrangements. Switch to `subscription` only if you sell recurring products. In that case you must also add `payment_method_collection: 'always'`. |
| success_url | `${origin}/checkout/success` | Real page that already exists. If you want to look up the session on that page, you can append `?session_id={CHECKOUT_SESSION_ID}`. |
| cancel_url | `${origin}/checkout/cancel` | Real page that already exists. |
| line_items | Built server-side with `price_data` from the catalog (`src/data/products.ts`) | Uses inline prices, so no Stripe Price IDs are needed. |

## Configured Parameters

These parameters were configured in Checkout Studio and are already set correctly.

**Files containing these parameters:**
- [src/lib/stripe.ts](src/lib/stripe.ts)

| Parameter | Value |
|-----------|-------|
| ui_mode | `hosted` (installed `stripe` SDK is 20.4.1; SDK 21.0.0+ uses `hosted_page`) |
| billing_address_collection | `auto` |
| phone_number_collection | `{ enabled: true }` |
| automatic_tax | `{ enabled: true }` |
| allow_promotion_codes | `true` |
| submit_type | `auto` |
| shipping_address_collection | `{ allowed_countries: ['US'] }` |
| consent_collection | `{ terms_of_service: 'required' }` |
| locale | `en` |
| saved_payment_method_options | `{ payment_method_save: 'enabled' }` |
| integration_identifier | `hosted_web_0001` |
| origin_context | `web` |

`payment_method_collection` was left out because it only applies when `mode` is `subscription`. The old `payment_method_types: ['card']` parameter was removed because Checkout Studio does not configure it. Stripe now shows the payment methods you enable in the Dashboard.

**SDK version note:** if you upgrade `stripe` to 21.0.0 or later, change `ui_mode: 'hosted'` to `ui_mode: 'hosted_page'`. `integration_identifier` is not yet in the 20.x TypeScript types, so it is passed through with a typed spread. After upgrading, you can make it a plain property if the new types include it.

## Setup

1. **Environment variables.** Set these in Netlify (Project configuration → Environment variables), not in code:
   - `STRIPE_SECRET_KEY`: server-only, no `VITE_` prefix. Get it from https://dashboard.stripe.com/test/apikeys. Without it, the cart drawer shows an "opening soon" state instead of checkout.
   - No publishable key is needed, because hosted Checkout redirects to a Stripe URL that the server returns.
2. **Stripe Dashboard settings required by the configured parameters:**
   - **Automatic tax:** set your origin address and activate Stripe Tax (https://dashboard.stripe.com/settings/tax). If this isn't done, session creation fails.
   - **Terms of service consent:** add your Terms of Service URL under Settings → Public details (https://dashboard.stripe.com/settings/public). If this isn't done, session creation fails.
   - **Promotion codes:** create coupons and promotion codes under Products → Coupons if you want customers to use them.
   - **Saved payment methods:** Stripe only offers `payment_method_save` when the session is tied to a Customer. The storefront has no customer accounts yet, so if Stripe rejects this option, pass a `customer` (or remove the option) once accounts exist.
3. **Dependencies:** `stripe` is already installed (20.4.1). Nothing else is required.

## How it works

1. The shopper adds products to the cart, which is stored in `localStorage`, and clicks checkout in the cart drawer.
2. The `createCheckoutSession` server function in `src/lib/stripe.ts` validates the cart. It then recomputes every price from the catalog on the server and creates a Checkout Session with the parameters above.
3. The browser is redirected to the Stripe-hosted Checkout page. That page collects the shipping and billing address, phone number, terms consent, promo codes and tax.
4. After payment, Stripe redirects to `/checkout/success`, which clears the cart. If the shopper cancels, Stripe sends them to `/checkout/cancel`.

## Testing

- Use test-mode keys (`sk_test_...`).
- Card `4242 4242 4242 4242` with any future expiry, any CVC and any ZIP code succeeds.
- `4000 0025 0000 3155` requires 3D Secure authentication. `4000 0000 0000 9995` is declined.
- More test cards: https://docs.stripe.com/testing

## Next steps

- **Fulfillment:** add a webhook for `checkout.session.completed` to record orders and trigger LA courier delivery. Verify `session.consent.terms_of_service === 'accepted'` in that webhook. No webhook exists yet.
- **Order tracking:** store completed sessions and orders in Netlify Database to support order history and accounts.
- **Products:** keep `src/data/products.ts` as the price source, or move the catalog to Stripe Products and Prices if you'd rather manage it in the Dashboard.

## Resources

- https://support.stripe.com
- https://docs.stripe.com/mcp
