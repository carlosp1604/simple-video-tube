import { FC, useState } from 'react'
import styles from './PostChildCommentInteractionSection.module.scss'
import { useTranslation } from 'next-i18next'
import { BiLike, BiSolidLike } from 'react-icons/bi'
import { CommentsApiService } from '~/modules/Posts/Infrastructure/Frontend/CommentsApiService'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import toast from 'react-hot-toast'
import {
  ReactionComponentDtoTranslator
} from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDtoTranslator'
import { PostChildCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostChildCommentComponentDto'
import { NumberFormatter } from '~/modules/Posts/Infrastructure/Frontend/NumberFormatter'
import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react'
import * as uuid from 'uuid'
import { Tooltip } from 'react-tooltip'
import {
  POST_COMMENT_REACTION_NOT_FOUND,
  POST_COMMENT_REACTION_POST_COMMENT_NOT_FOUND,
  POST_COMMENT_REACTION_USER_ALREADY_REACTED,
  POST_COMMENT_REACTION_USER_NOT_FOUND
} from '~/modules/Posts/Infrastructure/Api/PostApiExceptionCodes'

interface Props {
  postChildComment: PostChildCommentComponentDto
}

export const PostChildCommentInteractionSection: FC<Props> = ({ postChildComment }) => {
  const { t } = useTranslation('post_comments')
  const [userReaction, setUserReaction] = useState<ReactionComponentDto | null>(postChildComment.userReaction)
  const [commentReactions, setCommentReactions] = useState<number>(postChildComment.reactionsNumber)

  const apiService = new CommentsApiService()
  const { status } = useSession()
  let { locale } = useRouter()

  locale = locale || 'en'
  const tooltipUuid = uuid.v4()

  const onReact = async () => {
    if (status !== 'authenticated') {
      toast.error(t('user_must_be_authenticated_error_message'))

      return
    }

    if (userReaction !== null) {
      toast.error(t('post_comment_reaction_user_already_reacted'))

      return
    }
    try {
      const response = await apiService.createPostChildCommentReaction(
        postChildComment.id, postChildComment.parentCommentId
      )

      if (response.ok) {
        const reaction = await response.json()

        // When a comment is created it does not have replies or reactions
        const reactionComponent = ReactionComponentDtoTranslator.fromApplicationDto(reaction)

        setUserReaction(reactionComponent)
        setCommentReactions(commentReactions + 1)

        toast.success(t('post_comment_reaction_reaction_added_successfully'))

        return
      }

      switch (response.status) {
        case 400:
          toast.error(t('bad_request_error_message'))
          break

        case 404: {
          const jsonResponse = await response.json()

          switch (jsonResponse.code) {
            case POST_COMMENT_REACTION_USER_NOT_FOUND: {
              toast.error(t('post_user_not_found_error_message'))

              await signOut({ redirect: false })

              break
            }

            case POST_COMMENT_REACTION_POST_COMMENT_NOT_FOUND:
              toast.error(t('post_comment_reaction_post_comment_not_found_error_message'))
              break

            case POST_COMMENT_REACTION_USER_ALREADY_REACTED:
              toast.error(t('user_already_reacted_to_post_comment_error_message'))
              break

            default:
              toast.error(t('server_error_error_message'))
              break
          }
          break
        }

        case 409:
          toast.error(t('post_comment_reaction_post_comment_not_found_error_message'))
          break

        default:
          toast.error(t('server_error_error_message'))
          break
      }
    } catch (exception: unknown) {
      console.error(exception)
      toast.error(t('server_error_error_message'))
    }
  }

  const onDeleteReaction = async () => {
    if (status !== 'authenticated') {
      toast.error(t('user_must_be_authenticated_error_message'))

      return
    }

    if (userReaction === null) {
      toast.error(t('post_comment_reaction_user_has_not_reacted'))

      return
    }

    try {
      const response = await apiService.deletePostChildCommentReaction(
        postChildComment.id, postChildComment.parentCommentId
      )

      if (response.ok) {
        setUserReaction(null)
        setCommentReactions(commentReactions - 1)

        toast.success(t('post_comment_reaction_reaction_removed_successfully'))

        return
      }

      switch (response.status) {
        case 400:
          toast.error(t('bad_request_error_message'))
          break

        case 404: {
          const jsonResponse = await response.json()

          switch (jsonResponse.code) {
            case POST_COMMENT_REACTION_USER_NOT_FOUND: {
              toast.error(t('post_user_not_found_error_message'))

              await signOut({ redirect: false })

              break
            }

            case POST_COMMENT_REACTION_POST_COMMENT_NOT_FOUND:
              toast.error(t('post_comment_reaction_post_comment_not_found_error_message'))
              break

            case POST_COMMENT_REACTION_NOT_FOUND:
              toast.error(t('post_comment_reaction_not_found_error_message'))
              break

            default:
              toast.error(t('server_error_error_message'))
              break
          }
          break
        }

        case 409:
          toast.error(t('post_comment_reaction_user_already_reacted'))
          break

        default:
          toast.error(t('server_error_error_message'))
          break
      }
    } catch (exception: unknown) {
      console.error(exception)
      toast.error(t('server_error_error_message'))
    }
  }

  return (
    <div className={ styles.postCommentInteractionSection__container }>
      <div className={ styles.postCommentInteractionSection__likeSection }>
        { userReaction !== null
          ? <BiSolidLike className={ `
              ${styles.postCommentInteractionSection__likeIcon}
              ${styles.postCommentInteractionSection__likeIcon_active}
             ` }
              onClick={ () => onDeleteReaction() }
              data-tooltip-id={ tooltipUuid }
              data-tooltip-content={ t('post_comment_reaction_active_button_title') }
            />
          : <BiLike
              className={ styles.postCommentInteractionSection__likeIcon }
              onClick={ () => onReact() }
              data-tooltip-id={ tooltipUuid }
              data-tooltip-content={ t('post_comment_reaction_button_title') }
            />
        }
        <Tooltip id={ tooltipUuid } />
        { NumberFormatter.compatFormat(commentReactions, locale) }
      </div>
    </div>
  )
}
