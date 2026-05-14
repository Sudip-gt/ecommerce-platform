const MEDUSA_BACKEND_URL =
    process.env.MEDUSA_BACKEND_URL ||
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
    "http://localhost:9000"

const MEDUSA_PUBLISHABLE_API_KEY =
    process.env.MEDUSA_PUBLISHABLE_API_KEY ||
    process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_API_KEY ||
    ""

const MEDUSA_REGION_ID =
    process.env.MEDUSA_REGION_ID ||
    process.env.NEXT_PUBLIC_MEDUSA_REGION_ID ||
    ""

export type ProductSummary = {
    id: string
    title: string
    handle: string
    description: string | null
    thumbnail: string | null
    price: number | null
    currencyCode: string
}

export type ProductDetail = ProductSummary & {
    variants: Array<{
        id: string
        title: string
        price: number | null
        currencyCode: string
    }>
    images: string[]
}

export type StoreCartItem = {
    id: string
    thumbnail: string | null
    variant_id: string
    product_id: string
    product_title: string
    product_handle: string
    variant_title: string | null
    quantity: number
    unit_price: number | null
}

export type StoreCart = {
    id: string
    currency_code: string
    total: number
    subtotal: number
    item_total: number
    shipping_total: number
    tax_total: number
    region_id: string
    items: StoreCartItem[]
}

type StoreProduct = {
    id: string
    title: string
    handle: string
    description?: string | null
    thumbnail?: string | null
    images?: Array<{ url?: string | null }>
    variants?: Array<{
        id: string
        title: string
        calculated_price?: {
            calculated_amount?: number | null
            currency_code?: string | null
        }
    }>
}

type StoreProductsResponse = {
    products?: StoreProduct[]
}

type StoreCartResponse = {
    cart: StoreCart
}

function getStoreHeaders(): HeadersInit {
    return MEDUSA_PUBLISHABLE_API_KEY
        ? {
            "x-publishable-api-key": MEDUSA_PUBLISHABLE_API_KEY,
        }
        : {}
}

function getStoreJsonHeaders(): HeadersInit {
    return {
        ...getStoreHeaders(),
        "content-type": "application/json",
    }
}

function mapProduct(product: StoreProduct): ProductSummary {
    const firstVariant = product.variants?.[0]

    return {
        id: product.id,
        title: product.title,
        handle: product.handle,
        description: product.description ?? null,
        thumbnail: product.thumbnail ?? product.images?.[0]?.url ?? null,
        price: firstVariant?.calculated_price?.calculated_amount ?? null,
        currencyCode: firstVariant?.calculated_price?.currency_code?.toUpperCase() || "NPR",
    }
}

function mapProductDetail(product: StoreProduct): ProductDetail {
    const summary = mapProduct(product)

    return {
        ...summary,
        images:
            product.images?.map((image) => image.url).filter((url): url is string => Boolean(url)) || [],
        variants:
            product.variants?.map((variant) => ({
                id: variant.id,
                title: variant.title,
                price: variant.calculated_price?.calculated_amount ?? null,
                currencyCode: variant.calculated_price?.currency_code?.toUpperCase() || summary.currencyCode,
            })) || [],
    }
}

export async function listProducts(): Promise<ProductSummary[]> {
    try {
        const query = new URLSearchParams({
            fields: "*variants.calculated_price,+variants.inventory_quantity",
            limit: "12",
        })

        if (MEDUSA_REGION_ID) {
            query.set("region_id", MEDUSA_REGION_ID)
        }

        const response = await fetch(
            `${MEDUSA_BACKEND_URL}/store/products?${query.toString()}`,
            {
                headers: getStoreHeaders(),
                next: { revalidate: 30 },
            }
        )

        if (!response.ok) {
            return []
        }

        const data = (await response.json()) as StoreProductsResponse
        return (data.products || []).map(mapProduct)
    } catch {
        return []
    }
}

export async function getProductByHandle(handle: string): Promise<ProductDetail | null> {
    try {
        const query = new URLSearchParams({
            handle,
            fields: "*variants.calculated_price,+images",
        })

        if (MEDUSA_REGION_ID) {
            query.set("region_id", MEDUSA_REGION_ID)
        }

        const response = await fetch(
            `${MEDUSA_BACKEND_URL}/store/products?${query.toString()}`,
            {
                cache: "no-store",
                headers: getStoreHeaders(),
            }
        )

        if (!response.ok) {
            return null
        }

        const data = (await response.json()) as StoreProductsResponse
        const product = data.products?.[0]

        return product ? mapProductDetail(product) : null
    } catch {
        return null
    }
}

export function formatMoney(amount: number | null, currencyCode: string): string {
    if (amount == null) {
        return "Coming soon"
    }

    return new Intl.NumberFormat("en-NP", {
        style: "currency",
        currency: currencyCode,
        maximumFractionDigits: 0,
    }).format(amount)
}

export function getMedusaBackendUrl(): string {
    return MEDUSA_BACKEND_URL
}

export function getMedusaRegionId(): string {
    return MEDUSA_REGION_ID
}

export async function createCart(): Promise<StoreCart> {
    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/carts`, {
        method: "POST",
        headers: getStoreJsonHeaders(),
        body: JSON.stringify({ region_id: MEDUSA_REGION_ID }),
    })

    if (!response.ok) {
        throw new Error("Failed to create cart")
    }

    const data = (await response.json()) as StoreCartResponse
    return data.cart
}

export async function getCart(cartId: string): Promise<StoreCart> {
    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}`, {
        headers: getStoreHeaders(),
        cache: "no-store",
    })

    if (!response.ok) {
        throw new Error("Failed to fetch cart")
    }

    const data = (await response.json()) as StoreCartResponse
    return data.cart
}

export async function addCartLineItem(cartId: string, variantId: string, quantity = 1): Promise<StoreCart> {
    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}/line-items`, {
        method: "POST",
        headers: getStoreJsonHeaders(),
        body: JSON.stringify({ variant_id: variantId, quantity }),
    })

    if (!response.ok) {
        throw new Error("Failed to add cart item")
    }

    const data = (await response.json()) as StoreCartResponse
    return data.cart
}

export async function removeCartLineItem(cartId: string, lineItemId: string): Promise<StoreCart> {
    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}/line-items/${lineItemId}`, {
        method: "DELETE",
        headers: getStoreHeaders(),
    })

    if (!response.ok) {
        throw new Error("Failed to remove cart item")
    }

    const data = (await response.json()) as { parent: StoreCart }
    return data.parent
}