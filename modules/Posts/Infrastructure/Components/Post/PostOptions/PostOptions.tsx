import styles from './PostOptions.module.scss'
import { FC, ReactElement, useState } from 'react'
import { BsGearWide } from 'react-icons/bs'
import { ReactionType } from '~/modules/Reactions/Infrastructure/ReactionType'
import { RxDividerVertical } from 'react-icons/rx'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import useTranslation from 'next-translate/useTranslation'
import { LikeButton } from '~/components/ReactionButton/LikeButton'
import { DislikeButton } from '~/components/ReactionButton/DislikeButton'
import { MediaUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'
import { MediaUrlsHelper } from '~/modules/Posts/Infrastructure/Frontend/MediaUrlsHelper'
import { sendGAEvent } from '@next/third-parties/google'
import {
  ClickDownloadButtonAction,
  VideoPostCategory, DownloadVideoCompletedAction
} from '~/modules/Shared/Infrastructure/FrontEnd/AnalyticsEvents/PostPage'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { useToast } from '~/components/AppToast/ToastContext'
import { MdFileDownload, MdOutlineFlag } from 'react-icons/md'
import { PiChatsDuotone } from 'react-icons/pi'

const DownloadMenu = dynamic(() => import(
  '~/modules/Posts/Infrastructure/Components/Post/DownloadMenu/DownloadMenu'
).then((module) => module.DownloadMenu), { ssr: false })

const ReportModal = dynamic(() => import(
  '~/modules/Reports/Infrastructure/Components/ReportModal/ReportModal'
).then((module) => module.ReportModal), { ssr: false })

export interface Props {
  postId: string
  userReaction: ReactionComponentDto | null
  onClickReactButton: (type: ReactionType) => Promise<void>
  onClickCommentsButton: () => void
  onClickSourcesButton: () => void
  likesNumber: number
  dislikesNumber: number
  optionsDisabled: boolean
  downloadUrls: MediaUrlComponentDto[]
  enableDownloads: boolean
  sourcesNumber: number
  postCommentsNumber: number
}

export const PostOptions: FC<Props> = ({
  postId,
  userReaction,
  onClickReactButton,
  onClickCommentsButton,
  onClickSourcesButton,
  likesNumber,
  dislikesNumber,
  optionsDisabled,
  downloadUrls,
  enableDownloads,
  sourcesNumber,
  postCommentsNumber,
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [downloadMenuOpen, setDownloadMenuOpen] = useState<boolean>(false)
  const [reportMenuOpen, setReportMenuOpen] = useState<boolean>(false)
  const { pathname } = useRouter()

  const { t } = useTranslation('post')
  const { error } = useToast()

  const onClickLikeDislike = async (reactionType: ReactionType) => {
    if (loading) {
      error(t('action_cannot_be_performed_error_message'))

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

    error(t('post_download_no_downloads_error_message'))
  }

  let downloadMenu: ReactElement | null = null
  let downloadButton: ReactElement | null = null
  let sourcesButton: ReactElement | null = null

  if (enableDownloads) {
    downloadMenu = (
      <DownloadMenu
        mediaUrls={ MediaUrlsHelper.sortMediaUrl(downloadUrls) }
        setIsOpen={ setDownloadMenuOpen }
        isOpen={ downloadMenuOpen }
        onClickOption={ (mediaUrl: MediaUrlComponentDto) => {
          sendGAEvent('event', DownloadVideoCompletedAction, {
            category: VideoPostCategory,
            label: mediaUrl.provider.name,
          })
        } }
      />
    )

    downloadButton = (
      <span
        className={ styles.postOptions__optionItem }
        onClick={ async () => {
          sendGAEvent('event', ClickDownloadButtonAction, {
            category: VideoPostCategory,
            label: pathname,
          })
          await onClickDownloadButton()
        } }
      >
        <MdFileDownload className={ styles.postOptions__optionItemIcon }/>
        { t('post_download_button_title') }
        <span className={ styles.postOptions__optionItemQuantity }>
          { downloadUrls.length }
        </span>
      </span>
    )
  }

  if (sourcesNumber > 1) {
    sourcesButton = (
      <button
        className={ styles.postOptions__optionItem }
        onClick={ onClickSourcesButton }
      >
        <BsGearWide className={ styles.postOptions__optionItemIcon }/>
        { t('post_sources_button_title') }
        <span className={ styles.postOptions__optionItemQuantity }>
          { sourcesNumber }
        </span>
      </button>
    )
  }

  return (
    <div className={ styles.postOptions__container }>
      { downloadMenu }
      <ReportModal
        postId={ postId }
        isOpen={ reportMenuOpen }
        onClose={ () => setReportMenuOpen(false) }
      />

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
          reactionsNumber={ dislikesNumber }
        />
      </span>
      { sourcesButton }
      <button
        className={ styles.postOptions__optionItem }
        onClick={ onClickCommentsButton }
      >
        <PiChatsDuotone className={ styles.postOptions__optionItemIcon }/>
        { t('post_comments_button_title') }
        <span className={ styles.postOptions__optionItemQuantity }>
          { postCommentsNumber }
        </span>
      </button>
      { downloadButton }
      <button
        className={ styles.postOptions__optionItem }
        onClick={ () => setReportMenuOpen(true) }>
        <MdOutlineFlag className={ styles.postOptions__optionItemIcon }/>
        { t('post_report_button_title') }
      </button>
    </div>
  )
}
