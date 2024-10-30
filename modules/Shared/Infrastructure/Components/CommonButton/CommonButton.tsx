import { FC, ReactElement } from 'react'
import styles from './CommonButton.module.scss'

type CommonButtonCallback = () => void

export interface Props {
  title: string
  disabled: boolean
  onClick: CommonButtonCallback
}

export interface OptionalProps {
  icon: ReactElement
}

export const CommonButton: FC<Props & Partial<OptionalProps>> = ({ title, disabled, onClick, icon = undefined }) => {
  return (
    <button
      className={ styles.commonButton__container }
      title={ title }
      disabled={ disabled }
      onClick={ onClick }
    >
      { icon }
      { title }
    </button>
  )
}
