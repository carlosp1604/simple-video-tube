import { ReactionRepositoryInterface } from '~/modules/Reactions/Domain/ReactionRepositoryInterface'
import { Reaction, ReactionableType } from '~/modules/Reactions/Domain/Reaction'
import { prisma } from '~/persistence/prisma'
import { ReactionModelTranslator } from '~/modules/Reactions/Infrastructure/ReactionModelTranslator'

export class MysqlReactionRepository implements ReactionRepositoryInterface {
  /**
   * Insert a Reaction in the persistence layer or update if already exists
   * @param reaction Reaction to persist
   */
  public async save (reaction: Reaction): Promise<void> {
    const prismaModel = ReactionModelTranslator.toDatabase(reaction)

    await prisma.reaction.upsert({
      where: {
        reactionableType_reactionableId_userIp: {
          reactionableId: reaction.reactionableId,
          userIp: reaction.userIp,
          reactionableType: reaction.reactionableType,
        },
      },
      create: {
        ...prismaModel,
      },
      update: {
        reactionType: prismaModel.reactionType,
        updatedAt: prismaModel.updatedAt,
      },
    })
  }

  /**
   * Remove a Reaction from the persistence layer
   * @param postCommentId PostComment ID
   * @param userIp User IP
   */
  public async remove (postCommentId: Reaction['reactionableId'], userIp: Reaction['userIp']): Promise<void> {
    await prisma.reaction.delete({
      where: {
        reactionableType_reactionableId_userIp: {
          reactionableId: postCommentId,
          reactionableType: ReactionableType.POST_COMMENT,
          userIp,
        },
      },
    })
  }
}
