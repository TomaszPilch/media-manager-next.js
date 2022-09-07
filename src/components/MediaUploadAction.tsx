import React, { memo } from 'react'
import { FileInput, useUppy } from '@uppy/react'
import Uppy from '@uppy/core'
import XHRUpload from '@uppy/xhr-upload'

import { TranslationFunctionType } from './MediaManagerTypes'

type MediaUploadActionPropsT = {
  updateList: () => void
  t: TranslationFunctionType
}

const MediaUploadAction = ({ updateList, t }: MediaUploadActionPropsT) => {
  const uppy = useUppy(() =>
    new Uppy({
      id: 'uppy',
      restrictions: {
        maxNumberOfFiles: 1,
        minNumberOfFiles: 1,
        maxFileSize: 10000000,
      },
      autoProceed: true,
    })
      .use(XHRUpload, {
        endpoint: '/api/media/upload',
        timeout: 60 * 1000,
      })
      .on('complete', () => {
        updateList()
      }),
  )

  return (
    <div className="text-end pt-3">
      <FileInput uppy={uppy} locale={{ strings: { chooseFiles: t('rightBar.chooseFiles') } }} />
    </div>
  )
}

export default memo(MediaUploadAction)
