import { FC, useState } from 'react'
import styles from './PostChildCommentWithOptions.module.scss'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import { CommentsApiService } from '~/modules/Posts/Infrastructure/Frontend/CommentsApiService'
import { APIException } from '~/modules/Shared/Infrastructure/FrontEnd/ApiException'
import useTranslation from 'next-translate/useTranslation'
import {
  ReactionComponentDtoTranslator
} from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDtoTranslator'
import { LikeButton } from '~/components/ReactionButton/LikeButton'
import { PostChildCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostChildCommentComponentDto'
import {
  PostChildCommentCard
} from '~/modules/Posts/Infrastructure/Components/PostChildComment/PostChildCommentCard/PostChildCommentCard'
import { useToast } from '~/components/AppToast/ToastContext'

interface Props {
  postId: string
  postChildComment: PostChildCommentComponentDto
  onDeletePostComment: (postCommentId: string) => void
  onClickLikeComment: (postId: string, userReaction: ReactionComponentDto | null, reactionsNumber: number) => void
  optionsDisabled: boolean
}

export const PostChildCommentWithOptions: FC<Props> = ({
  postId,
  postChildComment,
  onDeletePostComment,
  onClickLikeComment,
  optionsDisabled,
}) => {
  const [optionsMenuOpen, setOptionsMenuOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const { t } = useTranslation('post_comments')
  const { error, success } = useToast()

  const onClickDelete = async () => {
    if (optionsDisabled || loading) {
      error(t('action_cannot_be_performed_error_message'))

      return
    }

    setLoading(true)

    try {
      await new CommentsApiService().delete(postId, postChildComment.id, postChildComment.parentCommentId)
      onDeletePostComment(postChildComment.id)

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
    if (postChildComment.userReaction !== null) {
      error(t('post_comment_reaction_user_already_reacted'))

      return
    }

    if (optionsDisabled || loading) {
      error(t('action_cannot_be_performed_error_message'))

      return
    }

    setLoading(true)

    try {
      const reaction = await new CommentsApiService()
        .createPostChildCommentReaction(postChildComment.id, postChildComment.parentCommentId)

      const reactionComponent = ReactionComponentDtoTranslator.fromApplicationDto(reaction)

      const newCommentReactionsNumber = postChildComment.reactionsNumber + 1

      onClickLikeComment(
        postChildComment.id,
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
    if (postChildComment.userReaction === null) {
      error(t('post_comment_reaction_user_has_not_reacted'))

      return
    }

    if (optionsDisabled || loading) {
      error(t('action_cannot_be_performed_error_message'))

      return
    }

    setLoading(true)

    try {
      await new CommentsApiService()
        .deletePostChildCommentReaction(postChildComment.id, postChildComment.parentCommentId)

      const newCommentReactionsNumber = postChildComment.reactionsNumber - 1

      onClickLikeComment(postChildComment.id, null, newCommentReactionsNumber)

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
        ${styles.postChildCommentWithOptions__commentWithOptionsContainer}
        ${loading ? styles.postChildCommentWithOptions__commentWithOptionsContainer_loading : ''}
      ` }>
        <PostChildCommentCard postChildComment={ postChildComment } />
      </div>
      <div className={ styles.postChildCommentWithOptions__interactionSection }>
        <LikeButton
          liked={ postChildComment.userReaction !== null }
          onLike={ async () => { if (!optionsDisabled && !loading) { await onReact() } } }
          onDeleteLike={ async () => { if (!optionsDisabled && !loading) { await onDeleteReaction() } } }
          reactionsNumber={ postChildComment.reactionsNumber }
          disabled={ optionsDisabled || loading }
        />
      </div>
    </>
  )
}
