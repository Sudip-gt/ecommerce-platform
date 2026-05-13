import { AbstractFileProviderService, MedusaError } from "@medusajs/framework/utils"
import {
  ProviderUploadFileDTO,
  ProviderFileResultDTO,
  ProviderDeleteFileDTO,
  ProviderGetFileDTO,
} from "@medusajs/framework/types"
import { v2 as cloudinary, UploadApiResponse } from "cloudinary"

type Options = {
  cloud_name: string
  api_key: string
  api_secret: string
  secure?: boolean
  upload_folder?: string
}

class CloudinaryFileProviderService extends AbstractFileProviderService {
  static identifier = "cloudinary"

  protected readonly options_: Options

  constructor(_: unknown, options: Options) {
    super()

    if (!options?.cloud_name || !options?.api_key || !options?.api_secret) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Cloudinary file provider requires cloud_name, api_key and api_secret"
      )
    }

    this.options_ = { secure: true, ...options }

    cloudinary.config({
      cloud_name: this.options_.cloud_name,
      api_key: this.options_.api_key,
      api_secret: this.options_.api_secret,
      secure: this.options_.secure,
    })
  }

  async upload(file: ProviderUploadFileDTO): Promise<ProviderFileResultDTO> {
    if (!file?.filename) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "No file provided to upload"
      )
    }

    const dataUri = `data:${file.mimeType};base64,${file.content}`

    const result: UploadApiResponse = await cloudinary.uploader.upload(dataUri, {
      folder: this.options_.upload_folder,
      public_id: this.stripExtension(file.filename),
      resource_type: "auto",
      overwrite: true,
      use_filename: true,
      unique_filename: true,
    })

    return {
      url: result.secure_url,
      key: result.public_id,
    }
  }

  async delete(file: ProviderDeleteFileDTO): Promise<void> {
    if (!file?.fileKey) return

    await cloudinary.uploader.destroy(file.fileKey, {
      invalidate: true,
      resource_type: "image",
    })
  }

  async getPresignedDownloadUrl(file: ProviderGetFileDTO): Promise<string> {
    return cloudinary.url(file.fileKey, {
      secure: this.options_.secure,
      sign_url: true,
      type: "authenticated",
    })
  }

  private stripExtension(filename: string): string {
    const dot = filename.lastIndexOf(".")
    return dot === -1 ? filename : filename.slice(0, dot)
  }
}

export default CloudinaryFileProviderService
