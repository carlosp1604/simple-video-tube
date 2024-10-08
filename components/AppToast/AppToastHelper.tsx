import { ReactElement } from 'react'
import { AppToast, AppToastType } from '~/components/AppToast/AppToast'

export class AppToastHelper {
  public static toast (
    type: AppToastType,
    content: string,
    dismissible = false,
    duration = 3000
  ): ReactElement {
    return (
      <AppToast
        type={ type }
        content={ content }
        dismissible={ dismissible }
        duration={ duration }
      />
    )
  }
}
