import { ModelReactionApplicationDto } from '~/modules/Reactions/Application/ModelReactionApplicationDto'
import { ReactionApplicationDtoTranslator } from '~/modules/Reactions/Application/ReactionApplicationDtoTranslator'
import { UpdatePostReactionApplicationException } from './UpdatePostReactionApplicationException'
import { PostRepositoryInterface, RepositoryOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { ReactionableModelDomainException } from '~/modules/Reactions/Domain/ReactionableModelDomainException'
import { Post } from '~/modules/Posts/Domain/Post'
import { UpdatePostReactionRequestDto } from '~/modules/Posts/Application/UpdatePostReaction/UpdatePostReactionRequestDto'

export class UpdatePostReaction {
  private options: RepositoryOptions[] = ['reactions']

  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly postRepository: PostRepositoryInterface) {}

  public async update (request: UpdatePostReactionRequestDto): Promise<ModelReactionApplicationDto> {
    const post = await this.postRepository.findById(request.postId, this.options) as Post

    if (post === null) {
      throw UpdatePostReactionApplicationException.postNotFound(request.postId)
    }

    try {
      const reaction = post.updatePostReaction(request.userIp, request.reactionType)

      await this.postRepository.updateReaction(reaction)

      return ReactionApplicationDtoTranslator.fromDomain(reaction)
    } catch (exception: unknown) {
      if (!(exception instanceof ReactionableModelDomainException)) {
        throw exception
      }

      switch (exception.id) {
        case ReactionableModelDomainException.userHasNotReactedId:
          throw UpdatePostReactionApplicationException.userHasNotReacted(request.userIp, request.postId)

        default:
          throw UpdatePostReactionApplicationException.cannotUpdateReaction(request.userIp, request.postId)
      }
    }
  }
}
