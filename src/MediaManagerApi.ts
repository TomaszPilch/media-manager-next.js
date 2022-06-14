import { pathOr } from 'ramda'
import { NextApiRequest, NextApiResponse } from 'next'

import mediaUpload, { deleteFileFromBucket, MediaUploadOptions } from './connectors/googleCloudStorage'

import { MediaItemT } from './components/MediaManagerTypes'

export type MediaApiClientOptions = MediaUploadOptions & {
  getAllMediaItems: (language: string) => Promise<MediaItemT[]>
  updateMediaItem: (id: number, data: object, language: string) => Promise<{ [key: string]: any }>
}

const MediaApiClient = (options: MediaApiClientOptions) => (req: NextApiRequest, res: NextApiResponse) =>
  new Promise<void>((resolve, reject) => {
    const language = pathOr('cs', ['query', 'language'], req)
    if (!req.url) {
      reject()
      return
    }
    if (req.method === 'POST' && req.url.startsWith('/api/media/upload')) {
      return mediaUpload(req, options)
        .then((mediaItem) => {
          resolve()
          res.status(200).json(mediaItem)
        })
        .catch((e) => {
          reject(e)
          res.status(400).json(e)
        })
    } else if (req.method === 'GET' && req.url.startsWith('/api/media/all')) {
      return options
        .getAllMediaItems(language)
        .then((mediaItems) => {
          resolve()
          res.status(200).json(mediaItems)
        })
        .catch((e) => {
          reject(e)
          res.status(400).json(e)
        })
    } else if (req.method === 'POST' && req.url.startsWith('/api/media/edit') && req.body) {
      return options
        .updateMediaItem(req.body.id, req.body, language)
        .then((mediaItem) => {
          resolve()
          res.status(200).json(mediaItem)
        })
        .catch((e) => {
          reject(e)
          res.status(400).json(e)
        })
    } else if (req.method === 'POST' && req.url.startsWith('/api/media/delete') && req.body) {
      return deleteFileFromBucket(req.body.id, req.body.url, options)
        .then(() => {
          resolve()
          res.status(200).json({})
        })
        .catch((e) => {
          reject(e)
          res.status(400).json(e)
        })
    }
    reject()
    return res.status(404).json('')
  })

export default MediaApiClient
