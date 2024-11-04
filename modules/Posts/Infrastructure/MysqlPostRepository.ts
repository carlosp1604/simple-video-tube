import { PostRepositoryInterface, RepositoryOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { PostModelTranslator } from './ModelTranslators/PostModelTranslator'
import { PostCommentModelTranslator } from './ModelTranslators/PostCommentModelTranslator'
import { Prisma } from '@prisma/client'
import { PostChildCommentModelTranslator } from './ModelTranslators/PostChildCommentModelTranslator'
import { Post } from '~/modules/Posts/Domain/Post'
import { prisma } from '~/persistence/prisma'
import {
  PostsWithViewsInterfaceWithTotalCount, PostWithViewsCommentsReactionsInterface,
  PostWithViewsInterface
} from '~/modules/Posts/Domain/PostWithCountInterface'
import { PostSortingOption } from '~/modules/Shared/Domain/Posts/PostSorting'
import { Reaction, ReactionableType } from '~/modules/Reactions/Domain/Reaction'
import { PostComment } from '~/modules/Posts/Domain/PostComments/PostComment'
import { PostChildComment } from '~/modules/Posts/Domain/PostComments/PostChildComment'
import { ReactionModelTranslator } from '~/modules/Reactions/Infrastructure/ReactionModelTranslator'
import { DefaultArgs } from '@prisma/client/runtime/library'
import { PostUserInteraction } from '~/modules/Posts/Domain/PostUserInteraction'
import { PostFilterOptionInterface } from '~/modules/Shared/Domain/Posts/PostFilterOption'
import { SortingCriteria } from '~/modules/Shared/Domain/SortingCriteria'
import { TranslationModelTranslator } from '~/modules/Translations/Infrastructure/TranslationModelTranslator'
import { PostMediaModelTranslator } from '~/modules/Posts/Infrastructure/ModelTranslators/PostMediaModelTranslator'
import { MediaUrlModelTranslator } from '~/modules/Posts/Infrastructure/ModelTranslators/MediaUrlModelTranslator'
import { DateTime } from 'luxon'
import { PostMediaType } from '~/modules/Posts/Domain/PostMedia/PostMedia'
import PostOrderByWithRelationInput = Prisma.PostOrderByWithRelationInput;
import { ReactionType } from '~/modules/Reactions/Infrastructure/ReactionType'

export class MysqlPostRepository implements PostRepositoryInterface {
  /**
   * Insert a Post in the persistence layer
   * @param post Post to persist
   */
  public async save (post: Post): Promise<void> {
    const prismaPostModel = PostModelTranslator.toDatabase(post)
    const translations = Array.from(post.translations.values()).flat()
      .map((translation) => { return TranslationModelTranslator.toDatabase(translation) })

    return prisma.$transaction(async (transaction) => {
      await transaction.post.create({
        data: {
          ...prismaPostModel,
          categories: {
            connectOrCreate: post.categories.map((category) => {
              return {
                where: {
                  postId_categoryId: {
                    postId: post.id,
                    categoryId: category.id,
                  },
                },
                create: {
                  createdAt: DateTime.now().toJSDate(),
                  updatedAt: DateTime.now().toJSDate(),
                  categoryId: category.id,
                },
              }
            }),
          },
          actors: {
            connectOrCreate: post.actors.map((actor) => {
              return {
                where: {
                  postId_actorId: {
                    postId: post.id,
                    actorId: actor.id,
                  },
                },
                create: {
                  createdAt: DateTime.now().toJSDate(),
                  updatedAt: DateTime.now().toJSDate(),
                  actorId: actor.id,
                },
              }
            }),
          },
          translations: {
            connectOrCreate: translations.map((translation) => {
              return {
                where: {
                  translatableId_field_translatableType_language: {
                    language: translation.language,
                    translatableType: translation.translatableType,
                    field: translation.field,
                    translatableId: translation.translatableId,
                  },
                },
                create: {
                  createdAt: translation.createdAt,
                  updatedAt: translation.updatedAt,
                  language: translation.language,
                  translatableType: translation.translatableType,
                  field: translation.field,
                  value: translation.value,
                },
              }
            }),
          },
        },
      })

      for (const postMedia of post.postMedia) {
        const postMediaModel = PostMediaModelTranslator.toDatabase(postMedia)
        const mediaUrls = postMedia.mediaUrls.map((mediaUrl) => {
          return MediaUrlModelTranslator.toDatabase(mediaUrl)
        })

        await transaction.postMedia.create({
          data: {
            postId: postMediaModel.postId,
            updatedAt: postMediaModel.updatedAt,
            createdAt: postMediaModel.createdAt,
            type: postMediaModel.type,
            title: postMediaModel.title,
            thumbnailUrl: postMediaModel.thumbnailUrl,
            id: postMediaModel.id,
            mediaUrls: {
              create: mediaUrls.map((mediaUrl) => {
                return {
                  createdAt: mediaUrl.createdAt,
                  updatedAt: mediaUrl.updatedAt,
                  type: mediaUrl.type,
                  title: mediaUrl.title,
                  url: mediaUrl.url,
                  provider: {
                    connect: {
                      id: mediaUrl.mediaProviderId,
                    },
                  },
                }
              }),
            },
          },
        })
      }
    }, { timeout: 100000 })
  }

  /**
   * Specific use-case for post media update
   * Get a post given its slug with its post media
   * Ignore whether post is deleted or is not published
   * @param slug Post Slug
   * @return Post if found or null
   */
  public async getPostBySlugWithPostMedia (slug: Post['slug']): Promise<Post | null> {
    const post = await prisma.post.findFirst({
      where: {
        slug,
      },
      include: {
        postMedia: {
          include: {
            mediaUrls: {
              include: {
                provider: true,
              },
            },
          },
        },
      },
    })

    if (!post) {
      return null
    }

    return PostModelTranslator.toDomain(post, ['postMedia'])
  }

  /**
   * Specific use-case for post media update
   * Update post media
   * v1: Work in replace mode
   * @param post Post
   */
  public async updatePostBySlugWithPostMedia (post: Post): Promise<void> {
    const removedPostMedia = post.removedPostMedia
    const postMedia = post.postMedia

    await prisma.$transaction(async (transaction) => {
      if (postMedia.length > 0) {
        for (const media of postMedia) {
          if (media.type === PostMediaType.VIDEO) {
            continue
          }

          const postMediaModel = PostMediaModelTranslator.toDatabase(media)
          const mediaUrls = media.mediaUrls.map((mediaUrl) => {
            return MediaUrlModelTranslator.toDatabase(mediaUrl)
          })

          await transaction.postMedia.create({
            data: {
              postId: postMediaModel.postId,
              updatedAt: postMediaModel.updatedAt,
              createdAt: postMediaModel.createdAt,
              type: postMediaModel.type,
              title: postMediaModel.title,
              thumbnailUrl: postMediaModel.thumbnailUrl,
              id: postMediaModel.id,
              mediaUrls: {
                create: mediaUrls.map((mediaUrl) => {
                  return {
                    createdAt: mediaUrl.createdAt,
                    updatedAt: mediaUrl.updatedAt,
                    type: mediaUrl.type,
                    title: mediaUrl.title,
                    url: mediaUrl.url,
                    provider: {
                      connect: {
                        id: mediaUrl.mediaProviderId,
                      },
                    },
                  }
                }),
              },
            },
          })
        }
      }

      if (removedPostMedia.length > 0) {
        await transaction.post.update({
          where: {
            slug: post.slug,
          },
          data: {
            postMedia: {
              delete: removedPostMedia.map((removedMedia) => ({
                id: removedMedia.id,
              })),
            },
          },
        })
      }
    }, { timeout: 100000 })
  }

  /**
   * Find a Post (with producer,categories,meta,actors relationships loaded and reactions/comments count) given its Slug
   * @param slug Post Slug
   * @return PostWithCount if found or null
   */
  public async findBySlugWithCount (slug: Post['slug']): Promise<PostWithViewsCommentsReactionsInterface | null> {
    const postQuery = prisma.post.findFirst({
      where: {
        slug,
        // deletedAt: null,
        publishedAt: {
          not: null,
          lte: new Date(),
        },
      },
      include: {
        _count: {
          select: {
            comments: true,
          },
        },
        producer: true,
        actors: {
          include: {
            actor: true,
          },
        },
        actor: true,
        translations: true,
        categories: {
          include: {
            category: {
              include: {
                translations: true,
              },
            },
          },
        },
        postMedia: {
          include: {
            mediaUrls: {
              include: {
                provider: true,
              },
            },
          },
        },
      },
    })

    const countLikesQuery = prisma.reaction.count({
      where: {
        post: {
          slug,
        },
        reactionType: ReactionType.LIKE,
      },
    })

    const countDislikesQuery = prisma.reaction.count({
      where: {
        post: {
          slug,
        },
        reactionType: ReactionType.DISLIKE,
      },
    })

    const [post, likes, dislikes] = await prisma.$transaction([
      postQuery,
      countLikesQuery,
      countDislikesQuery,
    ])

    if (post === null) {
      return null
    }

    return {
      post: PostModelTranslator.toDomain(post, [
        'producer',
        'actors',
        'actor',
        'categories',
        'translations',
        'postMedia',
      ]),
      postComments: post._count.comments,
      reactions: {
        dislike: dislikes,
        like: likes,
      },
    }
  }

  /**
   * Find a Post given its ID
   * @param postId Post ID
   * @param options Post relations to load
   * @return Post if found or null
   */
  public async findById (
    postId: Post['id'],
    options: RepositoryOptions[] = []
  ): Promise<Post | PostWithViewsInterface | null> {
    let includeComments: boolean | Prisma.Post$commentsArgs<DefaultArgs> | undefined = false
    let includeProducer: boolean | Prisma.Post$producerArgs<DefaultArgs> | undefined = false
    let includeActors: boolean | Prisma.Post$actorsArgs<DefaultArgs> | undefined = false
    let includeCategories: boolean | Prisma.Post$categoriesArgs<DefaultArgs> | undefined

    if (options.includes('comments')) {
      includeComments = true
    }

    if (options.includes('comments.childComments')) {
      includeComments = {
        include: {
          childComments: true,
        },
      }
    }

    if (options.includes('producer') || options.includes('producer.parentProducer')) {
      includeProducer = {
        include: {
          parentProducer: options.includes('producer.parentProducer'),
        },
      }
    }

    if (options.includes('actors')) {
      includeActors = {
        include: {
          actor: options.includes('actors'),
        },
      }
    }

    if (options.includes('categories')) {
      includeCategories = {
        include: {
          category: options.includes('categories'),
        },
      }
    }

    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        deletedAt: null,
        publishedAt: {
          not: null,
          lte: new Date(),
        },
      },
      include: {
        producer: includeProducer,
        actors: includeActors,
        comments: includeComments,
        reactions: options.includes('reactions'),
        reports: options.includes('reports'),
        categories: includeCategories,
        translations: options.includes('translations'),
        actor: options.includes('actor'),
      },
    })

    if (post === null) {
      return null
    }

    if (options.includes('viewsCount')) {
      return {
        post: PostModelTranslator.toDomain(post, options),
      }
    }

    return PostModelTranslator.toDomain(post, options)
  }

  /**
   * Find Posts based on filter and order criteria
   * @param offset Post offset
   * @param limit
   * @param sortingOption Post sorting option
   * @param sortingCriteria Post sorting criteria
   * @param filters Post filters
   * @return PostsWithViewsInterfaceWithTotalCount
   */
  public async findWithOffsetAndLimit (
    offset: number,
    limit: number,
    sortingOption: PostSortingOption,
    sortingCriteria: SortingCriteria,
    filters: PostFilterOptionInterface[]
  ): Promise<PostsWithViewsInterfaceWithTotalCount> {
    const includeFilters = MysqlPostRepository.buildIncludes(filters)
    const whereFilters = MysqlPostRepository.buildFilters(filters)
    const sortCriteria = MysqlPostRepository.buildOrder(sortingOption, sortingCriteria)

    const [posts, postsNumber] = await prisma.$transaction([
      prisma.post.findMany({
        where: whereFilters,
        include: {
          ...includeFilters,
        },
        take: limit,
        skip: offset,
        orderBy: sortCriteria,
      }),
      prisma.post.count({
        where: whereFilters,
      }),
    ])

    return {
      posts: posts.map((post) => {
        return {
          post: PostModelTranslator.toDomain(post, ['producer', 'actor', 'translations']),
          postViews: Number.parseInt(post.viewsCount.toString()),
        }
      }),
      count: postsNumber,
    }
  }

  /**
   * Count Posts based on filter
   * @param filters Post filters
   * @return Number of posts that accomplish the filters
   */
  public async countPostsWithFilters (
    filters: PostFilterOptionInterface[]
  ): Promise<number> {
    const whereClause = MysqlPostRepository.buildFilters(filters)

    return prisma.post.count({
      where: whereClause,
    })
  }

  /**
   * Add a new Post Reaction
   * @param reaction Reaction
   */
  public async createReaction (reaction: Reaction): Promise<void> {
    const prismaReactionModel = ReactionModelTranslator.toDatabase(reaction)

    await prisma.post.update({
      where: {
        id: reaction.reactionableId,
      },
      data: {
        reactions: {
          create: {
            reactionType: prismaReactionModel.reactionType,
            createdAt: prismaReactionModel.createdAt,
            updatedAt: prismaReactionModel.updatedAt,
            deletedAt: prismaReactionModel.deletedAt,
            userIp: prismaReactionModel.userIp,
            reactionableType: prismaReactionModel.reactionableType,
          },
        },
      },
    })
  }

  /**
   * Update a new Post Reaction
   * @param reaction Reaction
   */
  public async updateReaction (reaction: Reaction): Promise<void> {
    throw Error()
  }

  /**
   * Delete a Post Reaction
   * @param userIp User IP
   * @param postId Post ID
   */
  public async deleteReaction (userIp: Reaction['userIp'], postId: Reaction['reactionableId']): Promise<void> {
    await prisma.reaction.delete({
      where: {
        reactionableType_reactionableId_userIp: {
          reactionableId: postId,
          reactionableType: ReactionableType.POST,
          userIp,
        },
      },
    })
  }

  /**
   * Add a new Post Comment
   * @param comment PostComment
   */
  public async createComment (comment: PostComment): Promise<void> {
    const prismaPostCommentModel = PostCommentModelTranslator.toDatabase(comment)

    await prisma.post.update({
      where: {
        id: comment.postId,
      },
      data: {
        comments: {
          create: {
            id: prismaPostCommentModel.id,
            comment: prismaPostCommentModel.comment,
            userIp: prismaPostCommentModel.userIp,
            userName: prismaPostCommentModel.userName,
            parentCommentId: prismaPostCommentModel.parentCommentId,
            createdAt: prismaPostCommentModel.createdAt,
            deletedAt: prismaPostCommentModel.deletedAt,
            updatedAt: prismaPostCommentModel.updatedAt,
          },
        },
      },
    })
  }

  /**
   * Add a new Post Child Comment
   * @param childComment Post Child Comment
   */
  public async createChildComment (childComment: PostChildComment): Promise<void> {
    const prismaChildCommentModel = PostChildCommentModelTranslator.toDatabase(childComment)

    await prisma.postComment.update({
      where: {
        id: childComment.parentCommentId,
      },
      data: {
        childComments: {
          create: {
            id: prismaChildCommentModel.id,
            comment: prismaChildCommentModel.comment,
            userIp: prismaChildCommentModel.userIp,
            userName: prismaChildCommentModel.userName,
            createdAt: prismaChildCommentModel.createdAt,
            updatedAt: prismaChildCommentModel.updatedAt,
            deletedAt: prismaChildCommentModel.deletedAt,
          },
        },
      },
    })
  }

  /**
   * Delete a Post Comment
   * @param commentId Post Comment ID
   */
  public async deleteComment (commentId: PostComment['id']): Promise<void> {
    await prisma.$transaction([
      prisma.postComment.deleteMany({
        where: {
          OR: [
            {
              id: commentId,
            },
            {
              parentCommentId: commentId,
            },
          ],
        },
      }),
      prisma.reaction.deleteMany({
        where: {
          reactionableId: commentId,
          reactionableType: ReactionableType.POST_COMMENT,
        },
      }),
    ])
  }

  /**
   * Get posts related to another post given its ID
   * @param postId Post ID
   * @return Post array with the related posts
   */
  public async getRelatedPosts (postId: Post['id']): Promise<PostWithViewsInterface[]> {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        actors: true,
        producer: true,
      },
    })

    if (post === null) {
      return []
    }

    let whereProducerId: string | Prisma.StringNullableFilter | null | undefined
    let whereActorId: string | Prisma.StringNullableFilter | null | undefined
    let whereActors: Prisma.PostActorListRelationFilter | undefined

    if (post.producerId !== null) {
      whereProducerId = post.producerId
    }

    if (post.actorId !== null) {
      whereActorId = post.actorId
    }

    if (post.actors.length > 0) {
      whereActors = {
        some: {
          actorId: {
            in: post.actors.map(
              (actor) => {
                return actor.actorId
              }
            ),
          },
        },
      }
    }

    const posts = await prisma.post.findMany({
      where: {
        id: {
          not: {
            equals: post.id,
          },
        },
        deletedAt: null,
        publishedAt: {
          not: null,
          lte: new Date(),
        },
        OR: [
          { producerId: whereProducerId },
          { actors: whereActors },
          { actorId: whereActorId },
        ],
      },
      include: {
        producer: true,
        actor: true,
        translations: true,
      },
      // TODO: Fix this hardcoded number
      take: 20,
      orderBy: {
        viewsCount: 'desc',
      },
    })

    return posts.map((post) => {
      return {
        post: PostModelTranslator.toDomain(post, [
          'producer',
          'translations',
          'actor',
        ]),
        postViews: Number.parseInt(post.viewsCount.toString()),
      }
    })
  }

  /**
   * Create a new post view for a post given its ID
   * @param postId Post ID
   */
  public async createPostView (postId: Post['id']): Promise<void> {
    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        viewsCount: {
          increment: 1,
        },
      },
    })
  }

  /**
   * Find all user interaction with a post given its IDs
   * @param postId Post ID
   * @param userIp User IP
   * @return PostUserInteraction
   */
  public async findUserInteraction (postId: Post['id'], userIp: string): Promise<PostUserInteraction> {
    const [reaction] = await prisma.$transaction([
      prisma.reaction.findFirst({
        where: {
          reactionableId: postId,
          userIp,
        },
      }),
    ])

    let userReaction: Reaction | null = null

    if (reaction !== null) {
      userReaction = ReactionModelTranslator.toDomain(reaction)
    }

    return {
      reaction: userReaction,
    }
  }

  /**
   * Get a random post slug
   * @return Post slug
   */
  public async getRandomPostSlug (): Promise<string> {
    const postsCount = await prisma.post.count()

    const post = await prisma.post.findFirst({
      take: 1,
      skip: Math.floor(Math.random() * (postsCount - 1)),
    })

    return post ? post.slug : ''
  }

  private static buildFilters (
    filters: PostFilterOptionInterface[]
  ): Prisma.PostWhereInput | undefined {
    let whereClause: Prisma.PostWhereInput | undefined = {
      publishedAt: {
        not: null,
      },
      deletedAt: null,
    }

    for (const filter of filters) {
      if (filter.type === 'postTitle') {
        whereClause = {
          ...whereClause,
          OR: [
            {
              title: {
                contains: filter.value,
              },
            },
            {
              description: {
                contains: filter.value,
              },
            },
            {
              translations: {
                some: {
                  value: {
                    contains: filter.value,
                  },
                },
              },
            },
          ],
        }
      }

      if (filter.type.startsWith('producer')) {
        if (filter.type === 'producerSlug') {
          whereClause = {
            ...whereClause,
            producer: {
              slug: filter.value,
            },
          }
        }
      }

      if (filter.type.startsWith('actor')) {
        if (filter.type === 'actorId') {
          whereClause = {
            ...whereClause,
            actors: {
              some: {
                actor: {
                  id: filter.value,
                },
              },
            },
          }
        }

        if (filter.type === 'actorSlug') {
          whereClause = {
            ...whereClause,
            actors: {
              some: {
                actor: {
                  slug: filter.value,
                },
              },
            },
          }
        }
      }

      if (filter.type === 'categorySlug') {
        whereClause = {
          ...whereClause,
          categories: {
            some: {
              category: {
                slug: filter.value,
              },
            },
          },
        }
      }
    }

    return whereClause
  }

  private static buildIncludes (
    filters: PostFilterOptionInterface[]
  ): Prisma.PostInclude | null | undefined {
    let includes: Prisma.PostInclude | null | undefined = {
      producer: true,
      actor: true,
      translations: true,
    }

    for (const filter of filters) {
      if (filter.type.startsWith('producer')) {
        includes = {
          ...includes,
          producer: true,
        }
      }

      if (filter.type.startsWith('actor')) {
        includes = {
          ...includes,
          actors: true,
        }
      }
    }

    return includes
  }

  private static buildOrder (
    sortingOption: PostSortingOption,
    sortingCriteria: SortingCriteria
  ): PostOrderByWithRelationInput | undefined {
    let sortCriteria: PostOrderByWithRelationInput | undefined

    if (sortingOption === 'date') {
      sortCriteria = {
        publishedAt: sortingCriteria,
      }
    }

    if (sortingOption === 'views') {
      sortCriteria = {
        viewsCount: sortingCriteria,
      }
    }

    return sortCriteria
  }
}
