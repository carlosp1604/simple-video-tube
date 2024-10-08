import { randomUUID } from 'crypto'
import { DateTime } from 'luxon'
import { PostChildComment } from './PostChildComment'
import { PostCommentDomainException } from './PostCommentDomainException'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { ReactionableModel } from '~/modules/Reactions/Domain/ReactionableModel'
import { Reaction, ReactionableType } from '~/modules/Reactions/Domain/Reaction'

export class PostComment extends ReactionableModel {
  public readonly id: string
  public comment: string
  public readonly postId: string
  public readonly userIp: string
  public readonly username: string
  public readonly createdAt: DateTime
  public updatedAt: DateTime
  public deletedAt: DateTime | null

  /** Relationships **/
  private _childComments: Collection<PostChildComment, PostChildComment['id']>

  public constructor (
    id: string,
    comment: string,
    postId: string,
    userIp: string,
    username: string,
    createdAt: DateTime,
    updatedAt: DateTime,
    deletedAt: DateTime | null,
    childComments: Collection<PostChildComment, PostChildComment['id']> = Collection.notLoaded(),
    reactions: Collection<Reaction, Reaction['userIp']> = Collection.notLoaded()
  ) {
    super()
    this.id = id
    this.comment = comment
    this.userIp = userIp
    this.username = username
    this.postId = postId
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
    this._childComments = childComments
    this.modelReactions = reactions
  }

  public addChildComment (
    comment: PostChildComment['comment'],
    userIp: string,
    username: string
  ): PostChildComment {
    const newChildComment = this.buildChildComment(comment, userIp, username)

    this._childComments.addItem(newChildComment, newChildComment.id)

    return newChildComment
  }

  public updateChild (
    postCommentId: PostComment['id'],
    comment: PostComment['comment']
  ): PostChildComment {
    // TODO: Fix this method
    const childComment = this._childComments.getItem(postCommentId)

    if (!childComment) {
      throw PostCommentDomainException.childCommentNotFound(postCommentId)
    }

    childComment.setComment(comment)
    childComment.setUpdatedAt(DateTime.now())
    this._childComments.addItem(childComment, postCommentId)

    return childComment
  }

  public setComment (comment: PostComment['comment']): void {
    this.comment = comment
  }

  public getChildComment (postChildCommentId: PostChildComment['id']): PostChildComment | null {
    return this._childComments.getItem(postChildCommentId)
  }

  public removeChildComment (
    postChildCommentId: PostChildComment['id'],
    userIp: PostChildComment['userIp']
  ): void {
    const childCommentToDelete = this._childComments.getItem(postChildCommentId)

    if (childCommentToDelete === null) {
      throw PostCommentDomainException.childCommentNotFound(postChildCommentId)
    }

    if (childCommentToDelete.userIp !== userIp) {
      throw PostCommentDomainException.userCannotDeleteChildComment(userIp, postChildCommentId)
    }

    const commentRemoved = this._childComments.removeItem(postChildCommentId)

    if (!commentRemoved) {
      throw PostCommentDomainException.cannotDeleteChildComment(postChildCommentId)
    }
  }

  get childComments (): PostChildComment[] {
    return this._childComments.values
  }

  public setUpdatedAt (value: PostComment['updatedAt']) {
    this.updatedAt = value
  }

  private buildChildComment (
    comment: PostComment['comment'],
    userIp: string,
    username: string
  ): PostChildComment {
    const nowDate = DateTime.now()

    return new PostChildComment(
      randomUUID(),
      comment,
      userIp,
      username,
      this.id,
      nowDate,
      nowDate,
      null
    )
  }

  public addReaction (userIp: Reaction['userIp'], reactionType: string): Reaction {
    return super.addReaction(this.id, ReactionableType.POST_COMMENT, userIp, reactionType)
  }

  public deleteReaction (userIp: Reaction['userIp']) {
    super.deleteReaction(this.id, ReactionableType.POST_COMMENT, userIp)
  }
}
