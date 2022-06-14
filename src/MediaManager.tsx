import React, { useCallback, useState } from 'react'
import useAxios from 'axios-hooks'
import { Box, Dialog } from '@mui/material'
import { assoc, equals } from 'ramda'

import MediaModalNavBar from './components/MediaModalNavBar'
import MediaModalContent from './components/MediaModalContent'
import MediaModalRightPanel from './components/MediaModalRightPanel'
import { MediaManagerActionT, MediaItemT, TranslationFunctionType } from './components/MediaManagerTypes'

type MediaManagerPropsT = {
  locale: string
  onClose: () => void
  onSelect: (selectedItem: null | MediaItemT) => void
  selectedDefaultId?: number
  selectedItemForm: React.ReactElement
  t: TranslationFunctionType
}

const MediaManager = ({ onSelect, onClose, selectedDefaultId, t, locale, selectedItemForm }: MediaManagerPropsT) => {
  const [{ data, loading, error }, refetchList] = useAxios(`/api/media/all?language=${locale}`)
  const [, editMediaItem] = useAxios(
    {
      url: `/api/media/edit?language=${locale}`,
      method: 'POST',
    },
    { manual: true },
  )
  const [, deleteMediaItem] = useAxios(
    {
      url: '/api/media/delete',
      method: 'POST',
    },
    { manual: true },
  )
  const [initialItemState, setInitialItemState] = useState<null | MediaItemT>(null)
  const [selectedItem, setSelectedItem] = useState<null | MediaItemT>(null)

  const handleSetSelectedItem = useCallback(
    (item: MediaItemT | null) => {
      setInitialItemState(item)
      setSelectedItem(item)
    },
    [setInitialItemState, setSelectedItem],
  )

  const handleOnChangeValue = useCallback(
    (key: string, value?: string | number | Object) => {
      const newSelectedItem = assoc(key, value, selectedItem) as MediaItemT
      setSelectedItem(newSelectedItem)
    },
    [selectedItem, setSelectedItem],
  )
  const handleSubmitAction = (type: MediaManagerActionT) => {
    if (type === 'SAVE') {
      editMediaItem({ data: selectedItem }).then(({ data }) => {
        refetchList()
        handleSetSelectedItem(data)
      })
    } else if (type === 'CANCEL') {
      setSelectedItem(initialItemState)
    } else if (type === 'DELETE') {
      deleteMediaItem({ data: selectedItem }).then(() => {
        refetchList()
        handleSetSelectedItem(null)
      })
    } else if (type === 'SELECT') {
      onSelect(selectedItem)
      onClose()
    }
  }

  const drawerWidth = 300
  return (
    <Dialog onClose={onClose} open={true} maxWidth="xl" fullWidth>
      <MediaModalNavBar t={t} />
      <Box
        sx={{
          display: 'flex',
          overflowX: 'hidden',
        }}
      >
        <MediaModalContent
          data={data}
          drawerWidth={drawerWidth}
          error={error}
          loading={loading}
          selectedItemId={selectedItem?.id || selectedDefaultId}
          setSelectedItem={handleSetSelectedItem}
        />
        <MediaModalRightPanel
          drawerWidth={drawerWidth}
          onChangeValue={handleOnChangeValue}
          onSubmitAction={handleSubmitAction}
          selectedItem={selectedItem}
          selectedItemChanged={!equals(selectedItem, initialItemState)}
          selectedItemForm={selectedItemForm}
          t={t}
          updateList={refetchList}
        />
      </Box>
    </Dialog>
  )
}

export default MediaManager
