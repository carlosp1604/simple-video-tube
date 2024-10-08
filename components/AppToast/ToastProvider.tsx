import { createRef, FC, ReactElement, Ref, useReducer } from 'react'
import { toastReducer, ToastState } from '~/components/AppToast/ToastReducer'
import { ToastType } from '~/components/AppToast/Toast'
import ToastsContainer, { ToastWithNodeRef } from '~/components/AppToast/ToastsContainer/ToastsContainer'
import { ToastContext } from '~/components/AppToast/ToastContext'

export interface ToastContextProps {
  children: ReactElement
}

export const ToastProvider: FC<ToastContextProps> = ({ children }) => {
  const initialState: ToastState = {
    toasts: [],
  }

  const [state, dispatch] = useReducer(toastReducer, initialState)

  const addToast = (
    type: ToastType,
    content: string,
    dismissible = false,
    duration = 5000
  ) => {
    const id = Math.floor(Math.random() * 10000000)

    dispatch({
      type: 'add',
      toast: {
        id: String(id),
        content,
        type,
        duration,
        dismissible,
        onRemove: () => dispatch({ type: 'delete', toastId: String(id) }),
      },
    })
  }

  const success = (content: string) => {
    addToast('success', content)
  }

  const error = (content: string) => {
    addToast('error', content)
  }

  const dismissible = (content: string) => {
    addToast('error', content, true)
  }

  const remove = (id: string) => {
    dispatch({ type: 'delete', toastId: id })
  }

  const value = { success, error, dismissible, remove }

  const buildToastWithReference = (): ToastWithNodeRef[] => {
    return state.toasts.map((toast) => {
      const ref: Ref<HTMLDivElement> = createRef()

      return {
        toast,
        nodeRef: ref,
      }
    })
  }

  return (
    <ToastContext.Provider value={ value }>
      <ToastsContainer toasts={ buildToastWithReference() } />
      { children }
    </ToastContext.Provider>
  )
}
