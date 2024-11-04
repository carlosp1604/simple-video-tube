import { FC, ReactElement } from 'react'
import styles from './TopMobileMenu.module.scss'
import useTranslation from 'next-translate/useTranslation'
import { handleClick } from '~/modules/Shared/Infrastructure/FrontEnd/AntiAdBlockHelper'
import { MdOutlinePhotoSizeSelectActual } from 'react-icons/md'
import { SlGameController } from 'react-icons/sl'
import { TbBrandTinder } from 'react-icons/tb'
import { RiLiveLine } from 'react-icons/ri'
import { PiDog } from 'react-icons/pi'

export const TopMobileMenu: FC = () => {
  const { t } = useTranslation('menu')

  const links: ReactElement[] = []

  if (process.env.NEXT_PUBLIC_PARTNER_URL) {
    links.push(
      <div
        className={ styles.topMobileMenu__offerContainer }
        onClick={ () => handleClick(process.env.NEXT_PUBLIC_CAMS_AD_URL) }
        title={ t('partner_advertising_title') }
        key={ t('partner_advertising_title') }
      >
        <span className={ styles.topMobileMenu__offer }>
          <PiDog className={ styles.topMobileMenu__offerIcon }/>
          { t('partner_advertising_title') }
        </span>

      </div>
    )
  }

  if (process.env.NEXT_PUBLIC_CAMS_AD_URL) {
    links.push(
      <div
        className={ styles.topMobileMenu__offerContainer }
        onClick={ () => handleClick(process.env.NEXT_PUBLIC_CAMS_AD_URL) }
        title={ t('live_cams_advertising_title') }
        key={ t('live_cams_advertising_title') }
      >
        <span className={ styles.topMobileMenu__offer }>
          <RiLiveLine className={ styles.topMobileMenu__offerIcon }/>
          { t('live_cams_advertising_title') }
        </span>

      </div>
    )
  }

  if (process.env.NEXT_PUBLIC_DATING_AD_URL) {
    links.push(
      <div
        className={ styles.topMobileMenu__offerContainer }
        onClick={ () => handleClick(process.env.NEXT_PUBLIC_DATING_AD_URL) }
        title={ t('dating_advertising_title') }
        key={ t('dating_advertising_title') }
      >
        <span className={ styles.topMobileMenu__offer }>
          <TbBrandTinder className={ styles.topMobileMenu__offerIcon } />
          { t('dating_advertising_title') }
        </span>
      </div>
    )
  }

  if (process.env.NEXT_PUBLIC_GAMES_AD_URL) {
    links.push(
      <div
        className={ styles.topMobileMenu__offerContainer }
        onClick={ () => handleClick(process.env.NEXT_PUBLIC_GAMES_AD_URL) }
        title={ t('games_advertising_title') }
        key={ t('games_advertising_title') }
      >
        <span className={ styles.topMobileMenu__offer }>
          <SlGameController className={ styles.topMobileMenu__offerIcon }/>
          { t('games_advertising_title') }
        </span>
      </div>
    )
  }

  if (process.env.NEXT_PUBLIC_IA_AD_URL) {
    links.push(
      <div
        className={ styles.topMobileMenu__offerContainer }
        onClick={ () => handleClick(process.env.NEXT_PUBLIC_IA_AD_URL) }
        title={ t('ia_advertising_title') }
        key={ t('ia_advertising_title') }
      >
        <span className={ styles.topMobileMenu__offer }>
          <MdOutlinePhotoSizeSelectActual className={ styles.topMobileMenu__offerIcon }/>
          { t('ia_advertising_title') }
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
