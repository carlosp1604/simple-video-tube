import { DateTime } from 'luxon'
import { PostComment as PrismaPostCommentModel } from '@prisma/client'
import { PostChildComment } from '~/modules/Posts/Domain/PostComments/PostChildComment'
import { PostCommentWithReactions } from '~/modules/Posts/Infrastructure/PrismaModels/PostCommentModel'
import { PostCommentRepositoryOption } from '~/modules/Posts/Domain/PostComments/PostCommentRepositoryInterface'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { ReactionModelTranslator } from '~/modules/Reactions/Infrastructure/ReactionModelTranslator'
import { Reaction } from '~/modules/Reactions/Domain/Reaction'

export class PostChildCommentModelTranslator {
  public static toDomain (
    prismaPostCommentModel: PrismaPostCommentModel,
    options: PostCommentRepositoryOption[]
  ): PostChildComment {
    let deletedAt: DateTime | null = null

    if (prismaPostCommentModel.deletedAt !== null) {
      deletedAt = DateTime.fromJSDate(prismaPostCommentModel.deletedAt)
    }

    let reactionsCollection: Collection<Reaction, Reaction['userIp']> = Collection.notLoaded()

    if (options.includes('comments.reactions')) {
      const postCommentWithReactions = prismaPostCommentModel as PostCommentWithReactions

      reactionsCollection = Collection.initializeCollection()

      for (const reaction of postCommentWithReactions.reactions) {
        const domainReaction = ReactionModelTranslator.toDomain(reaction)

        reactionsCollection.addItem(domainReaction, domainReaction.userIp)
      }
    }

    return new PostChildComment(
      prismaPostCommentModel.id,
      prismaPostCommentModel.comment,
      prismaPostCommentModel.userIp,
      prismaPostCommentModel.username,
      // if it's a child comment we are sure the parentCommentId is not null
      prismaPostCommentModel.parentCommentId as string,
      DateTime.fromJSDate(prismaPostCommentModel.createdAt),
      DateTime.fromJSDate(prismaPostCommentModel.updatedAt),
      deletedAt,
      reactionsCollection
    )
  }

  public static toDatabase (postChildComment: PostChildComment): PrismaPostCommentModel {
    return {
      id: postChildComment.id,
      comment: postChildComment.comment,
      userIp: postChildComment.userIp,
      parentCommentId: postChildComment.parentCommentId,
      createdAt: postChildComment.createdAt.toJSDate(),
      deletedAt: postChildComment.deletedAt?.toJSDate() ?? null,
      updatedAt: postChildComment.updatedAt.toJSDate(),
      postId: null,
      username: postChildComment.username,
    }
  }
}
