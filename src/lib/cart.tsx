import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import products, { priceFor } from '@/data/products'
import type { Product } from '@/data/products'

export interface CartLine {
  key: string
  productId: number
  selections: Record<string, string>
  quantity: number
}

interface CartContextValue {
  lines: Array<CartLine & { product: Product; unitPrice: number }>
  count: number
  subtotal: number
  isOpen: boolean
  open: () => void
  close: () => void
  add: (productId: number, selections: Record<string, string>, quantity?: number) => void
  setQuantity: (key: string, quantity: number) => void
  remove: (key: string) => void
  clear: () => void
}

const STORAGE_KEY = '21florals.cart.v1'
const CartContext = createContext<CartContextValue | null>(null)

const lineKey = (productId: number, selections: Record<string, string>) =>
  `${productId}:${Object.entries(selections)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('|')}`

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [raw, setRaw] = useState<Array<CartLine>>([])
  const [hydrated, setHydrated] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setRaw(JSON.parse(saved))
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(raw))
  }, [raw, hydrated])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  }, [isOpen])

  const add = useCallback(
    (productId: number, selections: Record<string, string>, quantity = 1) => {
      const key = lineKey(productId, selections)
      setRaw((prev) => {
        const existing = prev.find((l) => l.key === key)
        if (existing) {
          return prev.map((l) =>
            l.key === key ? { ...l, quantity: Math.min(l.quantity + quantity, 20) } : l,
          )
        }
        return [...prev, { key, productId, selections, quantity }]
      })
      setIsOpen(true)
    },
    [],
  )

  const setQuantity = useCallback((key: string, quantity: number) => {
    setRaw((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.key !== key)
        : prev.map((l) => (l.key === key ? { ...l, quantity: Math.min(quantity, 20) } : l)),
    )
  }, [])

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const remove = useCallback(
    (key: string) => setRaw((prev) => prev.filter((l) => l.key !== key)),
    [],
  )
  const clear = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setRaw([])
  }, [])

  const value = useMemo<CartContextValue>(() => {
    const lines = raw.flatMap((line) => {
      const product = products.find((p) => p.id === line.productId)
      return product
        ? [{ ...line, product, unitPrice: priceFor(product, line.selections) }]
        : []
    })
    return {
      lines,
      count: lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: lines.reduce((n, l) => n + l.unitPrice * l.quantity, 0),
      isOpen,
      open,
      close,
      add,
      setQuantity,
      remove,
      clear,
    }
  }, [raw, isOpen, add, setQuantity, open, close, remove, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
