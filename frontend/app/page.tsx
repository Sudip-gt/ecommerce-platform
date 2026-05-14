import Image from "next/image";
import Link from "next/link";

import { formatMoney, listProducts } from "@/lib/medusa";

export default async function Home() {
  const products = await listProducts();

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-space-xl">
      {/* Collection Header */}
      <div className="mb-space-xl">
        <nav className="flex items-center gap-2 text-label-md text-on-surface-variant">
          <Link className="hover:text-primary" href="/">
            Home
          </Link>
          <span className="material-symbols-outlined text-[14px]">
            chevron_right
          </span>
          <span className="text-on-surface">Collections</span>
        </nav>
        <h1 className="text-display-lg-mobile md:text-display-lg mt-space-sm text-on-surface">
          Premium Essentials
        </h1>
        <p className="text-body-md text-on-surface-variant max-w-2xl mt-space-sm">
          Curated performance gear designed for the modern merchant.
          High-quality materials meet functional design for your everyday
          workflow.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-space-xl">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-space-xl">
          {/* Mobile Toggle for Filters */}
          <button
            type="button"
            className="md:hidden w-full flex items-center justify-between p-space-md bg-surface-container-lowest border border-surface-container-highest rounded-lg"
          >
            <span className="text-heading-sm">Filters</span>
            <span className="material-symbols-outlined">filter_list</span>
          </button>
          <div className="hidden md:block space-y-space-xl">
            {/* Category */}
            <div className="border-b border-surface-container-highest pb-space-md">
              <h3 className="text-heading-sm mb-space-sm">Category</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <span className="size-4 border border-outline rounded inline-flex items-center justify-center group-hover:border-primary transition-colors" />
                  <span className="text-body-md">Apparel</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <span className="size-4 bg-primary border border-primary rounded inline-flex items-center justify-center">
                    <span
                      className="material-symbols-outlined text-[14px] text-on-primary"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check
                    </span>
                  </span>
                  <span className="text-body-md">Accessories</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <span className="size-4 border border-outline rounded inline-flex items-center justify-center group-hover:border-primary transition-colors" />
                  <span className="text-body-md">Footwear</span>
                </label>
              </div>
            </div>
            {/* Price Range */}
            <div className="border-b border-surface-container-highest pb-space-md">
              <h3 className="text-heading-sm mb-space-sm">Price</h3>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-body-sm">
                    $
                  </span>
                  <input
                    className="w-full pl-6 pr-2 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md focus:ring-2 focus:ring-primary-container focus:border-primary outline-none"
                    placeholder="Min"
                    type="text"
                  />
                </div>
                <span className="text-on-surface-variant">—</span>
                <div className="relative flex-1">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-body-sm">
                    $
                  </span>
                  <input
                    className="w-full pl-6 pr-2 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md focus:ring-2 focus:ring-primary-container focus:border-primary outline-none"
                    placeholder="Max"
                    type="text"
                  />
                </div>
              </div>
            </div>
            {/* Availability */}
            <div className="border-b border-surface-container-highest pb-space-md">
              <h3 className="text-heading-sm mb-space-sm">Availability</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    defaultChecked
                    className="w-4 h-4 text-primary focus:ring-primary border-outline"
                    name="availability"
                    type="radio"
                  />
                  <span className="text-body-md">In Stock</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    className="w-4 h-4 text-primary focus:ring-primary border-outline"
                    name="availability"
                    type="radio"
                  />
                  <span className="text-body-md">Out of Stock</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-space-lg">
            <span className="text-body-sm text-on-surface-variant">
              Showing 1–{products.length} of {products.length} products
            </span>
            <div className="flex items-center gap-2">
              <span className="text-body-sm text-on-surface-variant">
                Sort by:
              </span>
              <select className="border-none bg-transparent text-heading-sm focus:ring-0 cursor-pointer">
                <option>Best Selling</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest Arrivals</option>
              </select>
            </div>
          </div>
          {products.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {products.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/products/${product.handle}`}
                  className="group bg-surface-container-lowest border border-surface-container-highest rounded-xl overflow-hidden hover:shadow-sm transition-shadow"
                >
                  <div className="aspect-[4/5] relative overflow-hidden bg-surface-container">
                    {product.thumbnail ? (
                      <Image
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : null}
                    {index === 0 ? (
                      <div className="absolute top-2 left-2">
                        <span className="bg-primary-container text-on-primary-container text-label-md px-2 py-1 rounded-full">
                          New
                        </span>
                      </div>
                    ) : null}
                  </div>
                  <div className="p-space-md space-y-1">
                    <h3 className="text-heading-sm text-on-surface truncate">
                      {product.title}
                    </h3>
                    <p className="text-body-sm text-on-surface-variant capitalize">
                      {product.handle.replace(/-/g, " ")}
                    </p>
                    <p className="text-heading-sm text-primary">
                      {formatMoney(product.price, product.currencyCode)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest p-space-xl text-center">
              <p className="text-heading-sm text-on-surface">
                No products are coming back from Medusa yet.
              </p>
              <p className="mt-2 text-body-sm text-on-surface-variant">
                Start the backend with{" "}
                <code className="text-primary">pnpm run dev</code>, then refresh.
              </p>
            </div>
          )}

          {/* Pagination */}
          {products.length ? (
            <div className="mt-space-xxl flex justify-center items-center gap-space-sm">
              <button
                type="button"
                className="size-10 flex items-center justify-center rounded-lg border border-surface-container-highest text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                type="button"
                className="size-10 flex items-center justify-center rounded-lg bg-primary text-on-primary text-heading-sm"
              >
                1
              </button>
              <button
                type="button"
                className="size-10 flex items-center justify-center rounded-lg border border-surface-container-highest text-on-surface text-heading-sm hover:border-primary transition-colors"
              >
                2
              </button>
              <button
                type="button"
                className="size-10 flex items-center justify-center rounded-lg border border-surface-container-highest text-on-surface text-heading-sm hover:border-primary transition-colors"
              >
                3
              </button>
              <span className="text-on-surface-variant px-2">…</span>
              <button
                type="button"
                className="size-10 flex items-center justify-center rounded-lg border border-surface-container-highest text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
