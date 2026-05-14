import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { AddToCartButton } from "@/components/storefront/add-to-cart-button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
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

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1fr_0.9fr] lg:px-10 lg:py-16">
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-muted">
          {product.thumbnail ? (
            <Image src={product.thumbnail} alt={product.title} fill className="object-cover" />
          ) : null}
        </div>
        {product.images.length > 1 ? (
          <div className="grid grid-cols-3 gap-4">
            {product.images.slice(0, 3).map((image) => (
              <div key={image} className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-muted">
                <Image src={image} alt={product.title} fill className="object-cover" />
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="space-y-6">
        <Link href="/" className="text-sm text-muted-foreground">
          Back to catalog
        </Link>
        <Badge variant="secondary" className="rounded-full px-4 py-1.5 uppercase tracking-[0.24em]">
          Product detail
        </Badge>
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">{product.title}</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            {product.description || "This seeded Medusa product is now available through the storefront."}
          </p>
        </div>

        <Card className="rounded-[2rem]">
          <CardContent className="space-y-5 p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Price</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight">
                  {formatMoney(selectedVariant?.price ?? product.price, selectedVariant?.currencyCode ?? product.currencyCode)}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">First real storefront slice</p>
            </div>

            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Variants</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <Badge key={variant.id} variant="outline" className="rounded-full px-4 py-2 text-sm">
                    {variant.title}
                  </Badge>
                ))}
              </div>
            </div>

            {selectedVariant ? (
              <AddToCartButton
                productId={product.id}
                handle={product.handle}
                title={product.title}
                variantId={selectedVariant.id}
                variantTitle={selectedVariant.title}
                thumbnail={product.thumbnail}
                price={selectedVariant.price}
                currencyCode={selectedVariant.currencyCode}
              />
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}