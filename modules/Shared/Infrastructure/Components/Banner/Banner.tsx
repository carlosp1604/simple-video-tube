import { createRef, FC, useEffect } from 'react'
import styles from './Banner.module.scss'
import useTranslation from 'next-translate/useTranslation'

export const Banner: FC = () => {
  const { t } = useTranslation('common')
  const bannerRef = createRef<HTMLDivElement>()

  const atOptions = {
    key: process.env.NEXT_PUBLIC_ADSTERRA_BANNER_KEY ?? '',
    format: 'iframe',
    height: 250,
    width: 300,
    container: `atContainer-${process.env.NEXT_PUBLIC_ADSTERRA_BANNER_KEY ?? ''}`,
    params: {},
  }

  useEffect(() => {
    if (atOptions.key === '') {
      return
    }

    if (bannerRef.current && !bannerRef.current.firstChild) {
      const conf = document.createElement('script')
      const script = document.createElement('script')

      script.type = 'text/javascript'
      script.src = `//${process.env.NEXT_PUBLIC_ADSTERRA_BANNER_DOMAIN}/${atOptions.key}/invoke.js`
      conf.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`

      bannerRef.current.append(conf)
      bannerRef.current.append(script)
    }
  }, [bannerRef])

  if (!process.env.NEXT_PUBLIC_ADSTERRA_BANNER_KEY || !process.env.NEXT_PUBLIC_ADSTERRA_BANNER_DOMAIN) {
    return null
  }

  return (
    <section className={ styles.banner__container }>
      <div ref={ bannerRef } className={ styles.banner__bannerContainer } />
      <div id ={ `atContainer-${process.env.NEXT_PUBLIC_ADSTERRA_BANNER_KEY ?? ''}` } />
      { t('banner_ad_title') }
    </section>
  )
}
