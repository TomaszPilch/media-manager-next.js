import React from 'react'
import { alpha, styled } from '@mui/material/styles'
import { AppBar, Container, InputBase, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

import { TranslationFunctionType } from './MediaManagerTypes'

const Search = styled('div')(({ theme }) => ({
  height: '80%',
  marginTop: 10,
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  height: '100%',
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}))

type MediaModalNavBarPropsT = {
  t: TranslationFunctionType
}

const MediaModalNavBar = ({ t }: MediaModalNavBarPropsT) => {
  return (
    <AppBar position="static">
      <Container maxWidth="xl" sx={{ display: 'flex' }}>
        <Typography variant="h6" noWrap component="div" padding={2} sx={{ flexGrow: 1 }}>
          {t('navBar.title')}
        </Typography>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase placeholder={t('navBar.searchPlaceholder')} inputProps={{ 'aria-label': 'search' }} />
        </Search>
      </Container>
    </AppBar>
  )
}

export default MediaModalNavBar
