import { defineConfig, loadEnv } from '@medusajs/framework/utils'
import path from 'path'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

function withDevOrigins(value: string | undefined, origins: string[]) {
  const existing = new Set(
    (value || '')
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean)
  )

  for (const origin of origins) {
    existing.add(origin)
  }

  return Array.from(existing).join(',')
}

const hasCloudinary = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
)

const storefrontOrigins = ['http://localhost:3000']

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: withDevOrigins(process.env.STORE_CORS, storefrontOrigins),
      adminCors: withDevOrigins(process.env.ADMIN_CORS, [
        'http://localhost:3000',
        'http://localhost:9000',
      ]),
      authCors: withDevOrigins(process.env.AUTH_CORS, [
        'http://localhost:3000',
        'http://localhost:9000',
      ]),
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  modules: [
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: hasCloudinary
          ? [
            {
              resolve: path.resolve(__dirname, "src/modules/cloudinary"),
              id: "cloudinary",
              options: {
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
                upload_folder: process.env.CLOUDINARY_UPLOAD_FOLDER || "medusa",
              },
            },
          ]
          : [
            {
              resolve: "@medusajs/medusa/file-local",
              id: "local",
              options: {
                upload_dir: "static",
                backend_url: `${process.env.BACKEND_URL || "http://localhost:9000"}/static`,
              },
            },
          ],
      },
    },
  ],
})
