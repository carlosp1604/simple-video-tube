import { CreatePostReactionApplicationRequest } from './CreatePostReactionApplicationRequest'
import { CreatePostReactionApplicationException } from './CreatePostReactionApplicationException'
import { PostRepositoryInterface, RepositoryOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { Post } from '~/modules/Posts/Domain/Post'
import { ModelReactionApplicationDto } from '~/modules/Reactions/Application/ModelReactionApplicationDto'
import {
  PostReactionApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostReactionApplicationDtoTranslator'
import { Reaction } from '~/modules/Reactions/Domain/Reaction'
import { ReactionableModelDomainException } from '~/modules/Reactions/Domain/ReactionableModelDomainException'
import { ReactionRepositoryInterface } from '~/modules/Reactions/Domain/ReactionRepositoryInterface'

export class CreatePostReaction {
  private options: RepositoryOptions[] = ['reactions']

  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly postRepository: PostRepositoryInterface,
    private readonly reactionRepository: ReactionRepositoryInterface
  ) {}

  public async create (
    request: CreatePostReactionApplicationRequest
  ): Promise<ModelReactionApplicationDto> {
    const post = await this.getPost(request.postId)

    const reaction = this.addReactionToPost(post, request)

    await this.reactionRepository.save(reaction)

    return PostReactionApplicationDtoTranslator.fromDomain(reaction)
  }

  private async getPost (postId: CreatePostReactionApplicationRequest['postId']): Promise<Post> {
    const post = await this.postRepository.findById(postId, this.options)

    if (post === null) {
      throw CreatePostReactionApplicationException.postNotFound(postId)
    }

    return post as Post
  }

  private addReactionToPost (post: Post, request: CreatePostReactionApplicationRequest): Reaction {
    try {
      return post.createPostReaction(request.userIp, request.reactionType)
    } catch (exception: unknown) {
      if (!(exception instanceof ReactionableModelDomainException)) {
        throw exception
      }

      switch (exception.id) {
        case ReactionableModelDomainException.userAlreadyReactedId:
          throw CreatePostReactionApplicationException.userAlreadyReacted(request.userIp, request.postId)

        case ReactionableModelDomainException.cannotAddReactionId:
          throw CreatePostReactionApplicationException.cannotAddReaction(request.userIp, request.postId)

        default:
          throw exception
      }
    }
  }
}
