import { DateTime } from 'luxon'
import { PostComment as PrismaPostCommentModel } from '@prisma/client'
import { RepositoryOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { PostChildComment } from '~/modules/Posts/Domain/PostChildComment'
import { PostCommentWithUser } from '~/modules/Posts/Infrastructure/PrismaModels/PostCommentModel'
import { PrismaUserModelTranslator } from '~/modules/Auth/Infrastructure/PrismaUserModelTranslator'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { User } from '~/modules/Auth/Domain/User'

export class PostChildCommentModelTranslator {
  public static toDomain (
    prismaPostCommentModel: PrismaPostCommentModel,
    options: RepositoryOptions[]
  ): PostChildComment {
    let deletedAt: DateTime | null = null

    if (prismaPostCommentModel.deletedAt !== null) {
      deletedAt = DateTime.fromJSDate(prismaPostCommentModel.deletedAt)
    }

    let user: Relationship<User> = Relationship.notLoaded()

    if (options.includes('comments.user')) {
      const postCommentWithUser = prismaPostCommentModel as PostCommentWithUser
      const userDomain = PrismaUserModelTranslator.toDomain(postCommentWithUser.user)

      user = Relationship.initializeRelation(userDomain)
    }

    return new PostChildComment(
      prismaPostCommentModel.id,
      prismaPostCommentModel.comment,
      prismaPostCommentModel.userId,
      // if it's a child comment we are sure the parentCommentId is not null
      prismaPostCommentModel.parentCommentId as string,
      DateTime.fromJSDate(prismaPostCommentModel.createdAt),
      DateTime.fromJSDate(prismaPostCommentModel.updatedAt),
      deletedAt,
      user
    )
  }

  public static toDatabase (postChildComment: PostChildComment): PrismaPostCommentModel {
    return {
      id: postChildComment.id,
      comment: postChildComment.comment,
      userId: postChildComment.userId,
      parentCommentId: postChildComment.parentCommentId,
      createdAt: postChildComment.createdAt.toJSDate(),
      deletedAt: postChildComment.deletedAt?.toJSDate() ?? null,
      updatedAt: postChildComment.updatedAt.toJSDate(),
      postId: null,
    }
  }
}
