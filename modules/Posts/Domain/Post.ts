import { Category } from '~/modules/Categories/Domain/Category'
import { DateTime } from 'luxon'
import { PostComment } from './PostComments/PostComment'
import { Reaction, ReactionableType } from '~/modules/Reactions/Domain/Reaction'
import { PostDomainException } from './PostDomainException'
import { randomUUID } from 'crypto'
import { PostChildComment } from './PostComments/PostChildComment'
import { Producer } from '~/modules/Producers/Domain/Producer'
import { Actor } from '~/modules/Actors/Domain/Actor'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { PostCommentDomainException } from '~/modules/Posts/Domain/PostComments/PostCommentDomainException'
import { Translation } from '~/modules/Translations/Domain/Translation'
import { ReactionableModel } from '~/modules/Reactions/Domain/ReactionableModel'
import { TranslatableModel } from '~/modules/Translations/Domain/TranslatableModel'
import { applyMixins } from '~/helpers/Domain/Mixins'
import { PostMedia } from '~/modules/Posts/Domain/PostMedia/PostMedia'
import { Report } from '~/modules/Reports/Domain/Report'

export class Post {
  public readonly id: string
  public readonly title: string
  public readonly description: string
  public readonly slug: string
  public readonly duration: number
  public readonly trailerUrl: string | null
  public readonly thumbnailUrl: string
  public readonly externalUrl: string | null
  public readonly viewsCount: number
  public readonly resolution: number
  public readonly producerId: string | null
  public readonly actorId: string | null
  public readonly createdAt: DateTime
  public updatedAt: DateTime
  public deletedAt: DateTime | null
  public publishedAt: DateTime | null
  public releaseDate: DateTime | null

  /** Relationships **/
  private _categories: Collection<Category, Category['id']>
  private _actors: Collection<Actor, Actor['id']>
  private _comments: Collection<PostComment, PostComment['id']>
  private _producer: Relationship<Producer | null>
  private _actor: Relationship<Actor | null>
  private _postMedia: Collection<PostMedia, PostMedia['id']>
  private _reports: Collection<Report, string>

  public constructor (
    id: string,
    title: string,
    description: string,
    slug: string,
    duration: number,
    trailerUrl: string | null,
    thumbnailUrl: string,
    externalUrl: string | null,
    viewsCount: number,
    resolution: number,
    producerId: string | null,
    actorId: string | null,
    createdAt: DateTime,
    updatedAt: DateTime,
    deletedAt: DateTime | null,
    publishedAt: DateTime | null,
    releaseDate: DateTime | null,
    categories: Collection<Category, Category['id']> = Collection.notLoaded(),
    actors: Collection<Actor, Actor['id']> = Collection.notLoaded(),
    comments: Collection<PostComment, PostComment['id']> = Collection.notLoaded(),
    reactions: Collection<Reaction, Reaction['userIp']> = Collection.notLoaded(),
    producer: Relationship<Producer | null> = Relationship.notLoaded(),
    translations: Collection<Translation, Translation['language'] & Translation['field']> = Collection.notLoaded(),
    actor: Relationship<Actor | null> = Relationship.notLoaded(),
    postMedia: Collection<PostMedia, PostMedia['id']> = Collection.notLoaded(),
    reports: Collection<Report, Report['id']> = Collection.notLoaded()
  ) {
    this.id = id
    this.title = title
    this.description = description
    this.slug = slug
    this.duration = duration
    this.trailerUrl = trailerUrl
    this.thumbnailUrl = thumbnailUrl
    this.externalUrl = externalUrl
    this.viewsCount = viewsCount
    this.resolution = resolution
    this.producerId = producerId
    this.actorId = actorId
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
    this.publishedAt = publishedAt
    this.releaseDate = releaseDate
    this._categories = categories
    this._actors = actors
    this._comments = comments
    this._producer = producer
    this._actor = actor
    this._postMedia = postMedia
    this._reports = reports
    this.modelReactions = reactions
    this.modelTranslations = translations
  }

  public addChildComment (
    parentCommentId: PostComment['id'],
    comment: PostComment['comment'],
    userIp: string,
    username: string
  ): PostChildComment {
    const parentComment = this._comments.getItem(parentCommentId)

    if (!parentComment) {
      throw PostDomainException.parentCommentNotFound(parentCommentId)
    }

    return parentComment.addChildComment(comment, userIp, username)
  }

  public createPostReaction (userIp: Reaction['userIp'], reactionType: string): Reaction {
    return this.addReaction(this.id, ReactionableType.POST, userIp, reactionType)
  }

  public updatePostReaction (userIp: Reaction['userIp'], reactionType: string): Reaction {
    return this.addReaction(this.id, ReactionableType.POST, userIp, reactionType)
  }

  public deletePostReaction (userIp: Reaction['userIp']): void {
    return this.deleteReaction(this.id, ReactionableType.POST, userIp)
  }

  public deletePostMedia (postMedia: PostMedia): void {
    this._postMedia.removeItem(postMedia.id)
  }

  public addPostMedia (postMedia: PostMedia): void {
    this._postMedia.addItem(postMedia, postMedia.id)
  }

  public addReport (
    userIp: string,
    userName: string,
    userEmail: string,
    type: string,
    content: string
  ): Report | null {
    const existingReport = this._reports.values
      .find((report) => report.userIp === userIp && report.type === type)

    if (!existingReport) {
      const report = this.buildReport(userIp, userName, userEmail, type, content)

      this._reports.addItem(report, report.id)

      return report
    }

    return null
  }

  public addComment (
    comment: PostComment['comment'],
    userIp: string,
    username: string
  ): PostComment {
    const commentToAdd = this.buildComment(comment, userIp, username)

    this._comments.addItem(commentToAdd, commentToAdd.id)

    return commentToAdd
  }

  public deleteComment (postCommentId: PostComment['id'], userIp: PostComment['userIp']): void {
    const commentToRemove = this._comments.getItem(postCommentId)

    if (commentToRemove === null) {
      throw PostDomainException.postCommentNotFound(postCommentId)
    }

    if (commentToRemove.userIp !== userIp) {
      throw PostDomainException.userCannotDeleteComment(postCommentId, userIp)
    }

    const commentRemoved = this._comments.removeItem(postCommentId)

    if (!commentRemoved) {
      throw PostDomainException.cannotDeleteComment(postCommentId)
    }
  }

  public deleteChildComment (
    parentCommentId: PostComment['id'],
    postCommentId: PostChildComment['id'],
    userIp: PostChildComment['userIp']
  ): void {
    const parentComment = this._comments.getItem(parentCommentId)

    if (parentComment === null) {
      throw PostDomainException.parentCommentNotFound(parentCommentId)
    }

    try {
      parentComment.removeChildComment(postCommentId, userIp)
    } catch (exception: unknown) {
      if (!(exception instanceof PostCommentDomainException)) {
        throw exception
      }

      if (exception.id === PostCommentDomainException.childCommentNotFoundId) {
        throw PostDomainException.postCommentNotFound(postCommentId)
      }

      if (exception.id === PostCommentDomainException.userCannotDeleteChildCommentId) {
        throw PostDomainException.userCannotDeleteComment(userIp, postCommentId)
      }

      if (exception.id === PostCommentDomainException.cannotDeleteChildCommentId) {
        throw PostDomainException.cannotDeleteComment(postCommentId)
      }

      throw exception
    }
  }

  public updateComment (
    postCommentId: PostComment['id'],
    comment: PostComment['comment']
  ): PostComment {
    // TODO: Fix this method
    const commentToUpdate = this._comments.getItem(postCommentId)

    if (!commentToUpdate) {
      throw PostDomainException.cannotUpdateComment(postCommentId)
    }

    if (commentToUpdate.comment === comment) {
      return commentToUpdate
    }

    commentToUpdate.setComment(comment)
    commentToUpdate.setUpdatedAt(DateTime.now())
    this._comments.addItem(commentToUpdate, commentToUpdate.id)

    return commentToUpdate
  }

  public createComment (postComment: PostComment): void {
    this._comments.addItem(postComment, postComment.id)
  }

  get categories (): Category[] {
    return this._categories.values
  }

  get actors (): Actor[] {
    return this._actors.values
  }

  get comments (): PostComment[] {
    return this._comments.values
  }

  get producer (): Producer | null {
    return this._producer.value
  }

  get postMedia (): Array<PostMedia> {
    return this._postMedia.values
  }

  get actor (): Actor | null {
    return this._actor.value
  }

  get removedPostMedia (): Array<PostMedia> {
    return this._postMedia.removedValues
  }

  public setProducer (producer: Producer): void {
    if (this.producer !== null) {
      throw PostDomainException.producerAlreadySet(this.id)
    }

    this._producer = Relationship.createRelation(producer)
  }

  private buildComment (
    comment: PostComment['comment'],
    userIp: string,
    username: string
  ): PostComment {
    const nowDate = DateTime.now()

    return new PostComment(
      randomUUID(),
      comment,
      this.id,
      userIp,
      username,
      nowDate,
      nowDate,
      null
    )
  }

  private buildReport (
    userIp: string,
    userName: string,
    userEmail: string,
    type: string,
    content: string
  ): Report {
    const nowDate = DateTime.now()

    return new Report(
      randomUUID(),
      this.id,
      type,
      userIp,
      userName,
      userEmail,
      content,
      nowDate,
      nowDate
    )
  }
}

export interface Post extends ReactionableModel, TranslatableModel {}

applyMixins(Post, [ReactionableModel, TranslatableModel])
