import { FC, useState } from 'react'
import styles from './PostCommentWithOptions.module.scss'
import { PostCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCommentComponentDto'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import { PostCommentCard } from '~/modules/Posts/Infrastructure/Components/PostComment/PostCommentCard/PostCommentCard'
import { CommentsApiService } from '~/modules/Posts/Infrastructure/Frontend/CommentsApiService'
import { APIException } from '~/modules/Shared/Infrastructure/FrontEnd/ApiException'
import useTranslation from 'next-translate/useTranslation'
import {
  ReactionComponentDtoTranslator
} from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDtoTranslator'
import { NumberFormatter } from '~/modules/Shared/Infrastructure/FrontEnd/NumberFormatter'
import { LikeButton } from '~/components/ReactionButton/LikeButton'
import { useRouter } from 'next/router'
import { useToast } from '~/components/AppToast/ToastContext'

interface Props {
  postComment: PostCommentComponentDto
  onDeletePostComment: ((postCommentId: string) => void) | undefined
  onClickReply: ((comment: PostCommentComponentDto) => void) | undefined
  onClickLikeComment: (postId: string, userReaction: ReactionComponentDto | null, reactionsNumber: number) => void
  optionsDisabled: boolean
  showOptions: boolean
}

export const PostCommentWithOptions: FC<Props> = ({
  postComment,
  onDeletePostComment,
  onClickReply,
  onClickLikeComment,
  optionsDisabled,
  showOptions,
}) => {
  const [optionsMenuOpen, setOptionsMenuOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const locale = useRouter().locale ?? 'en'

  const { t } = useTranslation('post_comments')
  const { success, error } = useToast()

  const onClickDelete = async () => {
    if (!onDeletePostComment) {
      return
    }

    if (optionsDisabled || loading) {
      error(t('action_cannot_be_performed_error_message'))

      return
    }

    setLoading(true)

    try {
      await new CommentsApiService().delete(postComment.postId, postComment.id, null)
      onDeletePostComment(postComment.id)

      success(t('post_comment_deleted_success_message'))
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

  const onReact = async () => {
    if (postComment.userReaction !== null) {
      error(t('post_comment_reaction_user_already_reacted'))

      return
    }

    if (optionsDisabled || loading) {
      error(t('action_cannot_be_performed_error_message'))

      return
    }

    setLoading(true)

    try {
      const reaction = await new CommentsApiService().createPostCommentReaction(postComment.id)

      const reactionComponent = ReactionComponentDtoTranslator.fromApplicationDto(reaction)

      const newCommentReactionsNumber = postComment.reactionsNumber + 1

      onClickLikeComment(
        postComment.id,
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

  const onDeleteReaction = async () => {
    if (postComment.userReaction === null) {
      error(t('post_comment_reaction_user_has_not_reacted'))

      return
    }

    if (optionsDisabled || loading) {
      error(t('action_cannot_be_performed_error_message'))

      return
    }

    setLoading(true)

    try {
      await new CommentsApiService().deletePostCommentReaction(postComment.id)

      const newCommentReactionsNumber = postComment.reactionsNumber - 1

      onClickLikeComment(postComment.id, null, newCommentReactionsNumber)

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

  return (
    <>
      <div className={ `
        ${styles.postCommentWithOptions__commentWithOptionsContainer}
        ${loading ? styles.postCommentWithOptions__commentWithOptionsContainer_loading : ''}
      ` }>
        <PostCommentCard
          key={ postComment.id }
          postComment={ postComment }
        />
      </div>
      <div className={ styles.postCommentWithOptions__interactionSectionContainer }>
        <button className={ `
          ${styles.postCommentWithOptions__repliesButton}
          ${onClickReply ? styles.postCommentWithOptions__repliesButton_actionable : ''} 
        ` }
          onClick={ () => { if (onClickReply) { onClickReply(postComment) } } }
          disabled={ optionsDisabled || loading }
        >
          { postComment.repliesNumber === 0 && onClickReply
            ? t('comment_reply_button')
            : t('comment_replies_button', { replies: NumberFormatter.compatFormat(postComment.repliesNumber, locale) })
          }
        </button>
        <LikeButton
          liked={ postComment.userReaction !== null }
          onLike={ async () => { if (!optionsDisabled && !loading) { await onReact() } } }
          onDeleteLike={ async () => { if (!optionsDisabled && !loading) { await onDeleteReaction() } } }
          reactionsNumber={ postComment.reactionsNumber }
          disabled={ optionsDisabled || loading }
        />
      </div>
    </>
  )
}
