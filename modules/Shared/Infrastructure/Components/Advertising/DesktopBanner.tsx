import { FC } from 'react'
import { Banner } from 'exoclick-react'
import styles from './Banner.module.scss'
import useTranslation from 'next-translate/useTranslation'

export const DesktopBanner: FC = () => {
  const { t } = useTranslation('common')

  if (!process.env.NEXT_PUBLIC_DESKTOP_EXOCLICK_BANNER_ID) {
    return null
  }

  return (
    <div className={ styles.banner__container }>
      <div className={ styles.banner__bannerWrapper250x300 }>
        <Banner zoneId={ process.env.NEXT_PUBLIC_DESKTOP_EXOCLICK_BANNER_ID } />
      </div>
      { t('banner_ad_title') }
    </div>
  )
}
