import Link from 'next/link'
import styles from './AppMenu.module.scss'
import { SearchBar } from '~/components/SearchBar/SearchBar'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { IconButton } from '~/components/IconButton/IconButton'
import { useUsingRouterContext } from '~/hooks/UsingRouterContext'
import Image from 'next/image'
import { useToast } from '~/components/AppToast/ToastContext'
import { useLanguageMenuContext } from '~/hooks/LanguageMenuContext'
import { rgbDataURL } from '~/modules/Shared/Infrastructure/FrontEnd/BlurDataUrlHelper'
import { IoSearch } from 'react-icons/io5'
import { FaArrowUp } from 'react-icons/fa'
import { HiMiniBars3BottomLeft } from 'react-icons/hi2'
import { i18nConfig } from '~/i18n.config'
import { LiaDiceD6Solid } from 'react-icons/lia'
import { APIException } from '~/modules/Shared/Infrastructure/FrontEnd/ApiException'

export interface Props {
  onClickMenuButton : () => void
}

export const AppMenu: FC<Props> = ({ onClickMenuButton }) => {
  const [title, setTitle] = useState<string>('')
  const [openSearchBar, setOpenSearchBar] = useState<boolean>(false)
  const router = useRouter()

  const { error } = useToast()
  const { t } = useTranslation('app_menu')
  const { setOpen } = useLanguageMenuContext()
  const { blocked } = useUsingRouterContext()

  const locale = useRouter().locale ?? i18nConfig.defaultLocale

  const onSearch = async () => {
    if (blocked) {
      error(t('action_cannot_be_performed_error_message'))

      return
    }

    const dompurify = (await import('dompurify')).default
    const cleanTitle = dompurify.sanitize(title.trim())

    if (cleanTitle === '') {
      error(t('empty_search_error_message'))

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
      error(t('already_searching_term_error_message'))
    }
  }

  const handleRandomButton = async () => {
    const PostsApiService =
      (await import('~/modules/Posts/Infrastructure/Frontend/PostsApiService')).PostsApiService

    const postsApiService = new PostsApiService()

    try {
      const postSlug = await postsApiService.getRandomPostSlug()

      await router.push({
        pathname: `/posts/videos/${postSlug}`,
      }, undefined, { shallow: true, scroll: true })
    } catch (exception: unknown) {
      if (!(exception instanceof APIException)) {
        error(t('api_exceptions:something_went_wrong_error_message'))

        console.error(exception)

        return
      }

      error(t(`api_exceptions:${exception.translationKey}`))
    }
  }

  return (
    <nav className={ styles.appMenu__layer }>
      <div className={ styles.appMenu__container }>
        <div className={ styles.appMenu__leftContainer }>
          <IconButton
            onClick={ onClickMenuButton }
            icon={ <HiMiniBars3BottomLeft /> }
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
            onClick={ () => setOpen(true) }
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
            { locale }
          </button>
        </div>
        <div className={ `
          ${styles.appMenu__searchContainer}
          ${openSearchBar ? styles.appMenu__searchContainer__open : ''}
        ` }>
          <SearchBar
            onChange={ (value: string) => setTitle(value) }
            onSearch={ onSearch }
            focus={ openSearchBar }
            placeHolderTitle={ t('app_menu_search_menu_placeholder_title') }
            searchIconTitle={ t('app_menu_search_button_title') }
          />
        </div>
        <div className={ styles.appMenu__rightContainer }>
          <div className={ styles.appMenu__mobileSearchButton }>
            <IconButton
              onClick={ () => setOpenSearchBar(!openSearchBar) }
              icon={ openSearchBar ? <FaArrowUp /> : <IoSearch /> }
              title={ openSearchBar ? t('search_bar_contract_title') : t('search_bar_expand_title') }
              showTooltip={ true }
            />
          </div>
          <IconButton
            onClick={ handleRandomButton }
            icon={ <LiaDiceD6Solid /> }
            title={ t('random_icon_button_title') }
            showTooltip={ true }
          />
        </div>
      </div>
    </nav>
  )
}
