import { FC, ReactElement, useState } from 'react'
import styles from './PostCommentWithOptions.module.scss'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import { APIException } from '~/modules/Shared/Infrastructure/FrontEnd/ApiException'
import useTranslation from 'next-translate/useTranslation'
import { LikeButton } from '~/components/ReactionButton/LikeButton'
import { PostChildCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostChildCommentComponentDto'
import { useToast } from '~/components/AppToast/ToastContext'
import { PostCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCommentComponentDto'
import { PostCommentCard } from '~/modules/Posts/Infrastructure/Components/PostComment/PostCommentCard/PostCommentCard'
import { NumberFormatter } from '~/modules/Shared/Infrastructure/FrontEnd/NumberFormatter'
import { useRouter } from 'next/router'
import { i18nConfig } from '~/i18n.config'

interface PostCommentProps {
  postChildComment: PostChildCommentComponentDto
  onClickLikeComment: (postId: string, userReaction: ReactionComponentDto | null, reactionsNumber: number) => void
  optionsDisabled: boolean
}

interface PostChildCommentProps {
  postComment: PostCommentComponentDto
  onClickReply: ((comment: PostCommentComponentDto) => void) | undefined
  onClickLikeComment: (postId: string, userReaction: ReactionComponentDto | null, reactionsNumber: number) => void
  optionsDisabled: boolean
}

export const PostCommentWithOptions: FC<PostCommentProps | PostChildCommentProps> = (props) => {
  const [loading, setLoading] = useState<boolean>(false)

  const { t } = useTranslation('post_comments')
  const { error, success } = useToast()

  const locale = useRouter().locale ?? i18nConfig.defaultLocale

  const onReact = async (
    comment: PostChildCommentComponentDto | PostCommentComponentDto,
    optionsDisabled: boolean,
    onClickLikeComment: (postId: string, userReaction: ReactionComponentDto | null, reactionsNumber: number) => void
  ) => {
    if (comment.userReaction !== null) {
      error(t('post_comment_reaction_user_already_reacted'))

      return
    }

    if (optionsDisabled || loading) {
      error(t('action_cannot_be_performed_error_message'))

      return
    }

    setLoading(true)

    try {
      const CommentsApiService =
        (await import('~/modules/Posts/Infrastructure/Frontend/CommentsApiService')).CommentsApiService

      let reactionComponent

      if ('parentCommentId' in comment) {
        reactionComponent = await new CommentsApiService()
          .createPostChildCommentReaction(comment.id, comment.parentCommentId)
      } else {
        reactionComponent = await new CommentsApiService().createPostCommentReaction(comment.id)
      }

      const newCommentReactionsNumber = comment.reactionsNumber + 1

      onClickLikeComment(
        comment.id,
        reactionComponent,
        newCommentReactionsNumber
      )

      success(t('post_comment_reaction_reaction_added_successfully'))
    } catch (exception: unknown) {
      if (!(exception instanceof APIException)) {
        console.error(exception)

        return
      }

      error(t(`api_exceptions:${exception.translationKey}`))
    } finally {
      setLoading(false)
    }
  }

  const onDeleteReaction = async (
    comment: PostChildCommentComponentDto | PostCommentComponentDto,
    optionsDisabled: boolean,
    onClickLikeComment: (postId: string, userReaction: ReactionComponentDto | null, reactionsNumber: number) => void
  ) => {
    if (comment.userReaction === null) {
      error(t('post_comment_reaction_user_has_not_reacted'))

      return
    }

    if (optionsDisabled || loading) {
      error(t('action_cannot_be_performed_error_message'))

      return
    }

    setLoading(true)

    try {
      const CommentsApiService =
        (await import('~/modules/Posts/Infrastructure/Frontend/CommentsApiService')).CommentsApiService

      if ('parentCommentId' in comment) {
        await new CommentsApiService()
          .deletePostChildCommentReaction(comment.id, comment.parentCommentId)
      } else {
        await new CommentsApiService().deletePostCommentReaction(comment.id)
      }

      const newCommentReactionsNumber = comment.reactionsNumber - 1

      onClickLikeComment(comment.id, null, newCommentReactionsNumber)

      success(t('post_comment_reaction_reaction_removed_successfully'))
    } catch (exception: unknown) {
      if (!(exception instanceof APIException)) {
        console.error(exception)

        return
      }

      error(t(`api_exceptions:${exception.translationKey}`))
    } finally {
      setLoading(false)
    }
  }

  let replySection: ReactElement | null = null
  let likeButton: ReactElement | null = null
  let postCommentCard: ReactElement | null = null

  if ('postComment' in props) {
    replySection = (
      <button className={ `
        ${styles.postCommentWithOptions__repliesButton}
        ${props.onClickReply ? styles.postCommentWithOptions__repliesButton_actionable : ''} 
      ` }
        onClick={ () => {
          if (props.onClickReply) {
            props.onClickReply(props.postComment)
          }
        } }
        disabled={ props.optionsDisabled || loading }
      >
        { props.postComment.repliesNumber === 0 && props.onClickReply
          ? t('comment_reply_button')
          : t('comment_replies_button',
            { replies: NumberFormatter.compatFormat(props.postComment.repliesNumber, locale) })
        }
      </button>
    )

    likeButton = (
      <LikeButton
        liked={ props.postComment.userReaction !== null }
        onLike={ async () => {
          if (!props.optionsDisabled && !loading) {
            await onReact(props.postComment, props.optionsDisabled, props.onClickLikeComment)
          }
        } }
        onDeleteLike={ async () => {
          if (!props.optionsDisabled && !loading) {
            await onDeleteReaction(props.postComment, props.optionsDisabled, props.onClickLikeComment)
          }
        } }
        reactionsNumber={ props.postComment.reactionsNumber }
        disabled={ props.optionsDisabled || loading }
      />
    )

    postCommentCard = (<PostCommentCard postComment={ props.postComment }/>)
  }

  if ('postChildComment' in props) {
    likeButton = (
      <LikeButton
        liked={ props.postChildComment.userReaction !== null }
        onLike={ async () => {
          if (!props.optionsDisabled && !loading) {
            await onReact(props.postChildComment, props.optionsDisabled, props.onClickLikeComment)
          }
        } }
        onDeleteLike={ async () => {
          if (!props.optionsDisabled && !loading) {
            await onDeleteReaction(props.postChildComment, props.optionsDisabled, props.onClickLikeComment)
          }
        } }
        reactionsNumber={ props.postChildComment.reactionsNumber }
        disabled={ props.optionsDisabled || loading }
      />
    )

    postCommentCard = (<PostCommentCard postComment={ props.postChildComment } />)
  }

  return (
    <>
      <div className={ `
        ${styles.postCommentWithOptions__commentWithOptionsContainer}
        ${loading ? styles.postCommentWithOptions__commentWithOptionsContainer_loading : ''}
      ` }>
        { postCommentCard }
      </div>
      <div className={ styles.postCommentWithOptions__interactionSectionContainer }>
        { replySection }
        { likeButton }
      </div>
    </>
  )
}
