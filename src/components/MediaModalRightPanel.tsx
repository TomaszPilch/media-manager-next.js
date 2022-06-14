import React from 'react'
import { Box } from '@mui/material'

import MediaUploadAction from './MediaUploadAction'
import MediaSelectedItem from './MediaSelectedItem'
import MediaSelectedItemActions from './MediaSelectedItemActions'
import { MediaManagerActionT, MediaItemT, OnChangeValueT, TranslationFunctionType } from './MediaManagerTypes'

type MediaModalRightPanelPropsT = {
  drawerWidth: number
  onChangeValue: OnChangeValueT
  onSubmitAction: (action: MediaManagerActionT) => void
  selectedItem: null | MediaItemT
  selectedItemChanged: boolean
  selectedItemForm: React.ReactElement
  t: TranslationFunctionType
  updateList: () => void
}

const MediaModalRightPanel = ({
  drawerWidth,
  onChangeValue,
  onSubmitAction,
  selectedItem,
  selectedItemChanged,
  selectedItemForm,
  t,
  updateList,
}: MediaModalRightPanelPropsT) => {
  return (
    <Box
      component="nav"
      sx={{
        width: { sm: drawerWidth },
        flexShrink: { sm: 0 },
        paddingRight: 1,
        paddingBottom: 2,
      }}
      aria-label="mailbox folders"
    >
      <MediaUploadAction updateList={updateList} t={t} />
      {selectedItem && (
        <>
          <hr />
          <MediaSelectedItem
            onChangeValue={onChangeValue}
            selectedItem={selectedItem}
            selectedItemForm={selectedItemForm}
            t={t}
          />
          <hr />
          <MediaSelectedItemActions selectedItemChanged={selectedItemChanged} onSubmitAction={onSubmitAction} t={t} />
        </>
      )}
    </Box>
  )
}

export default MediaModalRightPanel
