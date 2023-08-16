import { FC, useState } from 'react'
import styles from './MenuSideBar.module.scss'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getMobileMenuOptions } from '~/components/AppMenu/MobileMenuOptions'
import { useTranslation } from 'next-i18next'
import { BsList } from 'react-icons/bs'
import { IconButton } from '~/components/IconButton/IconButton'
import { MenuOptionComponentInterface } from '~/components/MenuOptions/MenuOptions'

interface MenuSideBarOptionProps {
  menuOption: MenuOptionComponentInterface
  menuOpen: boolean
}

const MenuSideBarOption: FC<MenuSideBarOptionProps> = ({ menuOption, menuOpen }) => {
  return (
    <div className={ `
      ${styles.menuSideBar__menuItem}
      ${menuOption.isActive ? styles.menuSideBar__menuItem_active : ''}
      ` }
       key={ menuOption.title }
       onClick={ menuOption.onClick }
    >
      <Link
        href={ menuOption.action }
        className={ `
          ${styles.menuSideBar__menuItemContent}
          ${menuOpen ? styles.menuSideBar__menuItemContent_open : ''}
        ` }
      >
        <span className={ styles.menuSideBar__menuItemIcon }>
          { menuOption.icon }
        </span>
        <span className={ `
          ${styles.menuSideBar__menuItemText}
          ${menuOpen ? styles.menuSideBar__menuItemText_open : ''}
        ` }>
          { menuOption.title }
        </span>
      </Link>
    </div>
  )
}

export const MenuSideBar: FC = () => {
  const { pathname } = useRouter()

  const { t } = useTranslation('menu')

  const menuOptions: MenuOptionComponentInterface[] = getMobileMenuOptions(pathname).map((menuOption) => {
    return {
      ...menuOption,
      title: t(menuOption.translationKey),
    }
  })

  const [menuOpen, setMenuOpen] = useState<boolean>(false)

  return (
    <aside className={ `
      ${styles.menuSideBar__asideSlideOut}
      ${menuOpen ? styles.menuSideBar__asideSlideOut_open : ''}
    ` }>
      <div className={ `
        ${styles.menuSideBar__menuIcon}
        ${menuOpen ? styles.menuSideBar__menuIcon_open : ''}
      ` }>
        <IconButton
          onClick={ () => setMenuOpen(!menuOpen) }
          icon={ <BsList /> }
          title={ t('menu_button_title') }
        />
      </div>

      <div className={ `
        ${styles.menuSideBar__menuContainer}
        ${menuOpen ? styles.menuSideBar__menuContainer_open : ''}
      ` }>
        { menuOptions.map((menuOption) => {
          return (
            <MenuSideBarOption
              menuOption={ menuOption }
              menuOpen={ menuOpen }
              key={ menuOption.title }
            />
          )
        }) }
      </div>

      <div className={ `
        ${styles.menuSideBar__copyrightContainer}
        ${menuOpen ? styles.menuSideBar__copyrightContainer_open : ''}
      ` }>
        <span className={ `
          ${styles.menuSideBar__copyrightContainerText}
          ${menuOpen ? styles.menuSideBar__copyrightContainerText_open : ''}
        ` }>
          { t('copyright_section_title') }
        </span>
      </div>
    </aside>
  )
}
