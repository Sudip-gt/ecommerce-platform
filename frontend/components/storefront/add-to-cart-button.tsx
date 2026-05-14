"use client"

import { useState } from "react"

import { useCart } from "@/components/storefront/cart-provider"

type Props = {
  variantId: string
  priceLabel?: string
}

export function AddToCartButton({ variantId, priceLabel }: Props) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const [isPending, setIsPending] = useState(false)

  const label = isPending
    ? "Adding…"
    : added
      ? "Added to cart"
      : priceLabel
        ? `Add to Cart — ${priceLabel}`
        : "Add to Cart"

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={async () => {
        setIsPending(true)
        try {
          await addItem(variantId, 1)
          setAdded(true)
          window.setTimeout(() => setAdded(false), 1500)
        } finally {
          setIsPending(false)
        }
      }}
      className="w-full bg-primary-container text-on-primary-container text-button py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:active:scale-100"
    >
      <span
        className="material-symbols-outlined"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        shopping_cart
      </span>
      {label}
    </button>
  )
}
