import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { PostComment } from '~/modules/Posts/Domain/PostComments/PostComment'
import { Post } from '~/modules/Posts/Domain/Post'
import { PostChildComment } from '~/modules/Posts/Domain/PostComments/PostChildComment'

export class DeletePostCommentApplicationException extends ApplicationException {
  public static cannotDeleteCommentId = 'delete_post_comment_cannot_delete_comment'
  public static cannotDeleteCommentFromPersistenceId = 'delete_post_comment_cannot_delete_comment_from_persistence'
  public static postNotFoundId = 'delete_post_comment_post_not_found'
  public static parentCommentNotFoundId = 'delete_post_comment_parent_comment_not_found'
  public static postCommentNotFoundId = 'delete_post_comment_post_comment_not_found'
  public static userCannotDeleteCommentId = 'delete_post_comment_user_cannot_delete_post_comment'

  public static cannotDeleteComment (
    postCommentId: PostComment['id']
  ): DeletePostCommentApplicationException {
    return new DeletePostCommentApplicationException(
      `Cannot delete comment with ID ${postCommentId} from it's post or parent`,
      this.cannotDeleteCommentId
    )
  }

  public static cannotDeleteCommentFromPersistence (
    postCommentId: PostComment['id']
  ): DeletePostCommentApplicationException {
    return new DeletePostCommentApplicationException(
      `Cannot delete comment with ID ${postCommentId} from persistence layer`,
      this.cannotDeleteCommentFromPersistenceId
    )
  }

  public static postNotFound (postId: Post['id']): DeletePostCommentApplicationException {
    return new DeletePostCommentApplicationException(
      `Post with ID ${postId} was not found`,
      this.postNotFoundId
    )
  }

  public static parentCommentNotFound (postCommentId: PostComment['id']): DeletePostCommentApplicationException {
    return new DeletePostCommentApplicationException(
      `Parent comment with ID ${postCommentId} was not found`,
      this.parentCommentNotFoundId
    )
  }

  public static postCommentNotFound (postCommentId: PostComment['id']): DeletePostCommentApplicationException {
    return new DeletePostCommentApplicationException(
      `Post comment with ID ${postCommentId} was not found`,
      this.postCommentNotFoundId
    )
  }

  public static userCannotDeleteComment (
    userIp: PostComment['userIp'] | PostChildComment['userIp'],
    postCommentId: PostComment['id']
  ): DeletePostCommentApplicationException {
    return new DeletePostCommentApplicationException(
      `Comment with ID ${postCommentId} does not belong to user with IP ${userIp}`,
      this.userCannotDeleteCommentId
    )
  }
}
