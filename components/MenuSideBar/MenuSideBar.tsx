import { Dispatch, FC, SetStateAction } from 'react'
import styles from './MenuSideBar.module.scss'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { BsHouse, BsStar, BsTags } from 'react-icons/bs'
import { MenuOptionComponentInterface } from '~/components/MenuOptions/MenuOptions'
import { TfiWorld } from 'react-icons/tfi'
import { MenuSideBarOption } from './MenuSideBarOption/MenuSideBarOption'
import { MdLiveTv } from 'react-icons/md'

export interface Props {
  setOpenLanguageMenu: Dispatch<SetStateAction<boolean>>
  menuOpen: boolean
}

export const MenuSideBar: FC<Props> = ({ setOpenLanguageMenu, menuOpen }) => {
  const { pathname } = useRouter()
  const { t } = useTranslation('menu')

  const menuOptions: MenuOptionComponentInterface[] = [
    {
      title: t('menu_home_button_title'),
      isActive: pathname === '/',
      action: {
        url: '/',
        blank: false,
      },
      picture: <BsHouse />,
      onClick: undefined,
    },
    /**
     {
      translationKey: 'menu_following_button_title',
      isActive: false,
      action: {
        url: '/',
        blank: false,
      },
      picture: <TbClipboardCheck />,
      onClick: undefined,
    },
     **/
    {
      title: t('menu_stars_button_title'),
      isActive: pathname === '/actors',
      action: {
        url: '/actors',
        blank: false,
      },
      picture: <BsStar />,
      onClick: undefined,
    },
    {
      title: t('menu_producers_button_title'),
      isActive: pathname === '/producers',
      action: {
        url: '/producers',
        blank: false,
      },
      picture: <MdLiveTv />,
      onClick: undefined,
    },
    {
      title: t('menu_tags_button_title'),
      isActive: pathname === '/categories',
      action: {
        url: '/categories',
        blank: false,
      },
      picture: <BsTags />,
      onClick: undefined,
    },
  ]

  menuOptions.push({
    title: t('menu_language_button_title'),
    isActive: false,
    action: undefined,
    picture: <TfiWorld />,
    onClick: () => {
      setOpenLanguageMenu(true)
    },
  })

  return (
    <aside className={ `
      ${styles.menuSideBar__asideSlideOut}
      ${menuOpen ? styles.menuSideBar__asideSlideOut_open : ''}
    ` }>
      <div className={ styles.menuSideBar__menuSectionContainer }>
        <div className={ styles.menuSideBar__menuContainer }>
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
      </div>
    </aside>
  )
}
