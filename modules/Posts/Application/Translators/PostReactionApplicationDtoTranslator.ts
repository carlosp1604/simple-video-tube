import { Reaction } from '~/modules/Reactions/Domain/Reaction'
import { ModelReactionApplicationDto } from '~/modules/Reactions/Application/ModelReactionApplicationDto'

export class PostReactionApplicationDtoTranslator {
  public static fromDomain (postReaction: Reaction): ModelReactionApplicationDto {
    return {
      reactionableId: postReaction.reactionableId,
      userIp: postReaction.userIp,
      reactionType: postReaction.reactionType,
      createdAt: postReaction.createdAt.toISO(),
      updatedAt: postReaction.updatedAt.toISO(),
    }
  }
}
