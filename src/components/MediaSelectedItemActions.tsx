import React from 'react'
import { Box, Button } from '@mui/material'
import { Delete } from '@mui/icons-material'

import { MediaManagerActionT, TranslationFunctionType } from './MediaManagerTypes'

type MediaSelectedItemActionsPropsT = {
  onSubmitAction: (action: MediaManagerActionT) => void
  selectedItemChanged: boolean
  t: TranslationFunctionType
}

const MediaSelectedItemActions = ({ onSubmitAction, selectedItemChanged, t }: MediaSelectedItemActionsPropsT) => {
  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Button
        variant="contained"
        onClick={() => onSubmitAction(selectedItemChanged ? 'SAVE' : 'SELECT')}
        sx={{ mr: 2 }}
        color={selectedItemChanged ? 'secondary' : 'primary'}
      >
        {t(`rightBar.actions.${selectedItemChanged ? 'save' : 'select'}`)}
      </Button>
      <Button
        variant="outlined"
        startIcon={!selectedItemChanged ? <Delete /> : undefined}
        onClick={() => onSubmitAction(selectedItemChanged ? 'CANCEL' : 'DELETE')}
        color={selectedItemChanged ? 'warning' : 'error'}
      >
        {t(`rightBar.actions.${selectedItemChanged ? 'cancel' : 'delete'}`)}
      </Button>
    </Box>
  )
}

export default MediaSelectedItemActions
