"use client"

import { Minus, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { useCart } from "@/components/storefront/cart-provider"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatMoney } from "@/lib/medusa"
import { cn } from "@/lib/utils"

export function CartView() {
  const { items, clearCart, isLoading, removeItem, setItemQuantity, shippingTotal, subtotal, taxTotal, total } = useCart()

  const currencyCode = "NPR"

  if (isLoading) {
    return (
      <div className="rounded-[2rem] border border-border bg-card p-10 text-center text-muted-foreground">
        Loading cart...
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className="rounded-[2rem] border border-dashed border-border bg-card p-10 text-center">
        <p className="text-lg font-medium">Your cart is empty.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Add a product from the catalog to start building the shopping flow.
        </p>
        <Link href="/" className={cn(buttonVariants({ className: "mt-6 rounded-full" }))}>
          Browse products
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden rounded-[2rem]">
            <CardContent className="flex gap-4 p-4 sm:p-6">
              <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-muted">
                {item.thumbnail ? (
                  <Image src={item.thumbnail} alt={item.product_title} fill className="object-cover" />
                ) : null}
              </div>
              <div className="flex flex-1 items-start justify-between gap-4">
                <div>
                  <Link href={`/products/${item.product_handle}`} className="font-semibold tracking-tight">
                    {item.product_title}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">{item.variant_title}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      className="rounded-full"
                      onClick={() => void setItemQuantity(item.id, item.variant_id, item.quantity - 1)}
                    >
                      <Minus className="size-3.5" />
                    </Button>
                    <span className="min-w-8 text-center text-sm">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      className="rounded-full"
                      onClick={() => void setItemQuantity(item.id, item.variant_id, item.quantity + 1)}
                    >
                      <Plus className="size-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatMoney(item.unit_price, currencyCode)}</p>
                  <Button
                    variant="ghost"
                    className="mt-3 rounded-full px-0 text-muted-foreground"
                    onClick={() => void removeItem(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="h-fit rounded-[2rem]">
        <CardContent className="p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Summary</p>
          <div className="mt-6 flex items-center justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatMoney(subtotal, currencyCode)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span>Shipping</span>
            <span>{formatMoney(shippingTotal, currencyCode)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span>Tax</span>
            <span>{formatMoney(taxTotal, currencyCode)}</span>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-border pt-6 text-lg font-semibold">
            <span>Total</span>
            <span>{formatMoney(total, currencyCode)}</span>
          </div>
          <Button className="mt-6 w-full rounded-full">Checkout next</Button>
          <Button variant="outline" className="mt-3 w-full rounded-full" onClick={() => void clearCart()}>
            Clear cart
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}