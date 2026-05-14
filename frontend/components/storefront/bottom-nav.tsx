"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { useCart } from "@/components/storefront/cart-provider"
import { cn } from "@/lib/utils"

type NavItem = {
  href: string
  label: string
  icon: string
  match: (pathname: string) => boolean
}

const items: NavItem[] = [
  { href: "/", label: "Home", icon: "home", match: (p) => p === "/" },
  { href: "/", label: "Shop", icon: "storefront", match: (p) => p.startsWith("/products") },
  { href: "/cart", label: "Cart", icon: "shopping_cart", match: (p) => p.startsWith("/cart") },
  { href: "#", label: "Account", icon: "person", match: () => false },
]

export function BottomNav() {
  const pathname = usePathname()
  const { itemCount } = useCart()

  return (
    <nav className="fixed bottom-0 w-full z-50 md:hidden bg-surface-container-lowest border-t border-surface-container-highest shadow-sm flex justify-around items-center h-16 px-4">
      {items.map((item) => {
        const isActive = item.match(pathname)
        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center transition-transform duration-150",
              isActive
                ? "bg-primary-container text-on-primary-container rounded-full px-4 py-1"
                : "text-on-surface-variant"
            )}
          >
            <span
              className="material-symbols-outlined relative"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
              {item.label === "Cart" && itemCount > 0 ? (
                <span className="absolute -top-1 -right-2 bg-primary text-on-primary text-[10px] min-w-4 h-4 px-1 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              ) : null}
            </span>
            <span className="text-label-md">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
