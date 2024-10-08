import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { PostComment } from '~/modules/Posts/Domain/PostComments/PostComment'

export class CreatePostCommentApplicationException extends ApplicationException {
  public static cannotAddCommentId = 'create_post_comment_cannot_add_comment'
  public static postNotFoundId = 'create_post_comment_post_not_found'
  public static userNotFoundId = 'create_post_comment_user_not_found'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, CreatePostCommentApplicationException.prototype)
  }

  public static cannotAddComment (
    postId: PostComment['postId'],
    userIp: PostComment['userIp']
  ): CreatePostCommentApplicationException {
    return new CreatePostCommentApplicationException(
      `Cannot add comment from user with IP ${userIp} to post with ID ${postId}`,
      this.cannotAddCommentId
    )
  }

  public static postNotFound (postId: PostComment['postId']): CreatePostCommentApplicationException {
    return new CreatePostCommentApplicationException(
      `Post with ID ${postId} was not found`,
      this.postNotFoundId
    )
  }
}
