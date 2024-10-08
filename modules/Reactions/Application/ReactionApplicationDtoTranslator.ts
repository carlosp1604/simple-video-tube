import { ModelReactionApplicationDto } from '~/modules/Reactions/Application/ModelReactionApplicationDto'
import { Reaction } from '~/modules/Reactions/Domain/Reaction'

export class ReactionApplicationDtoTranslator {
  public static fromDomain (reaction: Reaction): ModelReactionApplicationDto {
    return {
      reactionType: reaction.reactionType,
      reactionableId: reaction.reactionableId,
      createdAt: reaction.createdAt.toISO(),
      userIp: reaction.userIp,
      updatedAt: reaction.updatedAt.toISO(),
    }
  }
}
