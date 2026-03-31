import { ImageRule, ImageValue, Rule } from 'sanity'
import { getExtension, getImageDimensions } from '@sanity/asset-utils'

export function imageValidation(rule: ImageRule): ImageRule {
  return rule
    .required()
    .error('Image is required')
    .custom<ImageValue>(async (image, { getClient }) => {
      if (!image || !image.asset) return true // Skip if no image

      const { width, height } = getImageDimensions(image.asset)
      const extension = getExtension(image.asset)

      // Validate image dimensions
      if (width < 400 || height < 300) {
        return {
          message: 'Image must be at least 400x300 pixels, current size is ' + width + 'x' + height,
        }
      }

      // Validate image format
      if (!['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
        return { message: 'Image must be in JPG, JPEG, PNG, or GIF format' }
      }

      // Validate file size
      // If the field has a value
      if (image?.asset?._ref) {
        // Query the asset's metadata document
        const client = getClient({ apiVersion: `2025-01-01` })
        // Filesize is returned in bytes
        const size = await client.fetch(`*[_id == $id][0].size`, {
          id: image.asset._ref,
        })
        // Cannot be more than 20MB
        // (adjust this number as required)
        if (size > 2 * 1024 * 1024) {
          return { message: 'File size must be less than 2MB' }
        }
      }

      return true // Valid image
    })
    .warning(
      'Sanity cannot validate image size at this stage. Please ensure images meet the requirements.',
    )
}
