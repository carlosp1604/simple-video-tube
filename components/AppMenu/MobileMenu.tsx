import { Dispatch, FC, SetStateAction } from 'react'
import styles from './MobileMenu.module.scss'
import { MenuOptions } from '~/components/MenuOptions/MenuOptions'
import useTranslation from 'next-translate/useTranslation'
import { BsHouse, BsStar, BsTags } from 'react-icons/bs'
import { useRouter } from 'next/router'
import { TfiWorld } from 'react-icons/tfi'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { MdLiveTv } from 'react-icons/md'

const CSSTransition = dynamic(() =>
  import('react-transition-group').then((module) => module.CSSTransition), { ssr: false }
)

interface Props {
  openMenu: boolean
  setOpenMenu: Dispatch<SetStateAction<boolean>>
  setOpenLanguageMenu: Dispatch<SetStateAction<boolean>>
}

export const MobileMenu: FC<Props> = ({ openMenu, setOpenMenu, setOpenLanguageMenu }) => {
  const { t } = useTranslation('menu')
  const { pathname, asPath } = useRouter()

  return (
    <CSSTransition
      classNames={ {
        enter: styles.mobileMenu__backdropEnter,
        enterActive: styles.mobileMenu__backdropEnterActive,
        enterDone: styles.mobileMenu__backdropEnterDone,
        exit: styles.mobileMenu__backdropExit,
        exitActive: styles.mobileMenu__backdropExitActive,
        exitDone: styles.mobileMenu__backdropExitDone,
      } }
      in={ openMenu }
      timeout={ parseInt('500') }
    >
      <div
        className={ styles.mobileMenu__backdrop }
        onClick={ () => setOpenMenu(false) }
      >
        <CSSTransition
          classNames={ {
            enterActive: styles.mobileMenu__slideOutEnterActive,
            enterDone: styles.mobileMenu__slideOutEnterDone,
            exit: styles.mobileMenu__slideOutExit,
            exitActive: styles.mobileMenu__slideOutExitActive,
          } }
          in={ openMenu }
          timeout={ parseInt('500') }
        >
          <div className={ styles.mobileMenu__slideOut }>
            <div className={ styles.mobileMenu__logoContainer } >
              <Image
                alt={ t('menu_logo_alt_title') }
                className={ styles.mobileMenu__logo }
                src={ '/img/app-logo-text.png' }
                width={ 0 }
                height={ 0 }
                sizes={ '100vw' }
              />
            </div>

            <MenuOptions menuOptions={ [
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
              {
                title: t('menu_language_button_title'),
                isActive: false,
                action: undefined,
                picture: <TfiWorld />,
                onClick: () => {
                  setOpenLanguageMenu(true)
                },
              },
            ] } />
          </div>
        </CSSTransition>
      </div>
    </CSSTransition>
  )
}
