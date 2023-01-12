import { PostRepositoryInterface, RepositoryOptions } from '../Domain/PostRepositoryInterface'
import { UserRepositoryInterface } from '../../Auth/Domain/UserRepositoryInterface'
import { PostDomainException } from '../Domain/PostDomainException'
import { CreatePostReactionRequestDto } from './Dtos/CreatePostReactionRequestDto'
import { CreatePostReactionApplicationException } from './CreatePostReactionApplicationException'
import { Reaction } from '../Domain/PostReaction'
import { ReactionApplicationDto } from './Dtos/ReactionApplicationDto'
import { ReactionApplicationDtoTranslator } from './Translators/ReactionApplicationDtoTranslator'

export class CreatePostReaction {
  private options: RepositoryOptions[] = ['reactions', 'reactions.user']

  constructor(
    private readonly postRepository: PostRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  public async create(
    request: CreatePostReactionRequestDto
  ): Promise<ReactionApplicationDto> {
    const post = await this.postRepository.findById(request.postId, this.options)

    if (post === null) {
      throw CreatePostReactionApplicationException.postNotFound(request.postId)
    }

    const user = await this.userRepository.findById(request.userId)

    if (user === null) {
      throw CreatePostReactionApplicationException.userNotFound(request.userId)
    }

    try {
      const reaction = post.addReaction(request.userId, request.reactionType as Reaction)

      await this.postRepository.createReaction(reaction)

      return ReactionApplicationDtoTranslator.fromDomain(reaction)
    }
    catch (exception: unknown) {
      if (!(exception instanceof PostDomainException)) {
        throw exception
      }

      switch (exception.id) {
        case PostDomainException.userAlreadyReactedId:
          throw CreatePostReactionApplicationException.userAlreadyReacted(request.userId, request.postId)

        case PostDomainException.userHasNotReactedId:
          throw CreatePostReactionApplicationException.userHasNotReacted(request.userId, request.postId)

        default:
          throw CreatePostReactionApplicationException.cannotAddReaction(request.userId, request.postId)
      }
    }
  }
}