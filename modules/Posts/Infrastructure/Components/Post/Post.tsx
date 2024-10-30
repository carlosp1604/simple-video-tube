import styles from './Post.module.scss'
import { FC, ReactElement, useEffect, useRef, useState } from 'react'
import { PostComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import { ReactionType } from '~/modules/Reactions/Infrastructure/ReactionType'
import { PostData } from '~/modules/Posts/Infrastructure/Components/Post/PostData/PostData'
import { Banner } from '~/modules/Shared/Infrastructure/Components/Banner/Banner'
import { DesktopBanner } from '~/modules/Shared/Infrastructure/Components/ExoclickBanner/DesktopBanner'
import { OutstreamBanner } from '~/modules/Shared/Infrastructure/Components/ExoclickBanner/OutstreamBanner'
import dynamic from 'next/dynamic'
import { VideoPostType } from '~/modules/Posts/Infrastructure/Components/Post/VideoPostType/VideoPostType'
import { APIException } from '~/modules/Shared/Infrastructure/FrontEnd/ApiException'
import { useToast } from '~/components/AppToast/ToastContext'
import useTranslation from 'next-translate/useTranslation'

const PostComments = dynamic(() =>
  import('~/modules/Posts/Infrastructure/Components/PostComment/PostComments/PostComments')
    .then((module) => module.PostComments),
{ ssr: false })

export interface Props {
  post: PostComponentDto
  postViewsNumber: number
  postLikes: number
  postDislikes: number
  postCommentsNumber: number
}

export const Post: FC<Props> = ({
  post,
  postViewsNumber,
  postLikes,
  postDislikes,
  postCommentsNumber,
}) => {
  const [likesNumber, setLikesNumber] = useState<number>(postLikes)
  const [dislikesNumber, setDislikesNumber] = useState<number>(postDislikes)
  const [viewsNumber, setViewsNumber] = useState<number>(postViewsNumber)
  const [userReaction, setUserReaction] = useState<ReactionComponentDto | null>(null)
  const [commentsOpen, setCommentsOpen] = useState<boolean>(false)
  const [commentsNumber, setCommentsNumber] = useState<number>(postCommentsNumber)
  const [optionsDisabled, setOptionsDisabled] = useState<boolean>(true)

  const commentsRef = useRef<HTMLDivElement>(null)

  const { success, error } = useToast()
  const { t } = useTranslation('post')

  useEffect(() => {
    import('~/modules/Posts/Infrastructure/Frontend/PostsApiService').then((module) => {
      const PostsApiService = module.PostsApiService

      const postsApiService = new PostsApiService()

      postsApiService.addPostView(post.id)
        .then((response) => {
          if (response.ok) {
            setViewsNumber(viewsNumber + 1)
          }
        })
        .catch((exception) => console.error(exception))

      postsApiService.getPostUserInteraction(post.id)
        .then(async (reactionComponent) => {
          setUserReaction(reactionComponent)
        })
        .catch((exception) => {
          console.error(exception)
        })
        .finally(() => { setOptionsDisabled(false) })
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  let commentsComponent: ReactElement | null = null

  if (commentsOpen) {
    commentsComponent = (
      <PostComments
        key={ post.id }
        postId={ post.id }
        setIsOpen={ setCommentsOpen }
        setCommentsNumber={ setCommentsNumber }
        commentsNumber={ commentsNumber }
      />
    )
  }

  const onClickCommentsButton = () => {
    const currentValue = commentsOpen

    setCommentsOpen(!commentsOpen)

    if (!currentValue) {
      commentsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const onClickReactButton = async (type: ReactionType) => {
    const PostsApiService =
      (await import('~/modules/Posts/Infrastructure/Frontend/PostsApiService')).PostsApiService

    const postsApiService = new PostsApiService()

    if (userReaction !== null && userReaction.reactionType === type) {
      try {
        await postsApiService.deletePostReaction(post.id)

        if (userReaction.reactionType === ReactionType.LIKE) {
          setLikesNumber(likesNumber - 1)
        } else {
          setDislikesNumber(dislikesNumber - 1)
        }
        setUserReaction(null)

        success(t('post_reaction_deleted_correctly_message'))
      } catch (exception: unknown) {
        if (!(exception instanceof APIException)) {
          error(t('api_exceptions:something_went_wrong_error_message'))

          console.error(exception)

          return
        }

        error(t(`api_exceptions:${exception.translationKey}`))
      }
    } else {
      try {
        const userPostReaction = await postsApiService.createPostReaction(post.id, type)

        if (userReaction !== null) {
          if (userPostReaction.reactionType === ReactionType.LIKE) {
            setLikesNumber(likesNumber + 1)
            setDislikesNumber(dislikesNumber - 1)
          } else {
            setLikesNumber(likesNumber - 1)
            setDislikesNumber(dislikesNumber + 1)
          }
        } else {
          if (userPostReaction.reactionType === ReactionType.LIKE) {
            setLikesNumber(likesNumber + 1)
          } else {
            setDislikesNumber(dislikesNumber + 1)
          }
        }

        setUserReaction(userPostReaction)

        success(t('post_reaction_added_correctly_message'))
      } catch (exception: unknown) {
        if (!(exception instanceof APIException)) {
          error(t('api_exceptions:something_went_wrong_error_message'))

          console.error(exception)

          return
        }

        error(t(`api_exceptions:${exception.translationKey}`))
      }
    }
  }

  return (
    <div className={ styles.post__container }>
      <section className={ styles.post__postWithAds }>
        <div className={ styles.post__leftContainer }>
          <VideoPostType
            post={ post }
            userReaction={ userReaction }
            onClickReactButton={ async (type) => await onClickReactButton(type) }
            onClickCommentsButton={ onClickCommentsButton }
            likesNumber={ likesNumber }
            dislikesNumber={ dislikesNumber }
            optionsDisabled={ optionsDisabled }
            postCommentsNumber={ postCommentsNumber }
          />

          <PostData
            producer={ post.producer }
            actor={ post.actor }
            postActors={ post.actors }
            categories={ post.categories }
            postDescription={ post.description }
            date={ post.formattedPublishedAt }
            viewsNumber={ viewsNumber }
          />
        </div>

        <div className={ styles.post__rightContainer }>
          <span className={ styles.post__rightContainerItem }>
            <Banner />
          </span>
          <span className={ styles.post__rightContainerItem }>
            <OutstreamBanner />
          </span>
          <span className={ styles.post__rightContainerItemHiddenMobile }>
            <DesktopBanner />
          </span>
        </div>
      </section>
      <div ref={ commentsRef }>
        { commentsComponent }
      </div>
    </div>
  )
}
