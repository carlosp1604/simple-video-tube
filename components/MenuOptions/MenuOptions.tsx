import { FC, ReactElement } from 'react'
import styles from './MenuOptions.module.scss'
import Link from 'next/link'
import { IoMdInformationCircleOutline } from 'react-icons/io'
import { IconButton } from '~/components/IconButton/IconButton'
import useTranslation from 'next-translate/useTranslation'

export interface ActionInterface {
  url: string
  blank: boolean
}

export interface MenuOptionComponentInterface {
  isActive: boolean
  title: string
  action: ActionInterface | undefined
  picture: ReactElement
  onClick: (() => void) | undefined
  onClickInfoButton: (() => void) | undefined
}

interface Props {
  menuOptions: MenuOptionComponentInterface[]
}

export const MenuOptions: FC<Props> = ({ menuOptions }) => {
  const { t } = useTranslation('common')

  const buildOptionContent = (menuOption: MenuOptionComponentInterface): ReactElement => {
    if (menuOption.action) {
      return (
        <div
          className={ styles.menuOptions__menuItemContent }
          key={ menuOption.title }
        >
          <Link
            href={ menuOption.action.url }
            className={ `
              ${styles.menuOptions__itemContent} 
              ${menuOption.isActive ? styles.menuOptions__itemContent__active : ''}  
            ` }
            target={ menuOption.action.blank ? '_blank' : '_self' }
            onClick={ menuOption.onClick }
          >
            <div className={ styles.menuOptions__menuIconWraper }>
              { menuOption.picture }
            </div>
            { menuOption.title }
          </Link>
          { menuOption.onClickInfoButton
            ? <div className={ styles.menuOptions__menuInfoButton }>
                <IconButton
                  onClick={ menuOption.onClickInfoButton }
                  icon={ <IoMdInformationCircleOutline /> }
                  title={ t('information_button_title') }
                  showTooltip={ true }
                />
              </div>
            : null
          }
        </div>
      )
    }

    return (
      <div
        className={ styles.menuOptions__menuItemContent }
        key={ menuOption.title }
      >
        <div
          className={ `
            ${styles.menuOptions__itemContent}
            ${menuOption.isActive ? styles.menuOptions__itemContent_active : ''}
          ` }
          onClick={ menuOption.onClick }
        >
          <span className={ styles.menuOptions__menuIconWraper }>
            { menuOption.picture }
          </span>
          { menuOption.title }
        </div>
        { menuOption.onClickInfoButton
          ? <button
            className={ styles.menuOptions__menuInfoButton }
            onClick={ menuOption.onClickInfoButton }
          >
            <IoMdInformationCircleOutline/>
          </button>
          : null
        }
      </div>
    )
  }

  return (
    <div className={ styles.menuOptions__menuContainer }>
      { menuOptions.map((menuOption) => {
        return buildOptionContent(menuOption)
      }) }
    </div>
  )
}
