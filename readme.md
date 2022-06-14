# Next.js Media Manager
Simple media manager to use it for uploading and managing resources (images, files, etc.). It uses MUI material design theme.

## Install

```
yarn add media-manager-next
```

## Demo

## Usage

1. Add these environment variables

| name                              | description                                                        |
|-----------------------------------|--------------------------------------------------------------------|
| `APP_ENV`                         | `production` or string                                             |
| `STORAGE_BUCKET_URL`              | URL of google cloud storage bucket                                 |
| `PUBLIC_IMAGE_UPLOAD_FOLDER_DEV`  | folder for dev testing                                             |
| `PUBLIC_IMAGE_UPLOAD_FOLDER_PROD` | production folder                                                  |
| `GOOGLE_APPLICATION_CREDENTIALS`  | https://cloud.google.com/docs/authentication/getting-started?hl=en |

2. Create Next.js api endpoints (examples with prisma, you can use another ORM)

file `pages/api/media/[...media].ts`
```
import { path, pick } from 'ramda'

import MediaApiClient from 'media-manager-next/lib/MediaManagerApi'

import prisma from '../../../src/graphql/database'

export const config = {
  api: {
    bodyParser: true,
  },
}

const processMediaItem = (mediaItem) => ({
  ...mediaItem,
  ...(Array.isArray(mediaItem.texts) && mediaItem.texts.length
    ? pick(['title', 'description'], mediaItem.texts[0])
    : {}),
})

export const mediaItemInstance = MediaApiClient({
  onMediaUpload: (mimetype, url, dimensions) =>
    prisma.mediaItem.create({
      data: {
        type: mimetype,
        url,
        width: dimensions.width,
        height: dimensions.height,
      },
    }),
  getAllMediaItems: (language) =>
    new Promise((resolve, reject) => {
      return prisma.mediaItem
        .findMany({
          orderBy: { ['id']: 'desc' },
          include: { texts: { where: { language } } },
        })
        .then((data) => {
          resolve(data.map(processMediaItem))
        })
        .catch(reject)
    }),
  updateMediaItem: (id, data, language) =>
    prisma.mediaItem.update({
      where: { id },
      data: {
        data: path(['data'], data),
        texts: {
          upsert: {
            where: { mediaItemId_language: { language, mediaItemId: id } },
            create: {
              title: path(['title'], data),
              description: path(['description'], data),
              language,
            },
            update: {
              title: path(['title'], data),
              description: path(['description'], data),
            },
          },
        },
      },
      include: {
        texts: { where: { language } },
      },
    }),
  onMediaDelete: (id: number) => prisma.mediaItem.delete({ where: { id } }),
})

export default async function mediaClient(req, res) {
  await mediaItemInstance(req, res)
  return true
}
```

file `pages/api/media/upload.ts`
```
import { mediaItemInstance } from './[...media]'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function mediaClient(req, res) {
  await mediaItemInstance(req, res)
  return true
}
```

3. Add translations to your i18n lib

```
{
  "navBar": {
    "title": "Uložiště souborů",
    "searchPlaceholder": "hledat"
  },
  "rightBar": {
    "chooseFiles": "nahrát",
    "selectedItem": {
      "title": "Vybraný soubor",
      "type": "typ",
      "uploaded": "nahráno",
      "updated": "upraveno"
    },
    "form": {
      "title": "titulek",
      "description": "popis"
    },
    "actions": {
      "select": "vybrat",
      "delete": "smazat",
      "save": "uložit",
      "cancel": "zrušit úpravy"
    }
  }
}
```

4. Use media manager

```
{open && (
    <MediaManager
      locale={router.locale}
      onClose={() => setOpen(false)}
      onSelect={handleOnSelect}
      selectedDefaultId={value ? parseInt(value) : undefined}
      selectedItemForm={<MediaItemForm />}
      t={mediaTranslation.t}
    />
)}
```

5. `<MediaItemForm />` component

   - create your custom form for editing media properties
   - MediaManager pass `data`, `t` and `onChange` props to your form
