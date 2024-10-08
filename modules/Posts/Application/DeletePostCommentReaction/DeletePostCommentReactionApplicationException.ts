import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { PostComment } from '~/modules/Posts/Domain/PostComments/PostComment'
import { PostChildComment } from '~/modules/Posts/Domain/PostComments/PostChildComment'

export class DeletePostCommentReactionApplicationException extends ApplicationException {
  public static postCommentNotFoundId = 'delete_post_comment_reaction_comment_post_not_found'
  public static userHasNotReactedId = 'delete_post_comment_reaction_user_has_not_reacted'

  public static postCommentNotFound (
    postCommentId: PostComment['id'] | PostChildComment['id']
  ): DeletePostCommentReactionApplicationException {
    return new DeletePostCommentReactionApplicationException(
      `Post comment with ID ${postCommentId} was not found`,
      this.postCommentNotFoundId
    )
  }

  public static userHasNotReacted (
    userIp: PostComment['userIp'] | PostChildComment['userIp'],
    postCommentId: PostComment['id'] | PostChildComment['id']
  ): DeletePostCommentReactionApplicationException {
    return new DeletePostCommentReactionApplicationException(
      `User with IP ${userIp} has not reacted to post comment with ID ${postCommentId}`,
      this.userHasNotReactedId
    )
  }
}
