# 21 Florals

The online boutique for **21 Florals**, a premium silk floral atelier in the Los Angeles Arts District. Shoppers can browse a searchable, filterable catalog of real-touch silk arrangements, stems, trees, garlands and bridal pieces, open detailed product pages with image galleries and variant pricing, build a bag and check out through Stripe.

## Features

- **Homepage**: editorial hero, collection mosaic, bestsellers, atelier story and testimonial.
- **Shop (`/shop`)**: live search, category chips, palette and price filters, and sorting. All filters live in the URL so results can be shared or bookmarked. Mobile gets a bottom-sheet filter panel.
- **Product pages (`/products/:slug`)**: swipeable gallery (studio, at-home and petal-detail views) with hover zoom, variant pickers that update the price live, quantity stepper, add-to-bag, details accordion and related products. Mobile adds a sticky add-to-bag bar.
- **Bag**: slide-out drawer with quantity controls, a free-shipping progress bar, and persistence in the browser.
- **Checkout**: Stripe Checkout with every line item. Prices are always recalculated on the server from the catalog.

## Tech

- [TanStack Start](https://tanstack.com/start) (React 19, file-based routing, server functions)
- Tailwind CSS 4
- Stripe Checkout
- Netlify (hosting, functions, Image CDN)
- Product photography generated with Gemini via Netlify AI Gateway, served through the Netlify Image CDN

## Running locally

```bash
pnpm install
netlify dev        # or: pnpm dev
```

### Environment variables

| Name | Purpose |
| --- | --- |
| `STRIPE_SECRET_KEY` | Turns on checkout. Without it the bag works, but the checkout button reads "Checkout opening soon". |

## Editing the catalog

All products, their variants and prices live in `src/data/products.ts`. Images are in `public/img/`.
