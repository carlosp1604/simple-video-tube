import { FC, ReactElement } from 'react'
import styles from './MenuOptions.module.scss'
import Link from 'next/link'

export interface ActionInterface {
  url: string
  blank: boolean
}

export interface MenuOptionComponentInterface {
  isActive: boolean
  title: string
  action: ActionInterface
  picture: ReactElement
  onClick: (() => void) | undefined
}

interface Props {
  menuOptions: MenuOptionComponentInterface[]
}

export const MenuOptions: FC<Props> = ({ menuOptions }) => {
  return (
    <div className={ styles.menuOptions__menuContainer }>
      { menuOptions.map((menuOption) => {
        return (
          <div className={ `
            ${styles.menuOptions__menuItem}
            ${menuOption.isActive ? styles.menuOptions__menuItemActive : ''}
          ` }
            key={ menuOption.title }
            onClick={ menuOption.onClick }
          >
            <Link
              href={ menuOption.action.url }
              className={ styles.menuOptions__menuItemContent }
              target={ menuOption.action.blank ? '_blank' : '_self' }
            >
              <span className={ styles.menuOptions__menuIcon }>
                { menuOption.picture }
              </span>
              { menuOption.title }
            </Link>
          </div>
        )
      }) }
    </div>
  )
}
