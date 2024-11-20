import { FC, ReactElement } from 'react'
import styles from './AppFooter.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import { FaFacebookF, FaTelegramPlane, FaTiktok } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import useTranslation from 'next-translate/useTranslation'
import Trans from 'next-translate/Trans'
import {
  ClickSocialNetworkProfile,
  SocialNetworkCategory
} from '~/modules/Shared/Infrastructure/FrontEnd/AnalyticsEvents/Footer'
import { ThemeSwitcher } from '~/components/ThemeSwitcher/ThemeSwitcher'

export const AppFooter: FC = () => {
  const { t } = useTranslation('footer')

  const transCopyright = (
    <Trans
      i18nKey={ 'footer:copyright_title' }
      components={ [
        <small key={ t('copyright_title') } className={ styles.appFooter__copyrightBrandName }/>,
      ] }
    />
  )

  let facebookProfile: ReactElement | null = null
  let xProfile: ReactElement | null = null
  let tiktokProfile: ReactElement | null = null
  let telegramProfile: ReactElement | null = null

  const onClickSocialNetworkIcon = async (socialNetwork: string) => {
    const { sendGAEvent } = await (import('@next/third-parties/google'))

    sendGAEvent('event', ClickSocialNetworkProfile, {
      category: SocialNetworkCategory,
      label: socialNetwork,
    })
  }

  if (process.env.NEXT_PUBLIC_FACEBOOK_PROFILE) {
    facebookProfile = (
      <Link
        href={ process.env.NEXT_PUBLIC_FACEBOOK_PROFILE }
        title={ t('facebook_icon_title') }
        target={ '_blank' }
        className={ styles.appFooter__socialNetwork }
        onClick={ async () => {
          await onClickSocialNetworkIcon(t('facebook_icon_title'))
        } }
      >
        <FaFacebookF />
      </Link>
    )
  }

  if (process.env.NEXT_PUBLIC_X_PROFILE) {
    xProfile = (
      <Link
        href={ process.env.NEXT_PUBLIC_X_PROFILE }
        title={ t('twitter_icon_title') }
        target={ '_blank' }
        className={ styles.appFooter__socialNetwork }
        onClick={ async () => {
          await onClickSocialNetworkIcon(t('twitter_icon_title'))
        } }
      >
        <FaXTwitter />
      </Link>
    )
  }

  if (process.env.NEXT_PUBLIC_TIKTOK_PROFILE) {
    tiktokProfile = (
      <Link
        href={ process.env.NEXT_PUBLIC_TIKTOK_PROFILE }
        title={ t('tiktok_icon_title') }
        target={ '_blank' }
        className={ styles.appFooter__socialNetwork }
        onClick={ async () => {
          await onClickSocialNetworkIcon(t('tiktok_icon_title'))
        } }
      >
        <FaTiktok />
      </Link>
    )
  }

  if (process.env.NEXT_PUBLIC_TELEGRAM_PROFILE) {
    telegramProfile = (
      <Link
        href={ process.env.NEXT_PUBLIC_TELEGRAM_PROFILE }
        title={ t('telegram_icon_title') }
        target={ '_blank' }
        className={ styles.appFooter__socialNetwork }
        onClick={ async () => {
          await onClickSocialNetworkIcon(t('telegram_icon_title'))
        } }
      >
        <FaTelegramPlane />
      </Link>
    )
  }

  return (
    <footer className={ styles.appFooter__layout }>
      <div className={ styles.appFooter__container }>
        <Link
          href={ `mailto:${process.env.NEXT_PUBLIC_EMAIL_CONTACT_ADDRESS}` }
          shallow={ true }
          className={ styles.appFooter__contactLink }
        >
          { t('contact_title') }
        </Link>
        <div className={ styles.appFooter__copyright }>
          { transCopyright }
        </div>
        <Link
          href="/"
          shallow={ true }
          className={ styles.appFooter__logoImageLink }
        >
          <Image
            alt={ t('app_logo_alt_title') }
            className={ styles.appFooter__logoImage }
            src={ '/img/app-logo-text.png' }
            width={ 0 }
            height={ 0 }
            sizes={ '100vw' }
          />
        </Link>

        <div className={ styles.appFooter__socialNetworks }>
          { facebookProfile }
          { xProfile }
          { tiktokProfile }
          { telegramProfile }
        </div>

        <div className={ styles.appFooter__themeSwitcher }>
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  )
}
