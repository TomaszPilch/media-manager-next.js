import React, { memo } from 'react'
import { FilePond } from 'react-filepond'

import { TranslationFunctionType } from './MediaManagerTypes'

type MediaUploadActionPropsT = {
  updateList: () => void
  t: TranslationFunctionType
}

const MediaUploadAction = ({ updateList, t }: MediaUploadActionPropsT) => {
  return (
    <div className="text-end pt-3">
      <FilePond
        server="/api/media/upload"
        labelIdle={t('rightBar.chooseFiles')}
        onprocessfiles={() => updateList()}
        allowReplace={false}
        allowRevert={false}
        allowProcess={false}
      />
    </div>
  )
}

export default memo(MediaUploadAction)
