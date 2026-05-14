"use client"

import { useState } from "react"

import { useCart } from "@/components/storefront/cart-provider"
import { Button } from "@/components/ui/button"

type Props = {
  variantId: string
}

export function AddToCartButton(props: Props) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const [isPending, setIsPending] = useState(false)

  return (
    <Button
      className="w-full rounded-full"
      disabled={isPending}
      onClick={async () => {
        setIsPending(true)

        try {
          await addItem(props.variantId, 1)
          setAdded(true)
          window.setTimeout(() => setAdded(false), 1200)
        } finally {
          setIsPending(false)
        }
      }}
    >
      {isPending ? "Adding..." : added ? "Added" : "Add to cart"}
    </Button>
  )
}