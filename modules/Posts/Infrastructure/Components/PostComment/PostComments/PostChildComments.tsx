import { useRouter } from 'next/router'
import { FC, useEffect, useRef, useState } from 'react'
import { BsArrowLeftShort, BsX } from 'react-icons/bs'
import styles from './PostComments.module.scss'
import { PostCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCommentComponentDto'
import { PostChildCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostChildCommentComponentDto'
import useTranslation from 'next-translate/useTranslation'
import { AddCommentInput } from '~/modules/Posts/Infrastructure/Components/AddCommentInput/AddCommentInput'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import { APIException } from '~/modules/Shared/Infrastructure/FrontEnd/ApiException'
import { defaultPerPage, PaginationHelper } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { useToast } from '~/components/AppToast/ToastContext'
import { IconButton } from '~/components/IconButton/IconButton'
import { PostCommentList } from '~/modules/Posts/Infrastructure/Components/PostComment/PostCommentList/PostCommentList'
import { i18nConfig } from '~/i18n.config'

interface Props {
  commentToReply: PostCommentComponentDto
  onClickClose: () => void
  onClickRetry: () => void
  onAddReply: (repliesNumber: number | null) => void
  onClickLikeComment: (postId: string, userReaction: ReactionComponentDto | null, reactionsNumber: number) => void
}

export const PostChildComments: FC<Props> = ({
  commentToReply,
  onClickClose,
  onClickRetry,
  onAddReply,
  onClickLikeComment,
}) => {
  const [replies, setReplies] = useState<PostChildCommentComponentDto[]>([])
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [canLoadMore, setCanLoadMore] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [creatingChildComment, setCreatingChildComment] = useState<boolean>(false)

  const repliesAreaRef = useRef<HTMLDivElement>(null)

  const { t } = useTranslation('post_comments')
  const { error, success } = useToast()

  const router = useRouter()
  const locale = router.locale ?? i18nConfig.defaultLocale

  const createReply = async (userName: string, comment: string) => {
    if (comment === '') {
      error(t('empty_comment_is_not_allowed_error_message'))

      return
    }

    if (userName === '') {
      error(t('empty_username_is_not_allowed_error_message'))

      return
    }

    try {
      const CommentsApiService =
        (await import('~/modules/Posts/Infrastructure/Frontend/CommentsApiService')).CommentsApiService

      const componentResponse =
        await new CommentsApiService().createReply(commentToReply.postId, comment, userName, commentToReply.id, locale)

      setReplies([componentResponse, ...replies])
      onAddReply(null)

      success(t('post_child_comment_added_success_message'))
    } catch (exception: unknown) {
      if (!(exception instanceof APIException)) {
        console.error(exception)

        return
      }

      error(t(`api_exceptions:${exception.translationKey}`))
    }
  }

  const updateReplies = async () => {
    try {
      setLoading(true)

      const CommentsApiService =
        (await import('~/modules/Posts/Infrastructure/Frontend/CommentsApiService')).CommentsApiService

      const response = await new CommentsApiService()
        .getChildComments(commentToReply.postId, commentToReply.id, pageNumber, defaultPerPage, locale)

      onAddReply(response.commentsNumber)

      setReplies([...replies, ...response.comments])

      const pagesNumber = PaginationHelper.calculatePagesNumber(response.commentsNumber, defaultPerPage)

      setCanLoadMore(pageNumber < pagesNumber)
      setPageNumber(pageNumber + 1)
    } catch (exception: unknown) {
      console.error(exception)
      error(t('server_error_error_message'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    updateReplies().then()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onClickLikeChildComment = (
    childCommentId: string,
    userReaction: ReactionComponentDto | null,
    reactionsNumber: number
  ) => {
    const commentIndex = replies.findIndex((currentReply) => currentReply.id === childCommentId)

    if (commentIndex !== -1) {
      const reply = replies[commentIndex]

      reply.reactionsNumber = reactionsNumber
      reply.userReaction = userReaction

      replies[commentIndex] = reply
      setReplies([...replies])
    }
  }

  const onAddComment = async (userName: string, comment: string) => {
    // TODO: Scroll to new comment
    setLoading(true)
    setCreatingChildComment(true)
    await createReply(userName, comment)
    setCreatingChildComment(false)
    setLoading(false)
  }

  const onLoadMore = async () => {
    setLoading(true)
    await updateReplies()
    setLoading(false)
  }

  return (
    <div className={ styles.postComments__container }>
      <div className={ styles.postComments__commentsTitleBar }>
        <div className={ styles.postComments__commentsTitle }>
          <IconButton
            onClick={ onClickRetry }
            icon={ <BsArrowLeftShort /> }
            title={ t('back_to_comments_section_button_title') }
          />
          { t('replies_section_title') }
          <span className={ styles.postComments__commentsQuantity }>
            { commentToReply.repliesNumber }
          </span>
        </div>
        <IconButton
          onClick={ onClickClose }
          icon={ <BsX /> }
          title={ t('close_comment_section_button_title') }
        />
      </div>
      <div
        className={ styles.postComments__comments }
        ref={ repliesAreaRef }
      >
        <PostCommentList
          postComment={ commentToReply }
          postChildComments={ replies }
          onClickLikeComment={ onClickLikeComment }
          onClickLikeChildComment={ onClickLikeChildComment }
          loading={ loading }
          creatingChildComment={ creatingChildComment }
        />

        <button className={ `
          ${styles.postComments__loadMore}
          ${canLoadMore ? styles.postComments__loadMore__visible : ''}
        ` }
          onClick={ onLoadMore }
          title={ t('replies_section_load_more') }
        >
          { t('replies_section_load_more') }
        </button>
      </div>

      <AddCommentInput
        disabled={ loading }
        onAddComment={ onAddComment }
      />
    </div>
  )
}
