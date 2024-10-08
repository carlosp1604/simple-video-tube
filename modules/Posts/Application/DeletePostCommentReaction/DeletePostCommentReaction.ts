import { DeletePostCommentReactionApplicationRequestDto } from './DeletePostCommentReactionApplicationRequestDto'
import { DeletePostCommentReactionApplicationException } from './DeletePostCommentReactionApplicationException'
import { ReactionableModelDomainException } from '~/modules/Reactions/Domain/ReactionableModelDomainException'
import { PostCommentRepositoryInterface } from '~/modules/Posts/Domain/PostComments/PostCommentRepositoryInterface'
import { ReactionRepositoryInterface } from '~/modules/Reactions/Domain/ReactionRepositoryInterface'
import { PostChildComment } from '~/modules/Posts/Domain/PostComments/PostChildComment'
import { PostComment } from '~/modules/Posts/Domain/PostComments/PostComment'

export class DeletePostCommentReaction {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly postCommentRepository: PostCommentRepositoryInterface,
    private readonly reactionRepository: ReactionRepositoryInterface
  ) {}

  public async delete (request: DeletePostCommentReactionApplicationRequestDto): Promise<void> {
    const postComment = await this.getPostComment(request.postCommentId, request.parentCommentId)

    this.deleteReactionFromPostComment(postComment, request.userIp)

    await this.reactionRepository.remove(request.postCommentId, request.userIp)
  }

  private async getPostComment (
    postCommentId: DeletePostCommentReactionApplicationRequestDto['postCommentId'],
    parentCommentId: DeletePostCommentReactionApplicationRequestDto['parentCommentId']
  ): Promise<PostComment | PostChildComment> {
    const postComment = await this.postCommentRepository.findById(postCommentId, parentCommentId)

    if (postComment === null) {
      throw DeletePostCommentReactionApplicationException.postCommentNotFound(postCommentId)
    }

    return postComment
  }

  private deleteReactionFromPostComment (
    postComment: PostComment | PostChildComment,
    userIp: string
  ): void {
    try {
      postComment.deleteReaction(userIp)
    } catch (exception: unknown) {
      if (!(exception instanceof ReactionableModelDomainException)) {
        throw exception
      }

      switch (exception.id) {
        case ReactionableModelDomainException.userHasNotReactedId:
          throw DeletePostCommentReactionApplicationException.userHasNotReacted(userIp, postComment.id)

        default:
          throw exception
      }
    }
  }
}
