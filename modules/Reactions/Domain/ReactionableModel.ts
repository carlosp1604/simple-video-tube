import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { Reaction } from '~/modules/Reactions/Domain/Reaction'
import { DateTime } from 'luxon'
import { ReactionableModelDomainException } from '~/modules/Reactions/Domain/ReactionableModelDomainException'

export abstract class ReactionableModel {
  private _reactions: Collection<Reaction, Reaction['userIp']> = Collection.notLoaded()

  get reactions (): Reaction[] {
    return this._reactions.values
  }

  get modelReactions (): Collection<Reaction, Reaction['userIp']> {
    return this._reactions
  }

  set modelReactions (reactions: Collection<Reaction, Reaction['userIp']>) {
    this._reactions = reactions
  }

  public addReaction (
    reactionableId: Reaction['reactionableId'],
    reactionableType: Reaction['reactionableType'],
    userIp: Reaction['userIp'],
    reactionType: string
  ): Reaction {
    const existingReaction = this._reactions.getItem(userIp)

    // If reaction already exists and is the same type then throw exception
    // If reaction already exists and is the same type then we update it
    if (existingReaction) {
      if (existingReaction.isSameReactionType(reactionType)) {
        throw ReactionableModelDomainException.userAlreadyReacted(userIp, reactionableId, reactionableType)
      } else {
        existingReaction.updateReactionType(reactionType)
        existingReaction.setUpdatedAt(DateTime.now())

        return existingReaction
      }
    }

    try {
      const postReaction = this.buildReaction(reactionableId, reactionableType, userIp, reactionType)

      this._reactions.addItem(postReaction, postReaction.userIp)

      return postReaction
    } catch (exception: unknown) {
      throw ReactionableModelDomainException.cannotAddReaction(userIp, reactionableId, reactionableType)
    }
  }

  public updateReaction (
    reactionableId: Reaction['reactionableId'],
    reactionableType: Reaction['reactionableType'],
    userIp: Reaction['userIp'],
    reactionType: Reaction['reactionType']
  ): Reaction {
    const existingReaction = this._reactions.getItem(userIp)

    if (!existingReaction) {
      throw ReactionableModelDomainException.userHasNotReacted(userIp, reactionableId, reactionableType)
    }

    if (existingReaction.reactionType === reactionType) {
      return existingReaction
    }

    try {
      existingReaction.setReactionType(reactionType)
      existingReaction.setUpdatedAt(DateTime.now())
    } catch (exception: unknown) {
      throw ReactionableModelDomainException.cannotUpdateReaction(userIp, reactionableId, reactionableType)
    }

    this._reactions.addItem(existingReaction, userIp)

    return existingReaction
  }

  public deleteReaction (
    reactionableId: Reaction['reactionableId'],
    reactionableType: Reaction['reactionableType'],
    userIp: Reaction['userIp']
  ): void {
    const reactionRemoved = this._reactions.removeItem(userIp)

    if (!reactionRemoved) {
      throw ReactionableModelDomainException.userHasNotReacted(userIp, reactionableId, reactionableType)
    }
  }

  private buildReaction (
    reactionableId: Reaction['reactionableId'],
    reactionableType: Reaction['reactionableType'],
    userIp: Reaction['userIp'],
    reactionType: string
  ): Reaction {
    const nowDate = DateTime.now()

    return new Reaction(
      reactionableId,
      reactionableType,
      userIp,
      reactionType,
      nowDate,
      nowDate,
      null
    )
  }
}
