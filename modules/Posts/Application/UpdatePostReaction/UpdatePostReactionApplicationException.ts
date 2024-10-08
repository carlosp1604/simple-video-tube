import { Post } from '~/modules/Posts/Domain/Post'
import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { Reaction } from '~/modules/Reactions/Domain/Reaction'

export class UpdatePostReactionApplicationException extends ApplicationException {
  public static userHasNotReactedId = 'create_reaction_user_has_not_reacted'
  public static postNotFoundId = 'create_reaction_comment_post_not_found'
  public static cannotUpdateReactionId = 'create_reaction_cannot_add_reaction'

  public static postNotFound (postId: Post['id']): UpdatePostReactionApplicationException {
    return new UpdatePostReactionApplicationException(
      `Post with ID ${postId} was not found`,
      this.postNotFoundId
    )
  }

  public static userHasNotReacted (
    userIp: Reaction['userIp'],
    postId: Post['id']
  ): UpdatePostReactionApplicationException {
    return new UpdatePostReactionApplicationException(
      `User with IP ${userIp} has not reacted to post with ID ${postId}`,
      this.userHasNotReactedId
    )
  }

  public static cannotUpdateReaction (
    userIp: Reaction['userIp'],
    postId: Post['id']
  ): UpdatePostReactionApplicationException {
    return new UpdatePostReactionApplicationException(
      `Cannot add reaction from user with IP ${userIp} to post with ID ${postId}`,
      this.cannotUpdateReactionId
    )
  }
}
