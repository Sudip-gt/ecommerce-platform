# Cloudflare setup

The intended split is:
- **Vercel** serves the Next.js storefront on `https://esite.example.com`
- **Render** serves the Medusa backend on `https://api.esite.example.com`
- **Cloudinary** serves all media on its own CDN

Cloudflare sits in front of `esite.example.com` and `api.esite.example.com`.

## DNS

| Type | Name | Content                              | Proxy |
| ---- | ---- | ------------------------------------ | ----- |
| CNAME | `@`  | `cname.vercel-dns.com`              | DNS only (Vercel manages cert) |
| CNAME | `api` | `<your-service>.onrender.com`      | Proxied (orange cloud) |
| CNAME | `www` | `cname.vercel-dns.com`             | DNS only |

> Vercel requires DNS-only because it issues its own certificate. If you proxy through Cloudflare, use **Full (strict)** SSL and upload Cloudflare Origin Cert to Vercel — usually not worth the complexity.

## SSL/TLS

- Mode: **Full (strict)** for `api.*`
- Always Use HTTPS: **on**
- HSTS: enable after you've verified everything works (max-age 6 months)
- Minimum TLS: **1.2**

## Caching

Add a Page Rule or Cache Rule:

| Pattern                           | Action                |
| --------------------------------- | --------------------- |
| `api.esite.example.com/*`         | Cache Level: Bypass   |
| `esite.example.com/_next/static/*`| Cache Everything, Edge TTL 1 month |
| `esite.example.com/*`             | Standard caching      |

Medusa endpoints set their own cache headers; do not let Cloudflare cache them.

## CORS / Origins

Update Medusa env (`backend/apps/backend/.env` or Render env):

```
STORE_CORS=https://esite.example.com
ADMIN_CORS=https://api.esite.example.com
AUTH_CORS=https://esite.example.com,https://api.esite.example.com
```

## Self-hosted alternative

If you ever move off Vercel/Render onto a single VPS, use [infra/nginx/nginx.conf](../infra/nginx/nginx.conf) as the reverse-proxy template. Cloudflare's real-IP ranges are baked in.
