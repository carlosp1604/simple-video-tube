import styles from './PostOptions.module.scss'
import { FC, ReactElement, useState } from 'react'
import { BsChatSquareText, BsDownload, BsMegaphone } from 'react-icons/bs'
import { ReactionType } from '~/modules/Reactions/Infrastructure/ReactionType'
import { RxDividerVertical } from 'react-icons/rx'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import useTranslation from 'next-translate/useTranslation'
import { LikeButton } from '~/components/ReactionButton/LikeButton'
import { DislikeButton } from '~/components/ReactionButton/DislikeButton'
import { MediaUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'
import { MediaUrlsHelper } from '~/modules/Posts/Infrastructure/Frontend/MediaUrlsHelper'
import ReactGA from 'react-ga4'
import {
  ClickDownloadButtonAction,
  VideoPostCategory, DownloadVideoCompletedAction
} from '~/modules/Shared/Infrastructure/FrontEnd/AnalyticsEvents/PostPage'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { ReportModal } from '~/modules/Reports/Infrastructure/Components/ReportModal/ReportModal'

const DownloadMenu = dynamic(() => import(
  '~/modules/Posts/Infrastructure/Components/Post/DownloadMenu/DownloadMenu'
).then((module) => module.DownloadMenu), { ssr: false }
)

export interface Props {
  userReaction: ReactionComponentDto | null
  savedPost: boolean
  onClickReactButton: (type: ReactionType) => Promise<void>
  onClickCommentsButton: () => void
  likesNumber: number
  optionsDisabled: boolean
  downloadUrls: MediaUrlComponentDto[]
  enableDownloads: boolean
}

export const PostOptions: FC<Props> = ({
  userReaction,
  savedPost,
  onClickReactButton,
  onClickCommentsButton,
  likesNumber,
  optionsDisabled,
  downloadUrls,
  enableDownloads,
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [downloadMenuOpen, setDownloadMenuOpen] = useState<boolean>(false)
  const [reportMenuOpen, setReportMenuOpen] = useState<boolean>(false)
  const { pathname } = useRouter()

  const { t } = useTranslation('post')

  const onClickLikeDislike = async (reactionType: ReactionType) => {
    if (loading) {
      const toast = (await import('react-hot-toast')).default

      toast.error(t('action_cannot_be_performed_error_message'))

      return
    }

    setLoading(true)
    await onClickReactButton(reactionType)
    setLoading(false)
  }

  const onClickDownloadButton = async () => {
    if (downloadUrls.length > 0) {
      setDownloadMenuOpen(!downloadMenuOpen)

      return
    }
    const toast = (await import('react-hot-toast')).default

    toast.error(t('post_download_no_downloads_error_message'))
  }

  let downloadMenu: ReactElement | null = null
  let downloadButton: ReactElement | null = null

  if (enableDownloads) {
    downloadMenu = (
      <DownloadMenu
        mediaUrls={ MediaUrlsHelper.sortMediaUrl(downloadUrls) }
        setIsOpen={ setDownloadMenuOpen }
        isOpen={ downloadMenuOpen }
        onClickOption={ (mediaUrl: MediaUrlComponentDto) => {
          ReactGA.event({
            category: VideoPostCategory,
            action: DownloadVideoCompletedAction,
            label: mediaUrl.provider.name,
          })
        } }
      />
    )

    downloadButton = (
      <span
        className={ styles.postOptions__optionItem }
        onClick={ () => {
          ReactGA.event({
            category: VideoPostCategory,
            action: ClickDownloadButtonAction,
            label: pathname,
          })
          onClickDownloadButton()
        } }
      >
        <BsDownload className={ styles.postOptions__optionItemIcon }/>
        { t('post_download_button_title', { sourcesNumber: downloadUrls.length }) }
      </span>
    )
  }

  const reportMenu = (
    <ReportModal isOpen={ reportMenuOpen } onClose={ () => setReportMenuOpen(false) } />
  )

  return (
    <div className={ styles.postOptions__container }>
      { downloadMenu }
      { reportMenu }

      <span className={ `
        ${styles.postOptions__likeDislikeSection}
        ${loading || optionsDisabled ? styles.postOptions__likeDislikeSection_disabled : ''}
      ` }>
        <LikeButton
          liked={ userReaction !== null && userReaction.reactionType === ReactionType.LIKE }
          onLike={ () => onClickLikeDislike(ReactionType.LIKE) }
          onDeleteLike={ () => onClickLikeDislike(ReactionType.LIKE) }
          reactionsNumber={ likesNumber }
          disabled={ loading || optionsDisabled }
        />
        <RxDividerVertical className={ styles.postOptions__likeDislikeSeparator }/>
        <DislikeButton
          disliked={ userReaction !== null && userReaction.reactionType === ReactionType.DISLIKE }
          onDislike={ () => onClickLikeDislike(ReactionType.DISLIKE) }
          onDeleteDislike={ () => onClickLikeDislike(ReactionType.DISLIKE) }
          disabled={ loading || optionsDisabled }
        />
      </span>
      <span
        className={ styles.postOptions__optionItem }
        onClick={ onClickCommentsButton }
      >
        <BsChatSquareText className={ styles.postOptions__optionItemIcon }/>
        { t('post_comments_button_title') }
      </span>
      { downloadButton }
      <button onClick={ () => setReportMenuOpen(true) }>
        <BsMegaphone className={ styles.postOptions__optionItemIcon }/>
        { t('post_report_button_title') }
      </button>
    </div>
  )
}
