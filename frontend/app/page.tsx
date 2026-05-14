import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatMoney, getMedusaBackendUrl, listProducts } from "@/lib/medusa";

export default async function Home() {
  const products = await listProducts();
  const backendUrl = getMedusaBackendUrl();

  return (
    <div className="min-h-full bg-[radial-gradient(circle_at_top,rgba(24,24,27,0.09),transparent_36%),linear-gradient(180deg,#fcfcfd_0%,#f4f4f5_100%)]">
      <section className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-20">
        <div className="space-y-8">
          <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.28em]">
            Built with Medusa + Next.js
          </Badge>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
              Modern Nepal-first commerce, ready for real catalog work.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              The stack is wired. The catalog below is pulling seeded Medusa products, the currency is NPR-first,
              and the cart is ready for the next checkout step.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="#catalog" className={cn(buttonVariants({ className: "rounded-full px-6" }))}>
              Browse catalog
            </a>
            <a
              href={`${backendUrl}/app`}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", className: "rounded-full px-6" }))}
            >
              Open Medusa Admin
            </a>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-[0_30px_100px_rgba(24,24,27,0.08)] backdrop-blur">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-zinc-950 p-5 text-zinc-50">
              <p className="text-sm uppercase tracking-[0.28em] text-zinc-400">Default region</p>
              <p className="mt-8 text-3xl font-semibold tracking-tight">Nepal</p>
              <p className="mt-2 text-zinc-400">NPR default, USD secondary</p>
            </div>
            <div className="rounded-[1.5rem] border border-border bg-card p-5">
              <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Media</p>
              <p className="mt-8 text-3xl font-semibold tracking-tight">Cloudinary</p>
              <p className="mt-2 text-muted-foreground">Configured with local fallback</p>
            </div>
            <div className="rounded-[1.5rem] border border-border bg-card p-5 sm:col-span-2">
              <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Next slice</p>
              <p className="mt-4 text-xl font-semibold tracking-tight">Catalog, PDP, and cart are live.</p>
              <p className="mt-2 text-muted-foreground">
                The next engineering step is to replace the local cart with Medusa carts and finish checkout.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="catalog" className="mx-auto w-full max-w-7xl px-6 pb-16 lg:px-10 lg:pb-24">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Catalog</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Seeded products from Medusa</h2>
          </div>
        </div>

        {products.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.handle}`} className="group block">
                <Card className="h-full overflow-hidden rounded-[2rem] border-border/70 bg-card/90 transition-transform duration-200 group-hover:-translate-y-1">
                  <div className="relative aspect-[4/4.5] overflow-hidden bg-muted">
                    {product.thumbnail ? (
                      <Image
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    ) : null}
                  </div>
                  <CardContent className="space-y-3 p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-semibold tracking-tight">{product.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{product.handle}</p>
                      </div>
                      <p className="font-semibold">{formatMoney(product.price, product.currencyCode)}</p>
                    </div>
                    <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {product.description || "Medusa seed data is connected. Replace this with your real catalog next."}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="rounded-[2rem] border-dashed bg-card/80">
            <CardContent className="p-10">
              <p className="text-lg font-medium">No products are coming back from Medusa yet.</p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Start the backend with <code>pnpm run dev:backend</code> or <code>pnpm run dev</code>, then refresh.
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
