import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { Post } from '~/modules/Posts/Domain/Post'
import { Reaction } from '~/modules/Reactions/Domain/Reaction'

export class DeletePostReactionApplicationException extends ApplicationException {
  public static postNotFoundId = 'delete_reaction_comment_post_not_found'
  public static userHasNotReactedId = 'delete_reaction_user_has_not_reacted'

  public static postNotFound (postId: Post['id']): DeletePostReactionApplicationException {
    return new DeletePostReactionApplicationException(
      `Post with ID ${postId} was not found`,
      this.postNotFoundId
    )
  }

  public static userHasNotReacted (
    userIp: Reaction['userIp'],
    postId: Post['id']
  ): DeletePostReactionApplicationException {
    return new DeletePostReactionApplicationException(
      `User with IP ${userIp} has not reacted to post with ID ${postId}`,
      this.userHasNotReactedId
    )
  }
}
