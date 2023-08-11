import { FC } from 'react'
import styles from './PostChildCommentList.module.scss'
import { PostCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCommentComponentDto'
import { PostCommentOptions } from '~/modules/Posts/Infrastructure/Components/PostCommentOptions/PostCommentOptions'
import { PostChildCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostChildCommentComponentDto'
import { PostCommentCard } from '~/modules/Posts/Infrastructure/Components/PostComment/PostCommentCard'
import { PostChildCommentCard } from '~/modules/Posts/Infrastructure/Components/PostChildComment/PostChildCommentCard'

interface Props {
  postComment: PostCommentComponentDto
  postChildComments: PostChildCommentComponentDto[]
  onDeletePostChildComment: (postCommentId: string) => void
}

export const PostChildCommentList: FC<Props> = ({ postComment, postChildComments, onDeletePostChildComment }) => {
  return (
    <div className={ styles.postCommentChildList__container }>
      <div className={ styles.postCommentChildList__postCommentContainer }>
        <PostCommentCard
          key={ postComment.id }
          postComment={ postComment }
        />
      </div>

      { postChildComments.map((childComment) => {
        return (
          <div className={ styles.postCommentChildList__postChildCommentContainer } key={ childComment.id }>
            <div className={ styles.postCommentChildList__commentWithOptions }>
              <PostChildCommentCard
                postChildComment={ childComment }
                key={ childComment.id }
              />
              <PostCommentOptions
                ownerId={ childComment.user.id }
                postId={ postComment.postId }
                postCommentId={ childComment.id }
                parentCommentId={ childComment.parentCommentId }
                onDeleteComment={ () => onDeletePostChildComment(childComment.id) }
              />
            </div>
          </div>
        )
      }) }
    </div>
  )
}