import Link from 'next/link'
import styles from './AppMenu.module.scss'
import { SearchBar } from '~/components/SearchBar/SearchBar'
import { useRouter } from 'next/router'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { IconButton } from '~/components/IconButton/IconButton'
import { CiSearch } from 'react-icons/ci'
import { useUsingRouterContext } from '~/hooks/UsingRouterContext'
import Image from 'next/image'
import { BsArrowUpShort } from 'react-icons/bs'
import { HiBars3 } from 'react-icons/hi2'
import { rgbDataURL } from '~/modules/Shared/Infrastructure/FrontEnd/BlurDataUrlHelper'
import { useToast } from '~/components/AppToast/ToastContext'

export interface Props {
  onClickMenuButton : () => void
  setOpenLanguageMenu: Dispatch<SetStateAction<boolean>>
}

export const AppMenu: FC<Props> = ({ onClickMenuButton, setOpenLanguageMenu }) => {
  const [title, setTitle] = useState<string>('')
  const { blocked } = useUsingRouterContext()
  const [openSearchBar, setOpenSearchBar] = useState<boolean>(false)
  const { success, dismissible } = useToast()
  const { t } = useTranslation('app_menu')
  const router = useRouter()
  const locale = useRouter().locale ?? 'en'

  const onSearch = async () => {
    const toast = (await import('react-hot-toast')).default

    if (blocked) {
      toast.error(t('action_cannot_be_performed_error_message'))

      return
    }

    const dompurify = (await import('dompurify')).default
    const cleanTitle = dompurify.sanitize(title.trim())

    if (cleanTitle === '') {
      dismissible(t('empty_search_error_message'))

      return
    }

    const { search } = router.query

    if (
      !search ||
      (search && search !== cleanTitle)
    ) {
      await router.push({
        pathname: '/posts/search',
        query: {
          search: cleanTitle,
        },
      }, undefined, { shallow: true, scroll: true })

      setOpenSearchBar(false)
    } else {
      toast.error(t('already_searching_term_error_message'))
    }
  }

  return (
    <nav className={ styles.appMenu__layer }>
      <div className={ styles.appMenu__container }>
        <div className={ styles.appMenu__leftContainer }>
          <IconButton
            onClick={ onClickMenuButton }
            icon={ <HiBars3 /> }
            title={ t('app_menu_menu_button') }
          />
          <Link href='/' shallow={ true }>
            <Image
              alt={ t('app_menu_logo_url_alt') }
              className={ styles.appMenu__logoImage }
              src={ '/img/app-logo-text.png' }
              width={ 0 }
              height={ 0 }
              sizes={ '100vw' }
            />
          </Link>
          <button
            className={ styles.appMenu__languageButton }
            onClick={ () => setOpenLanguageMenu(true) }
            title={ t('language_button_title') }
          >
            <Image
              className={ styles.appMenu__languageImage }
              alt={ t('language_button_image_alt', { locale }) }
              src={ `/img/${locale}-locale.svg` }
              width={ 200 }
              height={ 200 }
              sizes={ '100vw' }
              placeholder={ 'blur' }
              blurDataURL={ rgbDataURL(81, 80, 80) }
            />
          </button>
        </div>
        <div className={ `
          ${styles.appMenu__searchContainer}
          ${openSearchBar ? styles.appMenu__searchContainer__open : ''}
        ` }>
          <SearchBar
            onChange={ (value: string) => setTitle(value) }
            onSearch={ onSearch }
            placeHolderTitle={ t('app_menu_search_menu_placeholder_title') }
            searchIconTitle={ t('app_menu_search_button_title') }
            focus={ openSearchBar }
          />
        </div>
        <div className={ styles.appMenu__rightContainer }>
          <div className={ styles.appMenu__mobileSearchButton }>
            <IconButton
              onClick={ () => setOpenSearchBar(!openSearchBar) }
              icon={ openSearchBar ? <BsArrowUpShort /> : <CiSearch /> }
              title={ openSearchBar ? t('search_bar_contract_title') : t('search_bar_expand_title') }
              showTooltip={ true }
            />
          </div>
        </div>
      </div>
    </nav>
  )
}
