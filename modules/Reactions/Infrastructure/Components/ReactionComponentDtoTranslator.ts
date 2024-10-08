import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import { ModelReactionApplicationDto } from '~/modules/Reactions/Application/ModelReactionApplicationDto'

export class ReactionComponentDtoTranslator {
  public static fromApplicationDto (reaction: ModelReactionApplicationDto): ReactionComponentDto {
    return {
      reactionableId: reaction.reactionableId,
      userIp: reaction.userIp,
      reactionType: reaction.reactionType,
    }
  }
}
