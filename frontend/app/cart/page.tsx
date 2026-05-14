import { CartView } from "@/components/storefront/cart-view"

export default function CartPage() {
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-space-xl">
      <div className="mb-space-lg flex items-center gap-2 text-label-md text-on-surface-variant">
        <span>Home</span>
        <span className="material-symbols-outlined text-[14px]">
          chevron_right
        </span>
        <span className="text-on-surface">Your Cart</span>
      </div>
      <h1 className="text-display-lg-mobile md:text-heading-lg text-on-surface mb-space-lg">
        Your Cart
      </h1>
      <CartView />
    </div>
  )
}
