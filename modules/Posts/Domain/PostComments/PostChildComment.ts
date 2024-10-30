import { DateTime } from 'luxon'
import { ReactionableModel } from '~/modules/Reactions/Domain/ReactionableModel'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { Reaction, ReactionableType } from '~/modules/Reactions/Domain/Reaction'

export class PostChildComment extends ReactionableModel {
  public readonly id: string
  public comment: string
  public readonly userIp: string
  public readonly userName: string
  public readonly parentCommentId: string
  public readonly createdAt: DateTime
  public updatedAt: DateTime
  public deletedAt: DateTime | null

  public constructor (
    id: string,
    comment: string,
    userIp: string,
    userName: string,
    parentCommentId: string,
    createdAt: DateTime,
    updatedAt: DateTime,
    deletedAt: DateTime | null,
    reactions: Collection<Reaction, Reaction['userIp']> = Collection.notLoaded()
  ) {
    super()
    this.id = id
    this.comment = comment
    this.userIp = userIp
    this.userName = userName
    this.parentCommentId = parentCommentId
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
    this.modelReactions = reactions
  }

  public setComment (comment: PostChildComment['comment']): void {
    this.comment = comment
  }

  public setUpdatedAt (value: PostChildComment['updatedAt']) {
    this.updatedAt = value
  }

  public addReaction (userIp: Reaction['userIp'], reactionType: string): Reaction {
    return super.addReaction(this.id, ReactionableType.POST_COMMENT, userIp, reactionType)
  }

  public deleteReaction (userIp: Reaction['userIp']) {
    super.deleteReaction(this.id, ReactionableType.POST_COMMENT, userIp)
  }
}
