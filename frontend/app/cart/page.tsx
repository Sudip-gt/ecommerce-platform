import { CartView } from "@/components/storefront/cart-view"

export default function CartPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-10 lg:py-16">
      <div className="mb-8 space-y-2">
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Cart</p>
        <h1 className="text-4xl font-semibold tracking-tight">Live Medusa cart session</h1>
      </div>
      <CartView />
    </div>
  )
}