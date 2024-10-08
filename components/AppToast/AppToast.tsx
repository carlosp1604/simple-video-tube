import { FC, useEffect, useState } from 'react'
import styles from './AppToast.module.scss'
import { BsCheckCircle, BsX } from 'react-icons/bs'
import { Toast } from '~/components/AppToast/Toast'

export type AppToastProps = Omit<Toast, 'id'>

export const AppToast: FC<AppToastProps> = ({ type, duration, content, dismissible, onRemove }) => {
  const [hovered, setHovered] = useState(false)
  const [timeoutId, setTimeoutId] = useState<number | null>(null)

  useEffect(() => {
    if (dismissible) {
      return
    }

    if (!timeoutId && !hovered) {
      const timeoutId = window.setTimeout(onRemove, duration)

      setTimeoutId(timeoutId)
    }

    if (timeoutId && hovered) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }

    if (timeoutId) {
      return () => clearTimeout(timeoutId)
    }
  }, [dismissible, timeoutId, hovered, duration, onRemove])

  return (
    <div
      className={ styles.appToast__container }
      onMouseOver={ () => setHovered(true) }
      onMouseLeave={ () => setHovered(false) }
    >
      <BsCheckCircle className={ styles.appToast__icon }/>
      <div className={ styles.appToast__content }>
        { content }
      </div>
      { dismissible
        ? <button
            className={ styles.appToast__closeButton }
            onClick={ () => onRemove() }
          >
            <BsX/>
          </button>
        : null
      }
    </div>
  )
}
