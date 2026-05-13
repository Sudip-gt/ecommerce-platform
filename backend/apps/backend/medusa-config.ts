import { defineConfig, loadEnv } from '@medusajs/framework/utils'
import path from 'path'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const hasCloudinary = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
)

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
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
