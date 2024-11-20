import { FC, useRef } from 'react'
import styles from './Menu.module.scss'
import Link from 'next/link'
import { ThemeSwitcher } from '~/components/ThemeSwitcher/ThemeSwitcher'
import useTranslation from 'next-translate/useTranslation'
import { CSSTransition } from 'react-transition-group'
import { BsStar } from 'react-icons/bs'
import { MdLiveTv } from 'react-icons/md'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import { TfiWorld } from 'react-icons/tfi'
import { useLanguageMenuContext } from '~/hooks/LanguageMenuContext'
import { useClickAnimation } from '~/hooks/ClickAnimation/ClickAnimation'
import { AiOutlineTag } from 'react-icons/ai'
import { GoHome } from 'react-icons/go'
import { i18nConfig } from '~/i18n.config'

export interface Props {
  open: boolean
  onClose: () => void
}

export const Menu: FC<Props> = ({ open, onClose }) => {
  const { t } = useTranslation('menu')
  const pathname = usePathname()
  const containerRef = useRef(null)
  const slideOutContainerRef = useRef(null)
  const languageButtonRef = useRef(null)

  const locale = useRouter().locale ?? i18nConfig.defaultLocale
  const { setOpen } = useLanguageMenuContext()

  useClickAnimation(languageButtonRef)

  return (
    <CSSTransition
      nodeRef={ containerRef }
      classNames={ {
        enter: styles.menu__container_enter,
        enterActive: styles.menu__container_enterActive,
        enterDone: styles.menu__container_enterDone,
        exit: styles.menu__container_exit,
        exitActive: styles.menu__container_exitActive,
        exitDone: styles.menu__container_exitDone,
      } }
      in={ open }
      timeout={ 500 }
    >
      <div
        className={ styles.menu__container }
        ref={ containerRef }
      >
        <div className={ styles.menu__slideOutContainer }>
          <CSSTransition
            nodeRef={ slideOutContainerRef }
            classNames={ {
              enter: styles.menu__slideOut_enter,
              enterActive: styles.menu__slideOut_enterActive,
              exit: styles.menu__slideOut_exit,
              exitActive: styles.menu__slideOut_exitActive,
            } }
            in={ open }
            timeout={ 500 }
          >
            <div
              className={ styles.menu__slideOut }
              ref={ slideOutContainerRef }
            >
              <Link
                prefetch={ false }
                key={ t('menu_home_button_title') }
                href={ '/' }
                title={ t('menu_home_button_title') }
                className={ `
                  ${styles.menu__optionContainer} 
                  ${pathname === '/' ? styles.menu__optionContainer__active : ''}
                ` }
                onClick={ onClose }
              >
                <GoHome/>
                { t('menu_home_button_title') }
              </Link>
              <Link
                prefetch={ false }
                key={ t('menu_stars_button_title') }
                href={ '/actors' }
                title={ t('menu_stars_button_title') }
                className={ `
                  ${styles.menu__optionContainer} 
                  ${pathname === '/actors' ? styles.menu__optionContainer__active : ''}
                ` }
                onClick={ onClose }
              >
                <BsStar/>
                { t('menu_stars_button_title') }
              </Link>
              <Link
                prefetch={ false }
                key={ t('menu_producers_button_title') }
                href={ '/producers' }
                title={ t('menu_producers_button_title') }
                className={ `
                  ${styles.menu__optionContainer} 
                  ${pathname === '/producers' ? styles.menu__optionContainer__active : ''}
                ` }
                onClick={ onClose }
              >
                <MdLiveTv/>
                { t('menu_producers_button_title') }
              </Link>
              <Link
                prefetch={ false }
                key={ t('menu_categories_button_title') }
                href={ '/categories' }
                title={ t('menu_categories_button_title') }
                className={ `
                  ${styles.menu__optionContainer} 
                  ${pathname === '/categories' ? styles.menu__optionContainer__active : ''}
                ` }
                onClick={ onClose }
              >
                <AiOutlineTag />
                { t('menu_categories_button_title') }
              </Link>
              <div className={ styles.menu__optionWithBorderContainer }>
                { t('menu_theme_button_title') }
                <ThemeSwitcher/>
              </div>

              <div className={ styles.menu__optionWithBorderContainer }>
                { t('menu_language_button_title') }
                <button
                  ref={ languageButtonRef }
                  className={ styles.menu__languageButton }
                  onClick={ () => setOpen(true) }
                >
                  <TfiWorld />
                  { locale }
                </button>
              </div>
            </div>
          </CSSTransition>
        </div>
        <div
          className={ styles.menu__backdropContainer }
          onClick={ onClose }
        />
      </div>
    </CSSTransition>
  )
}
