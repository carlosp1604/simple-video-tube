import { FC, ReactNode, useMemo, useRef, useState } from 'react'
import { PostComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'
import { VideoPostPlayer } from '~/modules/Posts/Infrastructure/Components/Post/VideoPostPlayer/VideoPostPlayer'
import styles from './VideoPostType.module.scss'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import { ReactionType } from '~/modules/Reactions/Infrastructure/ReactionType'
import { PostOptions } from '~/modules/Posts/Infrastructure/Components/Post/PostOptions/PostOptions'
import { MediaUrlsHelper } from '~/modules/Posts/Infrastructure/Frontend/MediaUrlsHelper'
import useTranslation from 'next-translate/useTranslation'
import { BsFileEarmarkBreak } from 'react-icons/bs'

export interface Props {
  post: PostComponentDto
  userReaction: ReactionComponentDto | null
  onClickReactButton: (type: ReactionType) => Promise<void>
  onClickCommentsButton: () => void
  likesNumber: number
  dislikesNumber: number
  optionsDisabled: boolean
  postCommentsNumber: number
}

export const VideoPostType: FC<Props> = ({
  post,
  userReaction,
  onClickReactButton,
  onClickCommentsButton,
  likesNumber,
  dislikesNumber,
  optionsDisabled,
  postCommentsNumber,
}) => {
  const { t } = useTranslation('post')

  const [sourcesMenuOpen, setSourcesMenuOpen] = useState<boolean>(false)
  const playerRef = useRef<HTMLDivElement>(null)

  const downloadUrls = useMemo(() => {
    return MediaUrlsHelper.getVideoDownloadUrl(post.postMediaVideoType, post.postMediaEmbedType)
  }, [post.postMediaVideoType, post.postMediaEmbedType])

  const selectableUrls = useMemo(() => {
    return MediaUrlsHelper.getSelectableUrls(post.postMediaEmbedType, post.postMediaVideoType)
  }, [post.postMediaEmbedType, post.postMediaVideoType])

  let player: ReactNode = (
    <div className={ styles.videoPostType__noSourcesState }>
      <BsFileEarmarkBreak className={ styles.videoPostType__noSourcesStateIcon }/>
      { t('post_video_no_sources_error_message') }
    </div>
  )

  if (selectableUrls.length > 0) {
    player = (
      <VideoPostPlayer
        title={ t('post_player_title', { postName: post.title }) }
        selectableUrls={ selectableUrls }
        sourcesMenuOpen={ sourcesMenuOpen }
        onCloseSourceMenu={ () => setSourcesMenuOpen(false) }
      />
    )
  }

  return (
    <>
      <div
        className={ styles.videoPostType__videoContainer }
        ref={ playerRef }
      >
        { player }
      </div>

      <h1 className={ styles.videoPostType__postTitle } key={ post.id }>
        { post.title }
      </h1>

      <PostOptions
        postId={ post.id }
        userReaction={ userReaction }
        onClickReactButton={ async (type) => await onClickReactButton(type) }
        onClickCommentsButton={ onClickCommentsButton }
        likesNumber={ likesNumber }
        dislikesNumber={ dislikesNumber }
        optionsDisabled={ optionsDisabled }
        downloadUrls={ downloadUrls }
        enableDownloads={ true }
        postCommentsNumber={ postCommentsNumber }
        onClickSourcesButton={ () => {
          if (!sourcesMenuOpen && playerRef.current) {
            playerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
          setSourcesMenuOpen(!sourcesMenuOpen)
        } }
        sourcesNumber={ selectableUrls.length }
      />
    </>
  )
}
