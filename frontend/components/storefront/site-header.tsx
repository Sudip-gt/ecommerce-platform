"use client"

import { ShoppingBag } from "lucide-react"
import Link from "next/link"

import { useCart } from "@/components/storefront/cart-provider"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const { itemCount } = useCart()

  return (
    <header className="border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-foreground text-background">
            ES
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Nepal Commerce</p>
            <p className="font-semibold tracking-tight">esite</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="hidden md:inline-flex">
            Medusa + Next.js
          </Badge>
          <Link href="/cart" className={cn(buttonVariants({ variant: "outline", className: "rounded-full gap-2" }))}>
            <ShoppingBag className="size-4" />
            Cart
            {itemCount > 0 ? <span className="text-muted-foreground">({itemCount})</span> : null}
          </Link>
        </div>
      </div>
    </header>
  )
}