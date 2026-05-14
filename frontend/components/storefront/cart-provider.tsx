"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

import {
    addCartLineItem,
    createCart,
    getCart,
    removeCartLineItem,
    type StoreCart,
    type StoreCartItem,
} from "@/lib/medusa"

export type CartItem = StoreCartItem

type CartContextValue = {
  cart: StoreCart | null
  items: CartItem[]
  itemCount: number
  subtotal: number
  total: number
  shippingTotal: number
  taxTotal: number
  isLoading: boolean
  addItem: (variantId: string, quantity?: number) => Promise<void>
  removeItem: (lineItemId: string) => Promise<void>
  setItemQuantity: (lineItemId: string, variantId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = "esite-cart-id"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<StoreCart | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function bootstrapCart() {
      setIsLoading(true)

      try {
        const storedCartId = window.localStorage.getItem(STORAGE_KEY)

        if (storedCartId) {
          try {
            const existingCart = await getCart(storedCartId)
            if (!cancelled) {
              setCart(existingCart)
              setIsLoading(false)
            }
            return
          } catch {
            window.localStorage.removeItem(STORAGE_KEY)
          }
        }

        const newCart = await createCart()
        window.localStorage.setItem(STORAGE_KEY, newCart.id)

        if (!cancelled) {
          setCart(newCart)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    bootstrapCart()

    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      items: cart?.items || [],
      itemCount: (cart?.items || []).reduce((sum, item) => sum + item.quantity, 0),
      subtotal: cart?.subtotal || 0,
      total: cart?.total || 0,
      shippingTotal: cart?.shipping_total || 0,
      taxTotal: cart?.tax_total || 0,
      isLoading,
      addItem: async (variantId, quantity = 1) => {
        let activeCart = cart

        if (!activeCart) {
          activeCart = await createCart()
          window.localStorage.setItem(STORAGE_KEY, activeCart.id)
        }

        const updatedCart = await addCartLineItem(activeCart.id, variantId, quantity)
        setCart(updatedCart)
      },
      removeItem: async (lineItemId) => {
        if (!cart) {
          return
        }

        const updatedCart = await removeCartLineItem(cart.id, lineItemId)
        setCart(updatedCart)
      },
      setItemQuantity: async (lineItemId, variantId, quantity) => {
        if (!cart) {
          return
        }

        if (quantity <= 0) {
          const updatedCart = await removeCartLineItem(cart.id, lineItemId)
          setCart(updatedCart)
          return
        }

        const cartWithoutItem = await removeCartLineItem(cart.id, lineItemId)
        const updatedCart = await addCartLineItem(cartWithoutItem.id, variantId, quantity)
        setCart(updatedCart)
      },
      clearCart: async () => {
        if (!cart?.items.length) {
          return
        }

        let nextCart = cart

        for (const item of cart.items) {
          nextCart = await removeCartLineItem(nextCart.id, item.id)
        }

        setCart(nextCart)
      },
    }),
    [cart, isLoading]
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