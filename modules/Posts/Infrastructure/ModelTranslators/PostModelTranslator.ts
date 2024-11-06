import { RepositoryOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { CategoryModelTranslator } from '~/modules/Categories/Infrastructure/CategoryModelTranslator'
import { DateTime } from 'luxon'
import { PostCommentModelTranslator } from './PostCommentModelTranslator'
import { Post as PostPrismaModel } from '@prisma/client'
import {
  PostWithActor,
  PostWithActors,
  PostWithComments,
  PostWithProducerWithParent,
  PostWithReactions,
  PostWithCategories, PostWithTranslations, PostWithPostMediaWithMediaUrlWithProvider, PostWithReports
} from '~/modules/Posts/Infrastructure/PrismaModels/PostModel'
import { Post } from '~/modules/Posts/Domain/Post'
import { ProducerModelTranslator } from '~/modules/Producers/Infrastructure/ProducerModelTranslator'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { Category } from '~/modules/Categories/Domain/Category'
import { Actor } from '~/modules/Actors/Domain/Actor'
import { PostComment } from '~/modules/Posts/Domain/PostComments/PostComment'
import { Producer } from '~/modules/Producers/Domain/Producer'
import { Reaction } from '~/modules/Reactions/Domain/Reaction'
import { Translation } from '~/modules/Translations/Domain/Translation'
import { TranslationModelTranslator } from '~/modules/Translations/Infrastructure/TranslationModelTranslator'
import {
  PostCommentRepositoryOptions
} from '~/modules/Posts/Domain/PostComments/PostCommentRepositoryInterface'
import { ReactionModelTranslator } from '~/modules/Reactions/Infrastructure/ReactionModelTranslator'
import { PostMediaModelTranslator } from '~/modules/Posts/Infrastructure/ModelTranslators/PostMediaModelTranslator'
import { PostMedia } from '~/modules/Posts/Domain/PostMedia/PostMedia'
import { ActorModelTranslator } from '~/modules/Actors/Infrastructure/ActorModelTranslator'
import { ReportModelTranslator } from '~/modules/Reports/Infrastructure/ReportModelTranslator'
import { Report } from '~/modules/Reports/Domain/Report'

export class PostModelTranslator {
  public static toDomain (
    prismaPostModel: PostPrismaModel,
    options: RepositoryOptions[] = []
  ) {
    let publishedAt: DateTime | null = null
    let deletedAt: DateTime | null = null
    let releaseDate: DateTime | null = null

    if (prismaPostModel.releaseDate !== null) {
      releaseDate = DateTime.fromJSDate(prismaPostModel.releaseDate)
    }
    if (prismaPostModel.publishedAt !== null) {
      publishedAt = DateTime.fromJSDate(prismaPostModel.publishedAt)
    }

    if (prismaPostModel.deletedAt !== null) {
      deletedAt = DateTime.fromJSDate(prismaPostModel.deletedAt)
    }

    let tagsCollection: Collection<Category, Category['id']> = Collection.notLoaded()
    let actorsCollection: Collection<Actor, Actor['id']> = Collection.notLoaded()
    let commentsCollection: Collection<PostComment, PostComment['id']> = Collection.notLoaded()
    let reactionsCollection: Collection<Reaction, Reaction['userIp']> = Collection.notLoaded()
    let producerRelationship: Relationship<Producer | null> = Relationship.notLoaded()
    let actorRelationship: Relationship<Actor | null> = Relationship.notLoaded()
    let reportsCollection: Collection<Report, Report['id']> = Collection.notLoaded()
    let translationsCollection: Collection<Translation, Translation['language'] & Translation['field']> =
      Collection.notLoaded()
    let postMediaCollection: Collection<PostMedia, PostMedia['id']> = Collection.notLoaded()

    if (options.includes('categories')) {
      tagsCollection = Collection.initializeCollection()
      const postWithCategories = prismaPostModel as PostWithCategories

      for (let i = 0; i < postWithCategories.categories.length; i++) {
        const postTagDomain = CategoryModelTranslator.toDomain(postWithCategories.categories[i].category)

        tagsCollection.addItem(postTagDomain, postTagDomain.id)
      }
    }

    if (options.includes('actors')) {
      actorsCollection = Collection.initializeCollection()
      const postWithActor = prismaPostModel as PostWithActors

      for (let i = 0; i < postWithActor.actors.length; i++) {
        const actorDomain = ActorModelTranslator.toDomain(postWithActor.actors[i].actor)

        actorsCollection.addItem(actorDomain, actorDomain.id)
      }
    }

    if (options.includes('comments')) {
      commentsCollection = Collection.initializeCollection()
      const postWithComments = prismaPostModel as PostWithComments

      const commentsOptions =
        PostCommentRepositoryOptions.filter((option) => options.includes(option))

      for (let i = 0; i < postWithComments.comments.length; i++) {
        const commentDomain = PostCommentModelTranslator.toDomain(
          postWithComments.comments[i], commentsOptions
        )

        commentsCollection.addItem(commentDomain, commentDomain.id)
      }
    }

    if (options.includes('reactions')) {
      reactionsCollection = Collection.initializeCollection()
      const postWithReactions = prismaPostModel as PostWithReactions

      for (let i = 0; i < postWithReactions.reactions.length; i++) {
        const reactionDomain = ReactionModelTranslator.toDomain(postWithReactions.reactions[i])

        reactionsCollection.addItem(reactionDomain, reactionDomain.userIp)
      }
    }

    if (options.includes('producer')) {
      const postWithProducer = prismaPostModel as PostWithProducerWithParent

      if (postWithProducer.producer !== null) {
        const producerDomain = ProducerModelTranslator.toDomain(postWithProducer.producer)

        producerRelationship = Relationship.initializeRelation(producerDomain)
      } else {
        producerRelationship = Relationship.initializeRelation(null)
      }
    }

    if (options.includes('actor')) {
      const postWithActor = prismaPostModel as PostWithActor

      if (postWithActor.actor !== null) {
        const actorDomain = ActorModelTranslator.toDomain(postWithActor.actor)

        actorRelationship = Relationship.initializeRelation(actorDomain)
      } else {
        actorRelationship = Relationship.initializeRelation(null)
      }
    }

    if (options.includes('translations')) {
      const postWithTranslations = prismaPostModel as PostWithTranslations

      translationsCollection = Collection.initializeCollection()

      postWithTranslations.translations.forEach((translation) => {
        const domainTranslation = TranslationModelTranslator.toDomain(translation)

        translationsCollection.addItem(
          domainTranslation, translation.language + translation.field
        )
      })
    }

    if (options.includes('postMedia')) {
      const postWithPostMediaWithMediaUrlWithProvider = prismaPostModel as PostWithPostMediaWithMediaUrlWithProvider

      postMediaCollection = Collection.initializeCollection()

      postWithPostMediaWithMediaUrlWithProvider.postMedia.forEach((postMedia) => {
        const domainPostMedia = PostMediaModelTranslator.toDomain(postMedia)

        postMediaCollection.addItem(domainPostMedia, domainPostMedia.id)
      })
    }

    if (options.includes('reports')) {
      reportsCollection = Collection.initializeCollection()
      const postWithReports = prismaPostModel as PostWithReports

      for (let i = 0; i < postWithReports.reports.length; i++) {
        const reportDomain = ReportModelTranslator.toDomain(postWithReports.reports[i])

        reportsCollection.addItem(reportDomain, reportDomain.id)
      }
    }

    return new Post(
      prismaPostModel.id,
      prismaPostModel.title,
      prismaPostModel.description,
      prismaPostModel.slug,
      prismaPostModel.duration,
      prismaPostModel.trailerUrl,
      prismaPostModel.thumbnailUrl,
      prismaPostModel.externalUrl,
      Number.parseInt(prismaPostModel.viewsCount.toString()),
      prismaPostModel.resolution,
      prismaPostModel.producerId,
      prismaPostModel.actorId,
      DateTime.fromJSDate(prismaPostModel.createdAt),
      DateTime.fromJSDate(prismaPostModel.updatedAt),
      deletedAt,
      publishedAt,
      releaseDate,
      tagsCollection,
      actorsCollection,
      commentsCollection,
      reactionsCollection,
      producerRelationship,
      translationsCollection,
      actorRelationship,
      postMediaCollection,
      reportsCollection
    )
  }

  public static toDatabase (post: Post): PostPrismaModel {
    return {
      id: post.id,
      description: post.description,
      slug: post.slug,
      duration: post.duration,
      trailerUrl: post.trailerUrl,
      thumbnailUrl: post.thumbnailUrl,
      externalUrl: post.externalUrl,
      resolution: post.resolution,
      title: post.title,
      producerId: post.producerId,
      actorId: post.actorId,
      publishedAt: post.publishedAt?.toJSDate() ?? null,
      createdAt: post.createdAt.toJSDate(),
      deletedAt: post.deletedAt?.toJSDate() ?? null,
      releaseDate: post.releaseDate?.toJSDate() ?? null,
      updatedAt: post.updatedAt.toJSDate(),
      viewsCount: BigInt(post.viewsCount),
    }
  }
}
