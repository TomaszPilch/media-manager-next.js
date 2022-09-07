import formidable, { Files } from 'formidable'
import { v4 } from 'uuid'
import fs from 'fs'
import { Storage } from '@google-cloud/storage'
import sizeOf from 'image-size'
import { ISizeCalculationResult } from 'image-size/dist/types/interface'

import type { NextApiRequest } from 'next'

const production = process.env.APP_ENV === 'production'
const storageBucketUrl = process.env.STORAGE_BUCKET_URL
const devFolder = process.env.PUBLIC_IMAGE_UPLOAD_FOLDER_DEV || 'dev/media'
const prodFolder = process.env.PUBLIC_IMAGE_UPLOAD_FOLDER_PROD || 'media'
const bucketStorage = process.env.PUBLIC_BUCKET_STORAGE || ''
const uploadFolder = production ? prodFolder : devFolder

export type MediaUploadOptions = {
  onMediaUpload: (mimetype: null | string, url: string, dimensions: ISizeCalculationResult) => Promise<Object>
  onMediaDelete: (id: number | string) => Promise<Object>
}

export const deleteFileFromBucket = (id: number | string, url: string, { onMediaDelete }: MediaUploadOptions) =>
  new Promise((resolve, reject) => {
    const bucket = new Storage().bucket(bucketStorage)
    return bucket
      .file(url.replace(`${storageBucketUrl}/`, ''))
      .delete()
      .then(() => onMediaDelete(id).then(resolve).catch(reject))
      .catch(reject)
  })

const uploadFileToBucket = (files: Files, { onMediaUpload }: MediaUploadOptions) =>
  new Promise((resolve, reject) => {
    try {
      if (!Array.isArray(files.file)) {
        const {
          file: { newFilename, filepath, mimetype },
        } = files
        let dimensions: ISizeCalculationResult = { width: 0, height: 0 }
        if (mimetype && mimetype.includes('image/')) {
          dimensions = sizeOf(filepath)
        }
        const bucket = new Storage().bucket(bucketStorage)
        const fileName = `${uploadFolder}/${newFilename}`
        const file = bucket.file(fileName)
        const data = fs.readFileSync(filepath)
        return file.save(
          data,
          {
            metadata: { contentType: mimetype },
            public: true,
            gzip: true,
          },
          async (err) => {
            await fs.unlinkSync(filepath)
            if (err) {
              return reject(err)
            } else {
              return onMediaUpload(mimetype, `${storageBucketUrl}/${fileName}`, dimensions).then(resolve).catch(reject)
            }
          },
        )
      } else {
        reject('INVALID_ARRAY')
      }
    } catch (e) {
      reject(e)
    }
  })

const post = (req: NextApiRequest, options: MediaUploadOptions) =>
  new Promise((resolve, reject) => {
    const form = formidable({
      filename: (_name, _ext, part) => `${v4().replace(/^[a-zA-Z0-9-]+-/, '')}-${part.originalFilename}`,
    })
    return form.parse(req, (err, _fields, files) => {
      if (err) {
        return reject(err)
      }
      return uploadFileToBucket({ file: files.filepond }, options).then(resolve).catch(reject)
    })
  })

export default post
