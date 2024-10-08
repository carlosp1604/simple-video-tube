import { Toast } from '~/components/AppToast/Toast'

export type Action<T = Toast, I = string> =
  { type: 'add'; toast: T } |
  { type: 'delete'; toastId: I }

export interface ToastState {
  toasts: Toast []
}

export const toastReducer = (state: ToastState, action: Action) => {
  switch (action.type) {
    case 'add':
      return {
        ...state,
        toasts: [...state.toasts, action.toast],
      }

    case 'delete': {
      const updatedToasts = state.toasts.filter(
        (toast) => toast.id !== action.toastId
      )

      return {
        ...state,
        toasts: updatedToasts,
      }
    }

    default:
      throw new Error('Unhandled action type')
  }
}
