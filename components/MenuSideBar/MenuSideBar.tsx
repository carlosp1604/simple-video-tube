import { FC } from 'react'
import styles from './MenuSideBar.module.scss'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { BsStar } from 'react-icons/bs'
import { MenuOptionComponentInterface } from '~/components/MenuOptions/MenuOptions'
import { MenuSideBarOption } from './MenuSideBarOption/MenuSideBarOption'
import { MdLiveTv } from 'react-icons/md'
import { TfiWorld } from 'react-icons/tfi'
import { useLanguageMenuContext } from '~/hooks/LanguageMenuContext'
import { ThemeSwitcher } from '~/components/ThemeSwitcher/ThemeSwitcher'
import { GoHome } from 'react-icons/go'
import { AiOutlineTag } from 'react-icons/ai'

export interface Props {
  menuOpen: boolean
}

export const MenuSideBar: FC<Props> = ({ menuOpen }) => {
  const { pathname } = useRouter()
  const { t } = useTranslation('menu')

  const { setOpen } = useLanguageMenuContext()

  const menuOptions: MenuOptionComponentInterface[] = [
    {
      title: t('menu_home_button_title'),
      isActive: pathname === '/',
      action: {
        url: '/',
        blank: false,
      },
      picture: <GoHome />,
      onClick: undefined,
      onClickInfoButton: undefined,
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
      onClickInfoButton: undefined,
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
      onClickInfoButton: undefined,
    },
    {
      title: t('menu_categories_button_title'),
      isActive: pathname === '/categories',
      action: {
        url: '/categories',
        blank: false,
      },
      picture: <AiOutlineTag />,
      onClick: undefined,
      onClickInfoButton: undefined,
    },
  ]

  menuOptions.push({
    title: t('menu_language_button_title'),
    isActive: false,
    action: undefined,
    picture: <TfiWorld />,
    onClick: () => setOpen(true),
    onClickInfoButton: undefined,
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
        <ThemeSwitcher />
      </div>
    </aside>
  )
}
