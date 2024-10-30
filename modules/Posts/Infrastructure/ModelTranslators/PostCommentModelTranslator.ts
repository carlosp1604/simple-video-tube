import { DateTime } from 'luxon'
import { PostComment as PrismaPostCommentModel } from '@prisma/client'
import { PostComment } from '~/modules/Posts/Domain/PostComments/PostComment'
import {
  PostCommentWithChildren, PostCommentWithReactions
} from '~/modules/Posts/Infrastructure/PrismaModels/PostCommentModel'
import { PostChildComment } from '~/modules/Posts/Domain/PostComments/PostChildComment'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import {
  PostChildCommentModelTranslator
} from '~/modules/Posts/Infrastructure/ModelTranslators/PostChildCommentModelTranslator'
import { PostCommentRepositoryOption } from '~/modules/Posts/Domain/PostComments/PostCommentRepositoryInterface'
import { Reaction } from '~/modules/Reactions/Domain/Reaction'
import { ReactionModelTranslator } from '~/modules/Reactions/Infrastructure/ReactionModelTranslator'

export class PostCommentModelTranslator {
  public static toDomain (
    prismaPostCommentModel: PrismaPostCommentModel,
    options: PostCommentRepositoryOption[]
  ): PostComment {
    let deletedAt: DateTime | null = null

    if (prismaPostCommentModel.deletedAt !== null) {
      deletedAt = DateTime.fromJSDate(prismaPostCommentModel.deletedAt)
    }

    let childrenCollection: Collection<PostChildComment, PostChildComment['id']> = Collection.notLoaded()
    let reactionsCollection: Collection<Reaction, Reaction['userIp']> = Collection.notLoaded()

    if (options.includes('comments.childComments')) {
      const postCommentWithChildren = prismaPostCommentModel as PostCommentWithChildren

      childrenCollection = Collection.initializeCollection()

      postCommentWithChildren.childComments.forEach((childComment) => {
        childrenCollection.addItem(
          PostChildCommentModelTranslator.toDomain(childComment, []),
          childComment.id
        )
      })
    }

    if (options.includes('comments.reactions')) {
      const postCommentWithReactions = prismaPostCommentModel as PostCommentWithReactions

      reactionsCollection = Collection.initializeCollection()

      for (const reaction of postCommentWithReactions.reactions) {
        const domainReaction = ReactionModelTranslator.toDomain(reaction)

        reactionsCollection.addItem(domainReaction, domainReaction.userIp)
      }
    }

    return new PostComment(
      prismaPostCommentModel.id,
      prismaPostCommentModel.comment,
      // if it's a PostComment we are sure the postId is not null
      prismaPostCommentModel.postId as string,
      prismaPostCommentModel.userIp,
      prismaPostCommentModel.userName,
      DateTime.fromJSDate(prismaPostCommentModel.createdAt),
      DateTime.fromJSDate(prismaPostCommentModel.updatedAt),
      deletedAt,
      childrenCollection,
      reactionsCollection
    )
  }

  public static toDatabase (postComment: PostComment): PrismaPostCommentModel {
    return {
      id: postComment.id,
      comment: postComment.comment,
      userIp: postComment.userIp,
      parentCommentId: null,
      createdAt: postComment.createdAt.toJSDate(),
      deletedAt: postComment.deletedAt?.toJSDate() ?? null,
      updatedAt: postComment.updatedAt.toJSDate(),
      postId: postComment.postId,
      userName: postComment.userName,
    }
  }
}
