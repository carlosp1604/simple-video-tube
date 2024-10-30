import { createContext, Dispatch, SetStateAction, useContext, useMemo } from 'react'

export interface LanguageMenuState {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const LanguageMenuContext = createContext<LanguageMenuState>(null)

export const useLanguageMenuContext = (): LanguageMenuState => {
  const languageMenuContext = useContext(LanguageMenuContext)

  if (!languageMenuContext) {
    throw new Error(
      'useLanguageMenuContext() can only be used inside of <LanguageMenuContext />'
    )
  }

  const { open, setOpen } = languageMenuContext

  return useMemo<LanguageMenuState>(() => {
    return { open, setOpen }
  }, [open, setOpen])
}
