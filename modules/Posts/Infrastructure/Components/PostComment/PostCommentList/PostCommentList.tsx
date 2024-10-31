import { FC, ReactElement } from 'react'
import styles from './PostCommentList.module.scss'
import { PostCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCommentComponentDto'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
// eslint-disable-next-line max-len
import { PostCommentCardSkeleton } from '~/modules/Posts/Infrastructure/Components/PostComment/PostCommentCard/PostCommentCardSkeleton/PostCommentCardSkeleton'
// eslint-disable-next-line max-len
import { PostChildCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostChildCommentComponentDto'
// eslint-disable-next-line max-len
import {
  PostCommentWithOptions
} from '~/modules/Posts/Infrastructure/Components/PostComment/PostCommentWithOptions/PostCommentWithOptions'

interface PostCommentListProps {
  postComments: PostCommentComponentDto[]
  onClickReply: (comment: PostCommentComponentDto) => void
  onClickLikeComment: (commentId: string, userReaction: ReactionComponentDto | null, reactionsNumber: number) => void
  loading: boolean
  creatingComment: boolean
}

interface PostChildCommentListProps {
  postComment: PostCommentComponentDto
  postChildComments: PostChildCommentComponentDto[]
  onClickLikeComment: (commentId: string, userReaction: ReactionComponentDto | null, reactionsNumber: number) => void
  onClickLikeChildComment: (
    childCommentId: string,
    userReaction: ReactionComponentDto | null,
    reactionsNumber: number
  ) => void
  loading: boolean
  creatingChildComment: boolean
}

export const PostCommentList: FC<PostCommentListProps | PostChildCommentListProps> = (props) => {
  const buildSkeletonSection = (skeletonNumber: number) => {
    return Array.from(Array(skeletonNumber).keys())
      .map((index) => (
        <div
          key={ index }
          className={ styles.postCommentList__postCommentSkeletonContainer }
        >
          <PostCommentCardSkeleton />
        </div>
      ))
  }

  let commentToReply: ReactElement | null = null
  let commentsSection: ReactElement[] | ReactElement = []
  let skeletonSection: ReactElement[] | null = null
  let creatingComment = false

  if ('postComment' in props) {
    commentToReply = (
      <div className={ styles.postCommentList__postCommentToReplyContainer }>
        <PostCommentWithOptions
          postComment={ props.postComment }
          onClickLikeComment={ props.onClickLikeComment }
          optionsDisabled={ props.loading }
          onClickReply={ undefined }
        />
      </div>
    )

    commentsSection = props.postChildComments.map((childComment) => {
      return (
        <div
          key={ childComment.id }
          className={ styles.postCommentList__postCommentContainer }
        >
          <PostCommentWithOptions
            postChildComment={ childComment }
            onClickLikeComment={ props.onClickLikeChildComment }
            optionsDisabled={ props.loading }
          />
        </div>
      )
    })

    const childCommentsSkeleton = buildSkeletonSection(2)

    skeletonSection =
      props.loading &&
      !props.creatingChildComment &&
      props.postChildComments.length === 0
        ? childCommentsSkeleton
        : null

    creatingComment = props.creatingChildComment
  }

  if ('postComments' in props && props.postComments) {
    commentsSection = props.postComments.map((postComment) => {
      return (
        <div
          key={ postComment.id }
          className={ styles.postCommentList__postCommentContainer }
        >
          <PostCommentWithOptions
            postComment={ postComment }
            onClickReply={ props.onClickReply }
            onClickLikeComment={ props.onClickLikeComment }
            optionsDisabled={ props.loading }
          />
        </div>
      )
    })

    const commentsSkeleton = buildSkeletonSection(3)

    skeletonSection =
      props.loading &&
      !props.creatingComment &&
      props.postComments.length === 0
        ? commentsSkeleton
        : null

    creatingComment = props.creatingComment
  }

  return (
    <div className={ `
      ${styles.postCommentList__container}
      ${props.loading && 'postComment' in props ? styles.postCommentList__container_loading : ''}
    ` } >
      { commentToReply }
      { creatingComment
        ? <div className={ styles.postCommentList__postCommentSkeletonContainer }>
          <PostCommentCardSkeleton/>
        </div>
        : null
      }
      { commentsSection }
      { skeletonSection }
    </div>
  )
}
