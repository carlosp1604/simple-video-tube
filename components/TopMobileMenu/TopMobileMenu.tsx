import { FC, ReactElement } from 'react'
import styles from './TopMobileMenu.module.scss'
import useTranslation from 'next-translate/useTranslation'
import { handleClick } from '~/modules/Shared/Infrastructure/FrontEnd/AntiAdBlockHelper'
import { MdOutlinePhotoSizeSelectActual } from 'react-icons/md'
import { SlGameController } from 'react-icons/sl'
import { TbBrandTinder } from 'react-icons/tb'
import { RiLiveLine } from 'react-icons/ri'
import { PiDog } from 'react-icons/pi'
import { ClickOfferAction, OfferCategory } from '~/modules/Shared/Infrastructure/FrontEnd/AnalyticsEvents/TopMobileMenu'

export const TopMobileMenu: FC = () => {
  const { t } = useTranslation('advertising')

  const links: ReactElement[] = []

  const onClick = async (title: string, url: string | undefined) => {
    const { sendGAEvent } = await (import('@next/third-parties/google'))

    sendGAEvent('event', ClickOfferAction, {
      category: OfferCategory,
      label: title,
    })

    handleClick(url)
  }

  if (process.env.NEXT_PUBLIC_PARTNER_URL) {
    links.push(
      <div
        className={ styles.topMobileMenu__offerContainer }
        onClick={ () => onClick(t('menu_top_mobile_partner_offer_title'), process.env.NEXT_PUBLIC_PARTNER_URL) }
        title={ t('menu_top_mobile_partner_offer_title') }
        key={ t('menu_top_mobile_partner_offer_title') }
      >
        <span className={ styles.topMobileMenu__offer }>
          <PiDog className={ styles.topMobileMenu__offerIcon }/>
          { t('menu_top_mobile_partner_offer_title') }
        </span>

      </div>
    )
  }

  if (process.env.NEXT_PUBLIC_CAMS_AD_URL) {
    links.push(
      <div
        className={ styles.topMobileMenu__offerContainer }
        onClick={ () => onClick(t('menu_top_mobile_cams_offer_title'), process.env.NEXT_PUBLIC_CAMS_AD_URL) }
        title={ t('menu_top_mobile_cams_offer_title') }
        key={ t('menu_top_mobile_cams_offer_title') }
      >
        <span className={ styles.topMobileMenu__offer }>
          <RiLiveLine className={ styles.topMobileMenu__offerIcon }/>
          { t('menu_top_mobile_cams_offer_title') }
        </span>

      </div>
    )
  }

  if (process.env.NEXT_PUBLIC_DATING_AD_URL) {
    links.push(
      <div
        className={ styles.topMobileMenu__offerContainer }
        onClick={ () => onClick(t('menu_top_mobile_dating_offer_title'), process.env.NEXT_PUBLIC_DATING_AD_URL) }
        title={ t('menu_top_mobile_dating_offer_title') }
        key={ t('menu_top_mobile_dating_offer_title') }
      >
        <span className={ styles.topMobileMenu__offer }>
          <TbBrandTinder className={ styles.topMobileMenu__offerIcon } />
          { t('menu_top_mobile_dating_offer_title') }
        </span>
      </div>
    )
  }

  if (process.env.NEXT_PUBLIC_GAMES_AD_URL) {
    links.push(
      <div
        className={ styles.topMobileMenu__offerContainer }
        onClick={ () => onClick(t('menu_top_mobile_porn_games_offer_title'), process.env.NEXT_PUBLIC_GAMES_AD_URL) }
        title={ t('menu_top_mobile_porn_games_offer_title') }
        key={ t('menu_top_mobile_porn_games_offer_title') }
      >
        <span className={ styles.topMobileMenu__offer }>
          <SlGameController className={ styles.topMobileMenu__offerIcon }/>
          { t('menu_top_mobile_porn_games_offer_title') }
        </span>
      </div>
    )
  }

  if (process.env.NEXT_PUBLIC_IA_AD_URL) {
    links.push(
      <div
        className={ styles.topMobileMenu__offerContainer }
        onClick={ () => onClick(t('menu_top_mobile_ia_offer_title'), process.env.NEXT_PUBLIC_IA_AD_URL) }
        title={ t('menu_top_mobile_ia_offer_title') }
        key={ t('menu_top_mobile_ia_offer_title') }
      >
        <span className={ styles.topMobileMenu__offer }>
          <MdOutlinePhotoSizeSelectActual className={ styles.topMobileMenu__offerIcon }/>
          { t('menu_top_mobile_ia_offer_title') }
        </span>
      </div>
    )
  }

  if (links.length === 0) {
    return null
  }

  return (
    <div className={ styles.topMobileMenu__container }>
      { links }
    </div>
  )
}
