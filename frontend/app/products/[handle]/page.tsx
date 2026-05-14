import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { AddToCartButton } from "@/components/storefront/add-to-cart-button"
import { formatMoney, getProductByHandle } from "@/lib/medusa"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const product = await getProductByHandle(handle)

  if (!product) {
    notFound()
  }

  const selectedVariant = product.variants[0]
  const galleryImages = product.images.slice(0, 3)
  const heroImage = galleryImages[0] || product.thumbnail
  const secondaryImages = galleryImages.slice(1)
  const price = formatMoney(
    selectedVariant?.price ?? product.price,
    selectedVariant?.currencyCode ?? product.currencyCode,
  )

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-space-xl">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 mb-space-lg text-label-md text-on-surface-variant">
        <Link className="hover:text-primary" href="/">
          Home
        </Link>
        <span className="material-symbols-outlined text-[14px]">
          chevron_right
        </span>
        <Link className="hover:text-primary" href="/">
          Collections
        </Link>
        <span className="material-symbols-outlined text-[14px]">
          chevron_right
        </span>
        <span className="text-on-surface truncate">{product.title}</span>
      </nav>

      {/* Asymmetric PDP Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-space-xl items-start">
        {/* Gallery (Bento Style) */}
        <div className="md:col-span-7 grid grid-cols-2 gap-4">
          <div className="col-span-2 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest">
            <div className="relative w-full aspect-[4/5]">
              {heroImage ? (
                <Image
                  src={heroImage}
                  alt={product.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  priority
                />
              ) : null}
            </div>
          </div>
          {secondaryImages.map((image) => (
            <div
              key={image}
              className="col-span-1 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest"
            >
              <div className="relative w-full aspect-square">
                <Image
                  src={image}
                  alt={product.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Product Controls (Floating Card Style) */}
        <div className="md:col-span-5 md:sticky md:top-24">
          <div className="bg-surface-container-lowest p-space-xl rounded-xl border border-outline-variant shadow-sm">
            <div className="mb-space-md">
              <span className="text-label-md text-primary uppercase">
                Premium Collection
              </span>
              <h1 className="text-display-lg-mobile md:text-heading-lg text-on-surface mt-2">
                {product.title}
              </h1>
              <div className="flex items-center gap-2 mt-4">
                <div className="flex text-primary">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                  <span className="material-symbols-outlined text-[18px]">
                    star_half
                  </span>
                </div>
                <span className="text-body-sm text-on-surface-variant">
                  (128 reviews)
                </span>
              </div>
            </div>

            <div className="mb-space-lg flex items-baseline gap-3">
              <span className="text-heading-lg text-on-surface">{price}</span>
              <span className="bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded-full text-label-md">
                IN STOCK
              </span>
            </div>

            <div className="space-y-space-lg">
              {/* Variant Selector (Sizes) */}
              {product.variants.length > 0 ? (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-label-md text-on-surface-variant">
                      Size
                    </label>
                    <button
                      type="button"
                      className="text-primary text-label-md underline"
                    >
                      Size Guide
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {product.variants.map((variant, index) => {
                      const isActive = index === 0
                      return (
                        <button
                          key={variant.id}
                          type="button"
                          className={
                            isActive
                              ? "py-2 border-2 border-primary bg-primary-container text-on-primary-container rounded-lg text-button"
                              : "py-2 border border-outline-variant rounded-lg text-button hover:border-primary transition-colors"
                          }
                        >
                          {variant.title}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : null}

              {/* Add to Cart */}
              {selectedVariant ? (
                <div className="pt-space-md space-y-3">
                  <AddToCartButton
                    variantId={selectedVariant.id}
                    priceLabel={price}
                  />
                  <button
                    type="button"
                    className="w-full bg-surface-container-lowest border border-outline text-on-surface text-button py-4 rounded-xl hover:bg-surface-container transition-colors"
                  >
                    Buy with Express Pay
                  </button>
                </div>
              ) : null}

              <div className="grid grid-cols-2 gap-4 pt-space-md border-t border-surface-container-highest">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">
                    local_shipping
                  </span>
                  <span className="text-body-sm text-on-surface-variant">
                    Free shipping
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">
                    replay
                  </span>
                  <span className="text-body-sm text-on-surface-variant">
                    30-day returns
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Description Section */}
      <section className="mt-space-xxl grid grid-cols-1 md:grid-cols-12 gap-space-xl">
        <div className="md:col-span-7 space-y-space-xl">
          <div className="border-b border-surface-container-highest pb-space-lg">
            <h2 className="text-heading-lg text-on-surface mb-4">
              Product Details
            </h2>
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              {product.description ||
                "This seeded Medusa product is available through the storefront. Replace this description with your own product copy."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
            <div className="space-y-3">
              <h3 className="text-heading-sm">Features</h3>
              <ul className="space-y-2 text-body-sm text-on-surface-variant">
                <li className="flex gap-2">
                  <span className="text-primary">•</span> Premium materials
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span> Modern silhouette
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span> Versatile pairing
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span> Durable construction
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-heading-sm">Care Instructions</h3>
              <ul className="space-y-2 text-body-sm text-on-surface-variant">
                <li className="flex gap-2">
                  <span className="text-primary">•</span> Wash cold, line dry
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span> Cool iron if needed
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span> Avoid bleach
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span> Store flat
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
