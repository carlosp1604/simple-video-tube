import { FC } from 'react'
import styles from './PostCommentCard.module.scss'
import { BsDot } from 'react-icons/bs'
import { PostCommentCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCommentCardComponentDto'
import { AvatarImage } from '~/components/AvatarImage/AvatarImage'
import { PostChildCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostChildCommentComponentDto'

interface Props {
  postComment: PostCommentCardComponentDto | PostChildCommentComponentDto
}

export const PostCommentCard: FC<Props> = ({ postComment }) => {
  return (
    <div className={ styles.postCommentCard__container }>
      <AvatarImage
        imageUrl={ null }
        avatarClassName={ styles.postCommentCard__userAvatar }
        imageClassName={ '' }
        avatarName={ postComment.userName }
        imageAlt={ postComment.userName }
        rounded={ true }
      />
      <div className={ styles.postCommentCard__userNameDate }>
        <span className={ styles.postCommentCard__userName }>
          { postComment.userName }
        </span>
        <BsDot className={ styles.postCommentCard__separatorIcon }/>
        <span className={ styles.postCommentCard__commentDate }>
          { postComment.createdAt }
        </span>
      </div>
      <div className={ styles.postCommentCard__comment }>
        { postComment.comment }
      </div>
    </div>
  )
}
