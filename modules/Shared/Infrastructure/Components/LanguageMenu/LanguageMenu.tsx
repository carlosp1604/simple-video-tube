import styles from './LanguageMenu.module.scss'
import { FC, useState } from 'react'
import { MenuOptionComponentInterface, MenuOptions } from '~/components/MenuOptions/MenuOptions'
import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'
import { IoLanguageOutline } from 'react-icons/io5'
import { useRouter } from 'next/router'
import { ModalMenuHeader } from '~/modules/Shared/Infrastructure/Components/ModalMenuHeader/ModalMenuHeader'
import dynamic from 'next/dynamic'
import { rgbDataURL } from '~/modules/Shared/Infrastructure/FrontEnd/BlurDataUrlHelper'
import { useToast } from '~/components/AppToast/ToastContext'
import { nanoid } from 'nanoid'
import { useLanguageMenuContext } from '~/hooks/LanguageMenuContext'
import { i18nConfig } from '~/i18n.config'
import setLanguage from 'next-translate/setLanguage'

const Modal = dynamic(() =>
  import('~/components/Modal/Modal').then((module) => module.Modal),
{ ssr: false }
)

export const LanguageMenu: FC = () => {
  const { open, setOpen } = useLanguageMenuContext()
  const { t } = useTranslation('menu')
  const { error } = useToast()

  const locale = useRouter().locale ?? i18nConfig.defaultLocale

  const [languageMenuToastId] = useState<string>(nanoid())

  const onClickOption = async (currentLocale: string, newLocale: string) => {
    if (currentLocale !== newLocale) {
      await setLanguage(newLocale, false)
      setOpen(false)
    } else {
      error(t('language_menu_already_on_language_error_message'), languageMenuToastId)
    }
  }

  const menuOptions: MenuOptionComponentInterface[] = i18nConfig.locales.map((configLocale) => {
    return {
      title: t(`language_menu_${configLocale}_option_title`),
      action: undefined,
      picture: (
        <Image
          alt={ t(`language_menu_${configLocale}_option_title`) }
          className={ styles.languageMenu__optionImage }
          src={ `/img/${configLocale}-locale.svg` }
          width={ 0 }
          height={ 0 }
          sizes={ '100vw' }
          placeholder={ 'blur' }
          blurDataURL={ rgbDataURL(81, 80, 80) }
        />
      ),
      isActive: locale === configLocale,
      onClick: () => onClickOption(locale, configLocale),
      onClickInfoButton: undefined,
    }
  })

  return (
    <Modal
      isOpen={ open }
      onClose={ () => setOpen(false) }
    >
      <div className={ styles.languageMenu__container }>
        <ModalMenuHeader
          title={ t('language_menu_title') }
          subtitle={ t('language_menu_subtitle') }
          icon={ <IoLanguageOutline /> }
        />
        <div className={ styles.languageMenu__menuOptionsContainer }>
          <MenuOptions menuOptions={ menuOptions } />
        </div>
      </div>
    </Modal>
  )
}
