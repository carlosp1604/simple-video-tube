import { Reaction } from '~/modules/Reactions/Domain/Reaction'

export interface ReactionRepositoryInterface {
  /**
   * Insert a Reaction in the persistence layer or update if already exists
   * @param reaction Reaction to persist
   */
  save(reaction: Reaction): Promise<void>

  /**
   * Remove a Reaction from the persistence layer
   * @param postCommentId PostComment ID
   * @param userIp User IP
   */
  remove(postCommentId: Reaction['reactionableId'], userIp: Reaction['userIp']): Promise<void>
}
