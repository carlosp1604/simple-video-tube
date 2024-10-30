import { FC, ReactElement, useEffect, useState } from 'react'
import styles from './ReactionButton.module.scss'
import useTranslation from 'next-translate/useTranslation'
import { AiOutlineDislike, AiOutlineLoading, AiTwotoneDislike } from 'react-icons/ai'
import { useToast } from '~/components/AppToast/ToastContext'
import { nanoid } from 'nanoid'
import { Tooltip } from '~/components/Tooltip/Tooltip'
import { NumberFormatter } from '~/modules/Shared/Infrastructure/FrontEnd/NumberFormatter'
import { useRouter } from 'next/router'
import { i18nConfig } from '~/i18n.config'

interface Props {
  disliked: boolean
  onDislike: () => Promise<void>
  onDeleteDislike: () => Promise<void>
  reactionsNumber: number
  disabled: boolean
}

export const DislikeButton: FC<Props> = ({ disliked, onDislike, onDeleteDislike, disabled, reactionsNumber }) => {
  const { t } = useTranslation('common')
  const { error } = useToast()
  const locale = useRouter().locale ?? i18nConfig.defaultLocale

  const [mounted, setMounted] = useState<boolean>(false)
  const [tooltipId, setTooltipId] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
    setTooltipId(nanoid())
  }, [])

  const onClickButton = async () => {
    if (loading || disabled) {
      error(t('action_cannot_be_performed_error_message'))

      return
    }

    setLoading(true)

    if (disliked) {
      await onDeleteDislike()
    } else {
      await onDislike()
    }

    setLoading(false)
  }

  let iconElement: ReactElement

  if (!loading) {
    if (disliked) {
      iconElement = (<AiTwotoneDislike className={ styles.reactionButton__dislikeIcon } />)
    } else {
      iconElement = (<AiOutlineDislike className={ styles.reactionButton__dislikeIcon } />)
    }
  } else {
    iconElement = (<AiOutlineLoading className={ styles.reactionButton__loadingIcon } />)
  }

  return (
    <div className={ `
      ${styles.reactionButton__container}
      ${disabled ? styles.reactionButton__container_disabled : ''}
    ` }>
      <button className={ `
        ${styles.reactionButton__reactionButton}
        ${disliked ? styles.reactionButton__dislikeButtonActive : ''}
      ` }
        disabled={ disabled }
        onClick={ onClickButton }
        data-tooltip-id={ tooltipId }
      >
        { iconElement }
      </button>
      { mounted && !disabled && !loading &&
        <Tooltip
          tooltipId={ tooltipId }
          place={ 'bottom' }
          content={ disliked ? t('dislike_reaction_active_title_button') : t('dislike_reaction_title_button') }
        />
      }
      { NumberFormatter.compatFormat(reactionsNumber, locale) }
    </div>
  )
}
