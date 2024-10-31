import { Dispatch, FC, ReactElement, SetStateAction, useEffect, useRef, useState } from 'react'
import styles from './PostComments.module.scss'
import { BsX } from 'react-icons/bs'
import { useRouter } from 'next/router'
import { PostCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCommentComponentDto'
import useTranslation from 'next-translate/useTranslation'
import { AddCommentInput } from '~/modules/Posts/Infrastructure/Components/AddCommentInput/AddCommentInput'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import { APIException } from '~/modules/Shared/Infrastructure/FrontEnd/ApiException'
import { defaultPerPage, PaginationHelper } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { useToast } from '~/components/AppToast/ToastContext'
import { IconButton } from '~/components/IconButton/IconButton'
import { PostCommentList } from '~/modules/Posts/Infrastructure/Components/PostComment/PostCommentList/PostCommentList'
import dynamic from 'next/dynamic'
import { i18nConfig } from '~/i18n.config'

interface Props {
  postId: string
  setIsOpen: Dispatch<SetStateAction<boolean>>
  setCommentsNumber: Dispatch<SetStateAction<number>>
  commentsNumber: number
}

const PostChildComments = dynamic(() =>
  import('~/modules/Posts/Infrastructure/Components/PostComment/PostComments/PostChildComments')
    .then((module) => module.PostChildComments),
{ ssr: false })

export const PostComments: FC<Props> = ({ postId, setIsOpen, setCommentsNumber, commentsNumber }) => {
  const [repliesOpen, setRepliesOpen] = useState<boolean>(false)
  const [commentToReply, setCommentToReply] = useState<PostCommentComponentDto | null>(null)
  const [comments, setComments] = useState<PostCommentComponentDto[]>([])
  const [canLoadMore, setCanLoadMore] = useState<boolean>(false)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [creatingComment, setCreatingComment] = useState<boolean>(false)

  const commentsAreaRef = useRef<HTMLDivElement>(null)

  const { t } = useTranslation('post_comments')
  const { error, success } = useToast()

  const router = useRouter()
  const locale = router.locale ?? i18nConfig.defaultLocale

  const createComment = async (userName: string, comment: string) => {
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

      const postComment = await (new CommentsApiService()).create(postId, comment, userName, null, locale)

      setComments([postComment, ...comments])
      setCommentsNumber(commentsNumber + 1)

      success(t('post_comment_added_success_message'))
    } catch (exception: unknown) {
      if (!(exception instanceof APIException)) {
        console.error(exception)

        return
      }

      error(t(`api_exceptions:${exception.translationKey}`))
    }
  }

  const updatePostComments = async () => {
    try {
      setLoading(true)

      const CommentsApiService =
        (await import('~/modules/Posts/Infrastructure/Frontend/CommentsApiService')).CommentsApiService

      const newComments = await (new CommentsApiService()).getComments(postId, pageNumber, defaultPerPage, locale)

      setComments([...comments, ...newComments.comments])
      const pagesNumber = PaginationHelper.calculatePagesNumber(newComments.commentsNumber, defaultPerPage)

      setCanLoadMore(pageNumber < pagesNumber)
      setPageNumber(pageNumber + 1)
      setCommentsNumber(newComments.commentsNumber)
    } catch (exception: unknown) {
      console.error(exception)
      error(t('server_error_error_message'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    updatePostComments().then()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onClickLikeComment = (
    commentId: string,
    userReaction: ReactionComponentDto | null,
    reactionsNumber: number
  ) => {
    const commentIndex = comments.findIndex((currentComment) => currentComment.id === commentId)

    if (commentIndex !== -1) {
      const postComment = comments[commentIndex]

      postComment.reactionsNumber = reactionsNumber
      postComment.userReaction = userReaction

      comments[commentIndex] = postComment
      setComments([...comments])
    }
  }

  let replies = null

  if (repliesOpen && commentToReply !== null) {
    const onCloseChildComments = () => {
      setCommentToReply(null)
      setRepliesOpen(false)
      setIsOpen(false)
    }

    const onRetry = () => {
      setCommentToReply(null)
      setRepliesOpen(false)
    }

    const onAddReply = (repliesNumber: number | null) => {
      const commentIndex = comments.indexOf(commentToReply)

      if (commentIndex !== -1) {
        const commentToUpdate = comments[commentIndex]

        if (repliesNumber === null) {
          commentToUpdate.repliesNumber = commentToUpdate.repliesNumber + 1
        } else {
          commentToUpdate.repliesNumber = repliesNumber
        }
        comments[commentIndex] = commentToUpdate
        setComments(comments)
      }
    }

    replies = (
      <PostChildComments
        onClickClose={ onCloseChildComments }
        onClickRetry={ onRetry }
        onAddReply={ onAddReply }
        commentToReply={ commentToReply }
        onClickLikeComment={ onClickLikeComment }
      />
    )
  }

  const onClickReply = (comment: PostCommentComponentDto) => {
    setCommentToReply(comment)
    setRepliesOpen(true)
  }

  const onLoadMore = async () => {
    setLoading(true)
    await updatePostComments()
    setLoading(false)
  }

  const onAddComment = async (userName: string, comment: string) => {
    // TODO: Scroll to new comment
    scrollTo()
    setLoading(true)
    setCreatingComment(true)
    await createComment(userName, comment)
    setCreatingComment(false)
    setLoading(false)
  }

  const postCommentsContent: ReactElement = (
    <div className={ styles.postComments__container }>
      <div className={ styles.postComments__commentsTitleBar }>
        <div className={ styles.postComments__commentsTitle }>
          { t('comment_section_title') }
          <span className={ styles.postComments__commentsQuantity }>
            { commentsNumber }
          </span>
        </div>
        <IconButton
          onClick={ () => setIsOpen(false) }
          icon={ <BsX /> }
          title={ t('close_comment_section_button_title') }
        />
      </div>
      <div
        className={ styles.postComments__comments }
        ref={ commentsAreaRef }
      >
        <PostCommentList
          postComments={ comments }
          onClickReply={ onClickReply }
          onClickLikeComment={ onClickLikeComment }
          loading={ loading }
          creatingComment={ creatingComment }
        />
        <button
          className={ `${styles.postComments__loadMore} ${canLoadMore ? styles.postComments__loadMore__visible : ''} ` }
          onClick={ onLoadMore }
          title={ t('comment_section_load_more') }
        >
          { t('comment_section_load_more') }
        </button>
      </div>

      <AddCommentInput
        disabled={ loading }
        onAddComment={ onAddComment }
      />
    </div>
  )

  return repliesOpen ? replies : postCommentsContent
}
