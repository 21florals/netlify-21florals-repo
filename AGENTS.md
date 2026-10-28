# AGENTS.md

E-commerce storefront for **21 Florals**, a premium silk floral boutique in Los Angeles. Built with TanStack Start and deployed on Netlify.

## Stack

TanStack Start (React 19, TanStack Router file routes, server functions) · Tailwind CSS 4 (`@theme` tokens in `src/styles.css`) · Stripe Checkout · Netlify Image CDN · zod · lucide-react.

## Directory map

```
src/
  data/products.ts        # Catalog: products, categories, palettes, variant options, price helpers, cdn() image URL helper
  lib/cart.tsx            # CartProvider/useCart: React context + localStorage ('21florals.cart.v1'), drawer open state
  lib/stripe.ts           # Server fns: getStripeEnabled, createCheckoutSession (multi-line, server-side pricing)
  components/Header.tsx   # Announcement bar, sticky header, Logo, mobile menu
  components/Brand.tsx    # Seal (rotating badge), Marquee, Footer
  components/CartDrawer.tsx
  components/ProductCard.tsx  # Grid card with hover image swap + quick add (default variant)
  routes/__root.tsx       # Shell: fonts, meta, CartProvider, Header/Footer/CartDrawer, 404
  routes/index.tsx        # Homepage
  routes/shop.tsx         # Searchable/filterable grid; filters are URL search params validated with zod
  routes/products/$slug.tsx   # Product detail: Gallery, variants, quantity, add-to-bag, related
  routes/checkout/{success,cancel}.tsx  # success clears the cart
public/img/               # Generated product photography (JPEG), always served through cdn()
```

## Conventions & decisions

- **Prices are whole dollars** in the catalog; `priceFor(product, selections)` = base + option `priceDelta`. Stripe amounts are computed server-side from the catalog, never trusted from the client.
- **Variants** are generic `options[{ name, values[{ label, priceDelta }] }]`. The default selection is the value with `priceDelta === 0`. Cart lines are keyed by product id + sorted selections.
- **Images** always go through `cdn(src, w, h?)` (Netlify Image CDN, webp). The gallery's "Petal detail" view is a CSS zoom of the studio shot, not a separate file.
- **Design tokens**: colors `bone, paper, sand, ink, ink-soft, bloom, bloom-deep, apricot, blush, olive`; fonts `font-display` (Gloock), `font-sans` (Bricolage Grotesque), `font-mono` (DM Mono). Reuse these rather than adding raw hex values. Utility classes `.rise`, `.fade-in`, `.drawer-in`, `.animate-marquee`, `.text-outline`, `.grain` are defined in `styles.css`.
- Brand copy uses LA neighborhoods for collection names. Avoid emojis in UI.
- Checkout requires `STRIPE_SECRET_KEY`; without it the drawer shows a graceful "opening soon" state.
- `src/routeTree.gen.ts` is generated; don't edit it.

## Possible next steps

Order history/accounts, inventory or catalog management in Netlify Database, product reviews, gift notes and delivery-date selection for LA courier orders.
