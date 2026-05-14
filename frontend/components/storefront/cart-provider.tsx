"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

export type CartItem = {
  id: string
  variantId: string
  productId: string
  title: string
  variantTitle: string
  handle: string
  thumbnail: string | null
  price: number | null
  currencyCode: string
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  itemCount: number
  addItem: (item: Omit<CartItem, "quantity" | "id">) => void
  removeItem: (variantId: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = "esite-cart"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return
    }

    try {
      setItems(JSON.parse(stored) as CartItem[])
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      addItem: (item) => {
        setItems((current) => {
          const existing = current.find((entry) => entry.variantId === item.variantId)

          if (existing) {
            return current.map((entry) =>
              entry.variantId === item.variantId
                ? { ...entry, quantity: entry.quantity + 1 }
                : entry
            )
          }

          return [
            ...current,
            {
              ...item,
              id: item.variantId,
              quantity: 1,
            },
          ]
        })
      },
      removeItem: (variantId) => {
        setItems((current) => current.filter((item) => item.variantId !== variantId))
      },
      clearCart: () => setItems([]),
    }),
    [items]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }

  return context
}