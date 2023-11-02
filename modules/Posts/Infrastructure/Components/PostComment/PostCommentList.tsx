import { FC } from 'react'
import { PostCommentCard } from './PostCommentCard'
import styles from './PostCommentList.module.scss'
import { PostCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCommentComponentDto'
import { PostCommentOptions } from '~/modules/Posts/Infrastructure/Components/PostCommentOptions/PostCommentOptions'
import {
  PostCommentInteractionSection
} from '~/modules/Posts/Infrastructure/Components/PostComment/PostCommentInteractionSection'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'

interface Props {
  postComments: PostCommentComponentDto[]
  onDeletePostComment: (postCommentId: string) => void
  onClickReply: (comment: PostCommentComponentDto) => void
  onClickLikeComment: (postId: string, reactionsNumber: number, userReaction: ReactionComponentDto | null) => void
}

export const PostCommentList: FC<Props> = ({ postComments, onDeletePostComment, onClickReply, onClickLikeComment }) => {
  const postCommentElements = postComments.map((comment) => {
    return (
      <div className={ styles.postCommentList__postCommentContainer } key={ comment.id }>
        <div className={ styles.postCommentList__commentWithOptions }>
          <PostCommentCard
            postComment={ comment }
            key={ comment.id }
          />
          <PostCommentOptions
            ownerId={ comment.user.id }
            onDeleteComment={ () => onDeletePostComment(comment.id) }
            parentCommentId={ null }
            postCommentId={ comment.id }
            postId={ comment.postId }
          />
        </div>
        <PostCommentInteractionSection
          postComment={ comment }
          onClickReply={ onClickReply }
          onClickLikeComment={ onClickLikeComment }
        />
      </div>
    )
  })

  return (
    <div className={ styles.postCommentList__container }>
      { postCommentElements }
    </div>
  )
}
