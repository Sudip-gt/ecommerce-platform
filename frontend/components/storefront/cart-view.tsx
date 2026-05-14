"use client"

import Image from "next/image"
import Link from "next/link"

import { useCart } from "@/components/storefront/cart-provider"
import { formatMoney } from "@/lib/medusa"

const FREE_SHIPPING_THRESHOLD = 200

export function CartView() {
  const {
    items,
    clearCart,
    isLoading,
    removeItem,
    setItemQuantity,
    shippingTotal,
    subtotal,
    taxTotal,
    total,
  } = useCart()

  const currencyCode = "NPR"

  if (isLoading) {
    return (
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-space-xl text-center text-on-surface-variant">
        Loading cart…
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest p-space-xl text-center">
        <span
          className="material-symbols-outlined text-primary"
          style={{ fontSize: 48 }}
        >
          shopping_bag
        </span>
        <p className="mt-2 text-heading-sm text-on-surface">
          Your cart is empty.
        </p>
        <p className="mt-1 text-body-sm text-on-surface-variant">
          Add a product from the catalog to start.
        </p>
        <Link
          href="/"
          className="mt-space-md inline-flex items-center justify-center bg-primary text-on-primary text-button px-5 py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          Browse products
        </Link>
      </div>
    )
  }

  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)

  return (
    <div className="grid gap-space-xl lg:grid-cols-[1.5fr_0.85fr]">
      <div className="space-y-space-md">
        {/* Free Shipping Progress */}
        <div className="p-space-md bg-primary-fixed/30 rounded-xl border border-outline-variant">
          <div className="flex justify-between items-center mb-2">
            <p className="text-body-sm text-on-primary-fixed-variant">
              {remaining > 0 ? (
                <>
                  You&apos;re{" "}
                  <span className="font-bold">
                    {formatMoney(remaining, currencyCode)}
                  </span>{" "}
                  away from <strong>Free Shipping!</strong>
                </>
              ) : (
                <>You&apos;ve unlocked Free Shipping!</>
              )}
            </p>
            <span className="material-symbols-outlined text-primary text-sm">
              local_shipping
            </span>
          </div>
          <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Cart Items */}
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-space-md p-space-md bg-surface-container-lowest border border-surface-container-highest rounded-xl"
          >
            <div className="size-24 rounded-lg bg-surface-container-low overflow-hidden flex-shrink-0 border border-surface-container-highest relative">
              {item.thumbnail ? (
                <Image
                  src={item.thumbnail}
                  alt={item.product_title}
                  fill
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="flex-grow flex flex-col">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <Link
                    href={`/products/${item.product_handle}`}
                    className="text-heading-sm text-on-surface hover:text-primary transition-colors"
                  >
                    {item.product_title}
                  </Link>
                  <p className="text-body-sm text-on-surface-variant">
                    {item.variant_title}
                  </p>
                </div>
                <span className="text-heading-sm text-on-surface whitespace-nowrap">
                  {formatMoney((item.unit_price ?? 0) * item.quantity, currencyCode)}
                </span>
              </div>
              <div className="mt-auto flex justify-between items-center pt-space-sm">
                <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() =>
                      void setItemQuantity(
                        item.id,
                        item.variant_id,
                        item.quantity - 1,
                      )
                    }
                    className="px-2 py-1 hover:bg-surface-container-low text-on-surface-variant"
                    aria-label="Decrease quantity"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      remove
                    </span>
                  </button>
                  <span className="px-3 text-label-md text-on-surface">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      void setItemQuantity(
                        item.id,
                        item.variant_id,
                        item.quantity + 1,
                      )
                    }
                    className="px-2 py-1 hover:bg-surface-container-low text-on-surface-variant"
                    aria-label="Increase quantity"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      add
                    </span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => void removeItem(item.id)}
                  className="text-error text-body-sm hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    delete
                  </span>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Cross-sell card */}
        <div className="p-space-md bg-surface-container-low rounded-xl border border-dashed border-outline-variant flex items-center gap-3">
          <div className="bg-surface-container-lowest p-2 rounded-lg border border-surface-container-highest">
            <span className="material-symbols-outlined text-primary">
              redeem
            </span>
          </div>
          <div>
            <p className="text-heading-sm">Add a Gift Wrap?</p>
            <p className="text-body-sm text-on-surface-variant">
              Personalized note included
            </p>
          </div>
          <button
            type="button"
            className="ml-auto bg-primary text-on-primary text-button px-4 py-1.5 rounded-full text-body-sm"
          >
            Add
          </button>
        </div>
      </div>

      {/* Summary card */}
      <aside className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-space-lg h-fit md:sticky md:top-24">
        <h2 className="text-heading-md text-on-surface mb-space-md">
          Order Summary
        </h2>
        <div className="space-y-2 mb-space-md">
          <div className="flex justify-between text-body-md text-on-surface-variant">
            <span>Subtotal</span>
            <span>{formatMoney(subtotal, currencyCode)}</span>
          </div>
          <div className="flex justify-between text-body-md text-on-surface-variant">
            <span>Shipping</span>
            <span>
              {shippingTotal > 0
                ? formatMoney(shippingTotal, currencyCode)
                : "Calculated at checkout"}
            </span>
          </div>
          <div className="flex justify-between text-body-md text-on-surface-variant">
            <span>Tax</span>
            <span>{formatMoney(taxTotal, currencyCode)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-surface-container-highest">
            <span className="text-heading-md text-on-surface">Total</span>
            <span className="text-heading-md text-on-surface">
              {formatMoney(total, currencyCode)}
            </span>
          </div>
        </div>
        <button
          type="button"
          className="w-full bg-primary text-on-primary text-button py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          Checkout
          <span className="material-symbols-outlined text-[20px]">
            arrow_forward
          </span>
        </button>
        <button
          type="button"
          onClick={() => void clearCart()}
          className="mt-2 w-full bg-surface-container-lowest border border-outline text-on-surface text-button py-3 rounded-xl hover:bg-surface-container transition-colors"
        >
          Clear cart
        </button>
        <p className="mt-space-sm text-center text-body-sm text-on-surface-variant">
          Taxes and shipping calculated at checkout
        </p>
      </aside>
    </div>
  )
}
