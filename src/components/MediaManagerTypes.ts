export type MediaItemT = {
  id: string | number
  type: string
  width: number
  height: number
  url: string
  text?: {
    title?: string
    description?: string
  }
  createdAt: string
  updatedAt: string
  [key: string]: string | number | Object | undefined
}

export type SetMediaItemT = (item: MediaItemT) => void

export type OnChangeValueT = (key: string, value: never) => void

export type MediaManagerActionT = 'SAVE' | 'CANCEL' | 'SELECT' | 'DELETE'

export type TranslationFunctionType = (key: string | string[], data?: Object) => string
