import { FC, ReactElement, useState } from 'react'
import { LanguageMenuContext } from '~/hooks/LanguageMenuContext'

export interface ToastContextProps {
  children: ReactElement
}

export const LanguageMenuProvider: FC<ToastContextProps> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <LanguageMenuContext.Provider value={ { open, setOpen } }>
      { children }
    </LanguageMenuContext.Provider>
  )
}
