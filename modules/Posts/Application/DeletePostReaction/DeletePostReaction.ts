import { DeletePostReactionApplicationRequestDto } from './DeletePostReactionApplicationRequestDto'
import { DeletePostReactionApplicationException } from './DeletePostReactionApplicationException'
import { PostRepositoryInterface, RepositoryOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { Post } from '~/modules/Posts/Domain/Post'
import { ReactionableModelDomainException } from '~/modules/Reactions/Domain/ReactionableModelDomainException'

export class DeletePostReaction {
  private options: RepositoryOptions[] = ['reactions']

  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly postRepository: PostRepositoryInterface) {}

  public async delete (request: DeletePostReactionApplicationRequestDto): Promise<void> {
    const post = await this.getPost(request.postId)

    this.deleteReactionFromPost(post, request.userIp)

    await this.postRepository.deleteReaction(request.userIp, request.postId)
  }

  private async getPost (postId: DeletePostReactionApplicationRequestDto['postId']): Promise<Post> {
    const post = await this.postRepository.findById(postId, this.options)

    if (post === null) {
      throw DeletePostReactionApplicationException.postNotFound(postId)
    }

    return post as Post
  }

  private deleteReactionFromPost (post: Post, userIp: string): void {
    try {
      post.deletePostReaction(userIp)
    } catch (exception: unknown) {
      if (!(exception instanceof ReactionableModelDomainException)) {
        throw exception
      }

      switch (exception.id) {
        case ReactionableModelDomainException.userHasNotReactedId:
          throw DeletePostReactionApplicationException.userHasNotReacted(userIp, post.id)

        default:
          throw exception
      }
    }
  }
}
