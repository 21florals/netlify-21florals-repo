export type Category =
  | 'Arrangements'
  | 'Stems & Bunches'
  | 'Potted & Trees'
  | 'Garlands'
  | 'Bridal'

export type Palette = 'Blush' | 'Sunset' | 'Ivory' | 'Magenta' | 'Verdant'

export interface OptionValue {
  label: string
  /** Price added to the base price, in dollars */
  priceDelta: number
  hint?: string
}

export interface ProductOption {
  name: string
  values: Array<OptionValue>
}

export interface Product {
  id: number
  slug: string
  name: string
  /** Neighborhood-inspired collection line */
  collection: string
  category: Category
  palette: Palette
  /** Image paths in /public, first is the hero */
  images: Array<string>
  shortDescription: string
  description: string
  details: Array<string>
  /** Base price in dollars */
  price: number
  compareAt?: number
  options: Array<ProductOption>
  badge?: string
  rating: number
  reviews: number
  leadTime: string
}

export const categories: Array<Category> = [
  'Arrangements',
  'Stems & Bunches',
  'Potted & Trees',
  'Garlands',
  'Bridal',
]

export const palettes: Array<{ name: Palette; swatch: string }> = [
  { name: 'Blush', swatch: '#efc3c0' },
  { name: 'Sunset', swatch: '#ee9663' },
  { name: 'Ivory', swatch: '#f4ecd9' },
  { name: 'Magenta', swatch: '#b8336a' },
  { name: 'Verdant', swatch: '#6f7a45' },
]

const sizes = (petite: number, grand: number): ProductOption => ({
  name: 'Size',
  values: [
    { label: 'Petite', priceDelta: petite, hint: 'Nightstands & shelves' },
    { label: 'Classic', priceDelta: 0, hint: 'Our signature scale' },
    { label: 'Grand', priceDelta: grand, hint: 'Entryways & tablescapes' },
  ],
})

const products: Array<Product> = [
  {
    id: 1,
    slug: 'golden-hour-ranunculus',
    name: 'Golden Hour Ranunculus',
    collection: 'The Los Feliz Line',
    category: 'Arrangements',
    palette: 'Sunset',
    images: ['/img/ranunculus-1.jpg', '/img/ranunculus-2.jpg'],
    shortDescription:
      'A tight dome of apricot and butter ranunculus in a speckled bud vase.',
    description:
      'Inspired by the last ten minutes of light on Hillhurst Avenue. Each of the 23 ranunculus heads is layered by hand from silk petals tinted in three tones of apricot, so the bloom deepens toward its center exactly like the real thing. Set in a speckled stoneware bud vase thrown in Highland Park.',
    details: [
      '23 hand-layered silk ranunculus',
      'Speckled stoneware vase, made in Highland Park',
      'Faux-water acrylic finish',
      'Classic stands 11" tall',
    ],
    price: 148,
    options: [
      sizes(-42, 86),
      {
        name: 'Vessel',
        values: [
          { label: 'Speckled Cream', priceDelta: 0 },
          { label: 'Terracotta', priceDelta: 0 },
          { label: 'Hand-blown Amber', priceDelta: 24 },
        ],
      },
    ],
    badge: 'Bestseller',
    rating: 4.9,
    reviews: 312,
    leadTime: 'Ships in 2–3 days',
  },
  {
    id: 2,
    slug: 'silver-lake-peony-cloud',
    name: 'Silver Lake Peony Cloud',
    collection: 'The Reservoir Line',
    category: 'Arrangements',
    palette: 'Blush',
    images: ['/img/peony-1.jpg', '/img/peony-2.jpg'],
    shortDescription:
      'Overflowing blush and ivory peonies in a footed stone bowl.',
    description:
      'Our most-requested centerpiece. Fourteen full-bloom peonies and a scattering of half-open buds, arranged low and wide so conversation still flows across the table. The petals are cut from a matte silk-cotton blend that catches light softly instead of shining.',
    details: [
      '14 full-bloom peonies, 6 buds',
      'Footed cast-stone bowl',
      'Low profile for dining tables',
      'Classic spans 20" wide',
    ],
    price: 264,
    compareAt: 298,
    options: [
      sizes(-78, 142),
      {
        name: 'Palette',
        values: [
          { label: 'Blush & Ivory', priceDelta: 0 },
          { label: 'All Ivory', priceDelta: 0 },
          { label: 'Coral Charm', priceDelta: 0 },
        ],
      },
    ],
    badge: 'Spring Edit',
    rating: 4.8,
    reviews: 207,
    leadTime: 'Ships in 3–5 days',
  },
  {
    id: 3,
    slug: 'bougainvillea-arch-garland',
    name: 'Bougainvillea Arch Garland',
    collection: 'The Echo Park Line',
    category: 'Garlands',
    palette: 'Magenta',
    images: ['/img/bougainvillea-1.jpg', '/img/bougainvillea-2.jpg'],
    shortDescription:
      'Six feet of papery magenta bracts with a bendable wire spine.',
    description:
      'The flower that defines every LA stucco wall, now for your doorway, mantel or wedding arch. A bendable wire spine lets you shape it in seconds, and the bracts are cut from paper-thin silk so they rustle in a breeze. UV-treated for covered patios.',
    details: [
      'Bendable wire spine',
      'UV-treated for covered outdoor use',
      'Joinable end loops for longer runs',
      'Approx. 380 bracts per 6 ft',
    ],
    price: 96,
    options: [
      {
        name: 'Length',
        values: [
          { label: '6 ft', priceDelta: 0 },
          { label: '9 ft', priceDelta: 44 },
          { label: '12 ft', priceDelta: 82 },
        ],
      },
      {
        name: 'Color',
        values: [
          { label: 'Magenta', priceDelta: 0 },
          { label: 'Coral', priceDelta: 0 },
          { label: 'White', priceDelta: 0 },
        ],
      },
    ],
    badge: 'LA Original',
    rating: 4.9,
    reviews: 158,
    leadTime: 'Ships in 1–2 days',
  },
  {
    id: 4,
    slug: 'mulholland-orchid',
    name: 'Mulholland Orchid',
    collection: 'The Canyon Line',
    category: 'Potted & Trees',
    palette: 'Ivory',
    images: ['/img/orchid-1.jpg', '/img/orchid-2.jpg'],
    shortDescription:
      'A double-stem white phalaenopsis in a matte charcoal cylinder.',
    description:
      'Real-touch petals with a faint, waxy give, and veining printed from a photograph of a living orchid. Planted in preserved moss inside a matte charcoal cylinder, it looks as composed on a vanity as it does in a hotel lobby.',
    details: [
      'Real-touch latex-silk petals',
      'Preserved moss topper',
      'Matte charcoal ceramic pot',
      'Classic stands 26" tall',
    ],
    price: 186,
    options: [
      {
        name: 'Stems',
        values: [
          { label: 'Single', priceDelta: -48 },
          { label: 'Double', priceDelta: 0 },
          { label: 'Triple', priceDelta: 64 },
        ],
      },
      {
        name: 'Pot',
        values: [
          { label: 'Charcoal', priceDelta: 0 },
          { label: 'Bone', priceDelta: 0 },
          { label: 'Travertine', priceDelta: 38 },
        ],
      },
    ],
    rating: 4.7,
    reviews: 96,
    leadTime: 'Ships in 2–3 days',
  },
  {
    id: 5,
    slug: 'echo-park-wildflower-bunch',
    name: 'Echo Park Wildflower Bunch',
    collection: 'The Echo Park Line',
    category: 'Stems & Bunches',
    palette: 'Sunset',
    images: ['/img/wildflower-1.jpg', '/img/wildflower-2.jpg'],
    shortDescription:
      'California poppies, cosmos and chamomile, hand-tied in kraft.',
    description:
      'A just-picked bunch that never needs water. We mix orange California poppies, pink cosmos, chamomile and feathery grasses, then hand-tie the bunch in kraft paper and twine. Unwrap it into any vase you love; the stems are wired so you can bend them.',
    details: [
      '31 mixed wildflower stems',
      'Wired stems you can bend',
      'Wrapped in kraft paper and twine',
      'Vase not included',
    ],
    price: 78,
    options: [
      {
        name: 'Bunch',
        values: [
          { label: 'Handful', priceDelta: -22 },
          { label: 'Armful', priceDelta: 0 },
          { label: 'Meadow', priceDelta: 54 },
        ],
      },
    ],
    badge: 'New',
    rating: 4.8,
    reviews: 74,
    leadTime: 'Ships in 1–2 days',
  },
  {
    id: 6,
    slug: 'venice-bird-of-paradise',
    name: 'Venice Bird of Paradise',
    collection: 'The Boardwalk Line',
    category: 'Stems & Bunches',
    palette: 'Sunset',
    images: ['/img/bird-1.jpg', '/img/bird-2.jpg'],
    shortDescription:
      'Three architectural strelitzia stems in a slim glass column.',
    description:
      'The official flower of Los Angeles, rendered at true scale. Each bloom is painted by hand in our downtown atelier, then paired with broad leaves on flexible stems. Three stems in a slim glass column read as pure sculpture.',
    details: [
      'Hand-painted orange and indigo blooms',
      '42" stems with real-touch leaves',
      'Slim glass column vase',
      'Sold as a trio',
    ],
    price: 134,
    options: [
      {
        name: 'Stems',
        values: [
          { label: 'Trio', priceDelta: 0 },
          { label: 'Quintet', priceDelta: 72 },
        ],
      },
      {
        name: 'Vase',
        values: [
          { label: 'Clear Glass', priceDelta: 0 },
          { label: 'Stems Only', priceDelta: -28 },
        ],
      },
    ],
    rating: 4.6,
    reviews: 61,
    leadTime: 'Ships in 2–3 days',
  },
  {
    id: 7,
    slug: 'laurel-canyon-olive-tree',
    name: 'Laurel Canyon Olive Tree',
    collection: 'The Canyon Line',
    category: 'Potted & Trees',
    palette: 'Verdant',
    images: ['/img/olive-1.jpg', '/img/olive-2.jpg'],
    shortDescription:
      'A five-foot faux olive with silvery leaves in a terracotta planter.',
    description:
      'Built on a real wood trunk with 1,140 silvery-green leaves and clusters of tiny olives. It brings the soft, dusty green of the canyon indoors without ever needing light, water or a gardener. Arrives fully assembled.',
    details: [
      'Natural wood trunk',
      '1,140 dual-tone leaves',
      'Textured terracotta planter',
      'Arrives fully assembled',
    ],
    price: 348,
    options: [
      {
        name: 'Height',
        values: [
          { label: '4 ft', priceDelta: -96 },
          { label: '5 ft', priceDelta: 0 },
          { label: '7 ft', priceDelta: 214 },
        ],
      },
      {
        name: 'Planter',
        values: [
          { label: 'Terracotta', priceDelta: 0 },
          { label: 'Limewash White', priceDelta: 0 },
          { label: 'Grower Pot Only', priceDelta: -62 },
        ],
      },
    ],
    badge: 'Bestseller',
    rating: 4.9,
    reviews: 421,
    leadTime: 'Ships in 4–6 days',
  },
  {
    id: 8,
    slug: 'marmont-bridal-cascade',
    name: 'The Marmont Bridal Cascade',
    collection: 'The Sunset Strip Line',
    category: 'Bridal',
    palette: 'Ivory',
    images: ['/img/bridal-1.jpg', '/img/bridal-2.jpg'],
    shortDescription:
      'Ivory garden roses, sweet peas and trailing eucalyptus.',
    description:
      'A bouquet to carry down the aisle and keep on your shelf for the next fifty years. Garden roses, sweet peas and pale ranunculus trail into silver-dollar eucalyptus, finished with a hand-wrapped silk ribbon handle. Every cascade is built to order by one designer.',
    details: [
      'Built to order by a single designer',
      'Hand-wrapped silk ribbon handle',
      'Keepsake box included',
      'Cascade length approx. 22"',
    ],
    price: 386,
    options: [
      {
        name: 'Style',
        values: [
          { label: 'Cascade', priceDelta: 0 },
          { label: 'Round', priceDelta: -54 },
          { label: 'Bridesmaid', priceDelta: -212 },
        ],
      },
      {
        name: 'Ribbon',
        values: [
          { label: 'Ivory Silk', priceDelta: 0 },
          { label: 'Blush Silk', priceDelta: 0 },
          { label: 'Sage Velvet', priceDelta: 18 },
        ],
      },
    ],
    badge: 'Made to Order',
    rating: 5.0,
    reviews: 89,
    leadTime: 'Ships in 10–14 days',
  },
  {
    id: 9,
    slug: 'palm-springs-protea',
    name: 'Palm Springs Protea',
    collection: 'The Desert Line',
    category: 'Arrangements',
    palette: 'Blush',
    images: ['/img/protea-1.jpg', '/img/protea-2.jpg'],
    shortDescription:
      'King protea and golden fan palm in a round terracotta vessel.',
    description:
      'A desert-modern statement for coffee tables and credenzas. A king protea anchors sun-bleached fan palm, pampas plumes and burgundy leucadendron, all cut from durable silk and preserved-look textiles that never shed.',
    details: [
      'King protea centerpiece',
      'Non-shedding faux pampas',
      'Round terracotta vessel',
      'Classic stands 24" tall',
    ],
    price: 228,
    options: [
      sizes(-64, 118),
    ],
    rating: 4.8,
    reviews: 133,
    leadTime: 'Ships in 3–5 days',
  },
  {
    id: 10,
    slug: 'sunset-blvd-tulips',
    name: 'Sunset Blvd Tulips',
    collection: 'The Sunset Strip Line',
    category: 'Stems & Bunches',
    palette: 'Blush',
    images: ['/img/tulip-1.jpg', '/img/tulip-2.jpg'],
    shortDescription:
      'Coral, tangerine and pink tulips, gently bending in ribbed glass.',
    description:
      'Real-touch tulips with the gentle droop of day three, which is the most beautiful day of a tulip. Twenty stems in coral, tangerine and soft pink rest in a ribbed glass vase with a clear faux-water fill.',
    details: [
      '20 real-touch tulip stems',
      'Ribbed glass vase',
      'Clear faux-water acrylic',
      'Classic stands 15" tall',
    ],
    price: 118,
    options: [
      {
        name: 'Stems',
        values: [
          { label: '10 stems', priceDelta: -38 },
          { label: '20 stems', priceDelta: 0 },
          { label: '40 stems', priceDelta: 96 },
        ],
      },
      {
        name: 'Palette',
        values: [
          { label: 'Sunset Mix', priceDelta: 0 },
          { label: 'All Coral', priceDelta: 0 },
          { label: 'Blush', priceDelta: 0 },
        ],
      },
    ],
    rating: 4.7,
    reviews: 118,
    leadTime: 'Ships in 1–2 days',
  },
]

export default products

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug)
}

export function defaultSelections(product: Product): Record<string, string> {
  return Object.fromEntries(
    product.options.map((o) => [
      o.name,
      (o.values.find((v) => v.priceDelta === 0) ?? o.values[0]).label,
    ]),
  )
}

/** Unit price in dollars for a product with the given option selections */
export function priceFor(product: Product, selections: Record<string, string>) {
  return product.options.reduce((total, option) => {
    const value = option.values.find((v) => v.label === selections[option.name])
    return total + (value?.priceDelta ?? 0)
  }, product.price)
}

export const formatPrice = (dollars: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(dollars)

/** Netlify Image CDN URL */
export const cdn = (src: string, w: number, h?: number) =>
  `/.netlify/images?url=${encodeURIComponent(src)}&w=${w}${h ? `&h=${h}&fit=cover` : ''}&fm=webp&q=80`
