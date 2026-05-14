"use client"

import { useState } from "react"

import { useCart } from "@/components/storefront/cart-provider"
import { Button } from "@/components/ui/button"

type Props = {
  productId: string
  handle: string
  title: string
  variantId: string
  variantTitle: string
  thumbnail: string | null
  price: number | null
  currencyCode: string
}

export function AddToCartButton(props: Props) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  return (
    <Button
      className="w-full rounded-full"
      onClick={() => {
        addItem({
          productId: props.productId,
          handle: props.handle,
          title: props.title,
          variantId: props.variantId,
          variantTitle: props.variantTitle,
          thumbnail: props.thumbnail,
          price: props.price,
          currencyCode: props.currencyCode,
        })

        setAdded(true)
        window.setTimeout(() => setAdded(false), 1200)
      }}
    >
      {added ? "Added" : "Add to cart"}
    </Button>
  )
}