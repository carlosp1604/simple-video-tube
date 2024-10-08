import { DomainException } from '~/modules/Exceptions/Domain/DomainException'
import { Reaction } from '~/modules/Reactions/Domain/Reaction'

export class ReactionableModelDomainException extends DomainException {
  public static cannotAddReactionId = 'reactionable_model_domain_cannot_add_reaction'
  public static cannotUpdateReactionId = 'reactionable_model_domain_cannot_update_reaction'
  public static userAlreadyReactedId = 'reactionable_model_domain_user_already_reacted'
  public static userHasNotReactedId = 'reactionable_model_domain_user_has_not_reacted'
  public static cannotDeleteReactionId = 'reactionable_model_domain_cannot_delete_reaction'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, ReactionableModelDomainException.prototype)
  }

  public static cannotAddReaction (
    userIp: Reaction['userIp'],
    reactionableId: Reaction['reactionableId'],
    reactionableType: Reaction['reactionableType']
  ): ReactionableModelDomainException {
    return new ReactionableModelDomainException(
      `Cannot add reaction from user with IP ${userIp} to ${reactionableType} with ID ${reactionableId}`,
      this.cannotAddReactionId
    )
  }

  public static cannotUpdateReaction (
    userIp: Reaction['userIp'],
    reactionableId: Reaction['reactionableId'],
    reactionableType: Reaction['reactionableType']
  ): ReactionableModelDomainException {
    return new ReactionableModelDomainException(
      `Cannot update reaction from user with IP ${userIp} in the ${reactionableType} with ID ${reactionableId}`,
      this.cannotUpdateReactionId
    )
  }

  public static userAlreadyReacted (
    userIp: Reaction['userIp'],
    reactionableId: Reaction['reactionableId'],
    reactionableType: Reaction['reactionableType']
  ): ReactionableModelDomainException {
    return new ReactionableModelDomainException(
      `User with IP ${userIp} already reacted to ${reactionableType} with ID ${reactionableId}`,
      this.userAlreadyReactedId
    )
  }

  public static userHasNotReacted (
    userIp: Reaction['userIp'],
    reactionableId: Reaction['reactionableId'],
    reactionableType: Reaction['reactionableType']
  ): ReactionableModelDomainException {
    return new ReactionableModelDomainException(
      `User with IP ${userIp} has not reacted to ${reactionableType} with ID ${reactionableId}`,
      this.userHasNotReactedId
    )
  }

  public static cannotDeleteReaction (
    userIp: Reaction['userIp'],
    reactionableId: Reaction['reactionableId'],
    reactionableType: Reaction['reactionableType']
  ): ReactionableModelDomainException {
    return new ReactionableModelDomainException(
      `Cannot delete reaction from user with IP ${userIp} in ${reactionableType} with ID ${reactionableId}`,
      this.cannotDeleteReactionId
    )
  }
}
