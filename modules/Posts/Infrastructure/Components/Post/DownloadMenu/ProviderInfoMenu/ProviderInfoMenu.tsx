import { FC, useMemo } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { MediaProviderComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaProviderComponentDto'
import styles from './ProviderInfoMenu.module.scss'
import Link from 'next/link'

interface Props {
  provider: MediaProviderComponentDto
}

export const ProviderInfoMenu: FC<Props> = ({ provider }) => {
  const { t } = useTranslation('post')

  const advertisingLevel = useMemo(() => {
    if (provider.advertisingLevel === 0) {
      return t('post_provider_modal_no_ads_response_title')
    }

    if (provider.advertisingLevel === 1) {
      return t('post_provider_modal_low_level_response_title')
    }

    if (provider.advertisingLevel === 2) {
      return t('post_provider_modal_medium_level_response_title')
    }

    if (provider.advertisingLevel === 3) {
      return t('post_provider_modal_high_level_response_title')
    }

    return t('post_provider_modal_high_level_with_pops_response_title')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider])

  const downloadSpeed = useMemo(() => {
    if (provider.downloadSpeed === 0) {
      return t('post_provider_modal_low_speed_response_title')
    }

    if (provider.advertisingLevel === 1) {
      return t('post_provider_modal_medium_speed_response_title')
    }

    if (provider.advertisingLevel === 2) {
      return t('post_provider_modal_high_speed_response_title')
    }

    return t('post_provider_modal_unlimited_response_title')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider])

  return (
    <div className={ styles.providerInfoMenu__container }>
      <span className={ styles.providerInfoMenu__title }>
        { provider.name }
      </span>

      <div className={ styles.providerInfoMenu__dataContainer }>
        <div className={ styles.providerInfoMenu__itemContainer }>
          { t('post_provider_modal_max_resolution_title') }
          <span className={ styles.providerInfoMenu__itemValue }>
            { t('post_provider_modal_max_resolution_response', { maxResolution: provider.maxResolution }) }
          </span>
        </div>

        <div className={ styles.providerInfoMenu__itemContainer }>
          { t('post_provider_modal_advertising_level_title') }
          <span className={ styles.providerInfoMenu__itemValue }>
            { advertisingLevel }
          </span>
        </div>

        <div className={ styles.providerInfoMenu__itemContainer }>
          { t('post_provider_modal_free_downloads_delay_title') }
          <span className={ styles.providerInfoMenu__itemValue }>
            { provider.freeDownloadsDay === 65635 ?
              t('post_provider_modal_unlimited_response_title')
              : provider.freeDownloadsDay
            }
          </span>
        </div>

        <div className={ styles.providerInfoMenu__itemContainer }>
          { t('post_provider_modal_download_speed_title') }
          <span className={ styles.providerInfoMenu__itemValue }>
            { downloadSpeed }
          </span>
        </div>

        <div className={ styles.providerInfoMenu__itemContainer }>
          { t('post_provider_modal_payment_required_title') }
          <span className={ styles.providerInfoMenu__itemValue }>
            { provider.paymentRequired
              ? t('post_provider_modal_yes_response_title')
              : t('post_provider_modal_no_response_title')
            }
          </span>
        </div>

        <div className={ styles.providerInfoMenu__itemContainer }>
          { t('post_provider_modal_delay_between_downloads_title') }
          <span className={ styles.providerInfoMenu__itemValue }>
            { provider.delayBetweenDownloads === 0
              ? t('post_provider_modal_no_response_title')
              : t('post_provider_modal_hours_delay_title', { hours: provider.delayBetweenDownloads }) }
          </span>
        </div>
      </div>

      {
        provider.refUrl
          ? <Link
            href={ provider.refUrl }
            className={ styles.providerInfoMenu__refButton }
            target={ '_blank' }
            rel={ 'nofollow' }
          >
            { t('post_provider_modal_create_account_button_title') }
          </Link>
          : null
      }
    </div>
  )
}
