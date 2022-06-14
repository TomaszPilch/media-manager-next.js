import React, { memo } from 'react'
import { Box, ImageList, ImageListItem, Skeleton, useTheme } from '@mui/material'
import { SxProps } from '@mui/system'
import File from '@mui/icons-material/FilePresent'

import { MediaItemT, SetMediaItemT } from './MediaManagerTypes'

type MediaModalContentPropsT = {
  data: MediaItemT[]
  drawerWidth: number
  error: null | Object
  loading: boolean
  selectedItemId?: number | string
  setSelectedItem: SetMediaItemT
}

const skeletonSx: SxProps = {
  width: '100%',
  height: 120,
  flexGrow: 1,
  objectFit: 'cover',
}

const nonImageBoxSx: SxProps = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
}

const MediaModalContent = ({
  data,
  drawerWidth,
  error,
  loading,
  selectedItemId,
  setSelectedItem,
}: MediaModalContentPropsT) => {
  const theme = useTheme()

  const selectedItemSx = {
    border: 2,
    borderColor: theme.palette.primary.main,
    borderRadius: 1,
  }
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        width: { sm: `calc(100% - ${drawerWidth}px)` },
      }}
    >
      <ImageList cols={4}>
        {loading &&
          (!Array.isArray(data) || data.length === 0) &&
          [0, 1, 2, 3, 4].map((key) => (
            <ImageListItem key={key}>
              <Skeleton key={key} variant="rectangular" sx={skeletonSx} />
            </ImageListItem>
          ))}
        {!error &&
          Array.isArray(data) &&
          data.length !== 0 &&
          data.map((item) => (
            <ImageListItem
              key={item.id}
              sx={selectedItemId === item.id ? selectedItemSx : undefined}
              onClick={() => setSelectedItem(item)}
            >
              {item.type.startsWith('image/') && (
                <img src={item.url} alt={item?.text?.title} loading="lazy" style={{ maxHeight: 150 }} />
              )}
              {!item.type.startsWith('image/') && (
                <Box sx={nonImageBoxSx}>
                  <File fontSize="large" />
                </Box>
              )}
            </ImageListItem>
          ))}
      </ImageList>
    </Box>
  )
}

export default memo(MediaModalContent)
