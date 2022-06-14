import React from 'react'
import moment from 'moment'
import { Box, Typography } from '@mui/material'

import { MediaItemT, OnChangeValueT, TranslationFunctionType } from './MediaManagerTypes'

type MediaSelectedItemPropsT = {
  onChangeValue: OnChangeValueT
  selectedItem: MediaItemT
  selectedItemForm: React.ReactElement
  t: TranslationFunctionType
}

const paragraphSx = { flexGrow: 1, pt: 1 }
const MediaSelectedItem = ({ onChangeValue, selectedItem, t, selectedItemForm }: MediaSelectedItemPropsT) => {
  return (
    <>
      <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
        {t('rightBar.selectedItem.title')}
      </Typography>
      <Typography component="p" sx={paragraphSx}>
        <Typography variant="caption">{t('rightBar.selectedItem.type')}:</Typography> {selectedItem.type}
      </Typography>
      <Typography component="p" sx={paragraphSx}>
        <Typography variant="caption">{t('rightBar.selectedItem.uploaded')}:</Typography>{' '}
        {moment(selectedItem.createdAt).format('YYYY-MM-DD HH:mm:ss')}
      </Typography>
      <Typography component="p" sx={paragraphSx}>
        <Typography variant="caption">{t('rightBar.selectedItem.updated')}:</Typography>{' '}
        {moment(selectedItem.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
      </Typography>
      <Box sx={{ p: 2 }}>
        {React.cloneElement(selectedItemForm, {
          data: selectedItem,
          t: t,
          onChange: onChangeValue,
        })}
      </Box>
    </>
  )
}

export default MediaSelectedItem
