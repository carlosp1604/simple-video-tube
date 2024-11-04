import styles from './ReactionButton.module.scss'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'
import { nanoid } from 'nanoid'
import { useToast } from '~/components/AppToast/ToastContext'
import { useRouter } from 'next/router'
import { NumberFormatter } from '~/modules/Shared/Infrastructure/FrontEnd/NumberFormatter'
import { FC, ReactElement, useEffect, useState } from 'react'
import { AiOutlineLike, AiOutlineLoading, AiTwotoneLike } from 'react-icons/ai'

const Tooltip = dynamic(() =>
  import('~/components/Tooltip/Tooltip').then((module) => module.Tooltip), { ssr: false }
)

interface Props {
  liked: boolean
  onLike: () => Promise<void>
  onDeleteLike: () => Promise<void>
  reactionsNumber: number
  disabled: boolean
}

export const LikeButton: FC<Props> = ({ liked, onLike, onDeleteLike, reactionsNumber, disabled }) => {
  const { t } = useTranslation('common')
  let { locale } = useRouter()
  const { error } = useToast()

  const [mounted, setMounted] = useState<boolean>(false)
  const [tooltipId, setTooltipId] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
    setTooltipId(nanoid())
  }, [])

  locale = locale || 'en'

  const onClickButton = async () => {
    if (loading || disabled) {
      error(t('action_cannot_be_performed_error_message'))

      return
    }

    setLoading(true)

    if (liked) {
      await onDeleteLike()
    } else {
      await onLike()
    }

    setLoading(false)
  }

  let iconElement: ReactElement

  if (!loading) {
    if (liked) {
      iconElement = (
        <AiTwotoneLike className={ styles.reactionButton__reactionIcon }
         title={ t('like_reaction_active_title_button') }
        />
      )
    } else {
      iconElement = (
        <AiOutlineLike className={ styles.reactionButton__reactionIcon }
          title={ t('like_reaction_title_button') }
        />
      )
    }
  } else {
    iconElement = (<AiOutlineLoading className={ styles.reactionButton__loadingIcon } />)
  }

  return (
    <div
      className={ `${styles.reactionButton__container} ${disabled ? styles.reactionButton__container_disabled : ''}` }
    >
      <button
        className={ `${styles.reactionButton__reactionButton} ${liked ? styles.reactionButton__likeButtonActive : ''}` }
        data-tooltip-id={ tooltipId }
        disabled={ disabled }
        onClick={ onClickButton }
      >
        { iconElement }
      </button>
      { mounted && !disabled && !loading &&
        <Tooltip
          tooltipId={ tooltipId }
          place={ 'top' }
          content={ liked ? t('like_reaction_active_title_button') : t('like_reaction_title_button') }
        /> }
      { NumberFormatter.compatFormat(reactionsNumber, locale) }
    </div>
  )
}
