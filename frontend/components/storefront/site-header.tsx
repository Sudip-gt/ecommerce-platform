"use client"

import Link from "next/link"

import { useCart } from "@/components/storefront/cart-provider"

export function SiteHeader() {
  const { itemCount } = useCart()

  return (
    <header className="bg-surface-container-lowest sticky top-0 z-50 border-b border-surface-container-highest">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto h-16">
        <Link
          href="/"
          className="text-heading-lg font-bold text-primary"
        >
          BoldEra Prints
        </Link>
        <nav className="hidden md:flex items-center gap-space-lg">
          <Link
            href="/"
            className="text-body-md text-primary border-b-2 border-primary pb-1"
          >
            Collections
          </Link>
          <a
            href="#"
            className="text-body-md text-on-surface-variant hover:text-primary transition-colors duration-200"
          >
            New Arrivals
          </a>
          <a
            href="#"
            className="text-body-md text-on-surface-variant hover:text-primary transition-colors duration-200"
          >
            Best Sellers
          </a>
          <a
            href="#"
            className="text-body-md text-on-surface-variant hover:text-primary transition-colors duration-200"
          >
            Sale
          </a>
        </nav>
        <div className="flex items-center gap-space-md">
          <button
            type="button"
            className="p-2 hover:bg-surface-container-low transition-colors duration-200 rounded-full"
            aria-label="Account"
          >
            <span className="material-symbols-outlined text-primary">
              person
            </span>
          </button>
          <Link
            href="/cart"
            className="p-2 hover:bg-surface-container-low transition-colors duration-200 rounded-full relative"
            aria-label="Cart"
          >
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              shopping_bag
            </span>
            {itemCount > 0 ? (
              <span className="absolute top-1 right-1 bg-primary text-on-primary text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            className="md:hidden p-2 hover:bg-surface-container-low transition-colors duration-200 rounded-full"
            aria-label="Menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </header>
  )
}