import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { Post } from '~/modules/Posts/Domain/Post'
import { Reaction } from '~/modules/Reactions/Domain/Reaction'

export class CreatePostReactionApplicationException extends ApplicationException {
  public static cannotAddReactionId = 'create_reaction_comment_cannot_add_reaction'
  public static userAlreadyReactedId = 'create_reaction_user_already_reacted'
  public static postNotFoundId = 'create_reaction_comment_post_not_found'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, CreatePostReactionApplicationException.prototype)
  }

  public static postNotFound (postId: Post['id']): CreatePostReactionApplicationException {
    return new CreatePostReactionApplicationException(
      `Post with ID ${postId} was not found`,
      this.postNotFoundId
    )
  }

  public static userAlreadyReacted (
    userIp: Reaction['userIp'],
    postId: Post['id']
  ): CreatePostReactionApplicationException {
    return new CreatePostReactionApplicationException(
      `User with IP ${userIp} already reacted to post with ID ${postId}`,
      this.userAlreadyReactedId
    )
  }

  public static cannotAddReaction (
    userIp: Reaction['userIp'],
    postId: Post['id']
  ): CreatePostReactionApplicationException {
    return new CreatePostReactionApplicationException(
      `Cannot add reaction from user with IP ${userIp} to post with ID ${postId}`,
      this.cannotAddReactionId
    )
  }
}
