import { DeletePostCommentApplicationRequestDto } from './DeletePostCommentApplicationRequestDto'
import { DeletePostCommentApplicationException } from './DeletePostCommentApplicationException'
import { PostRepositoryInterface, RepositoryOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { PostDomainException } from '~/modules/Posts/Domain/PostDomainException'
import { Post } from '~/modules/Posts/Domain/Post'

export class DeletePostComment {
  private options: RepositoryOptions[] =
    ['comments', 'comments.childComments', 'comments.childComments.user']

  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly postRepository: PostRepositoryInterface) {}

  public async delete (request: DeletePostCommentApplicationRequestDto): Promise<void> {
    const post = await this.getPost(request.postId)

    if (request.parentCommentId === null) {
      this.deletePostComment(post, request)
    } else {
      this.deletePostChildComment(post, request)
    }

    await this.deletePostCommentFromPersistence(request)
  }

  private async getPost (postId: DeletePostCommentApplicationRequestDto['postId']): Promise<Post> {
    const post = await this.postRepository.findById(postId, this.options)

    if (post === null) {
      throw DeletePostCommentApplicationException.postNotFound(postId)
    }

    return post as Post
  }

  private deletePostComment (post: Post, request: DeletePostCommentApplicationRequestDto): void {
    try {
      post.deleteComment(request.postCommentId, request.userIp)
    } catch (exception: unknown) {
      if (!(exception instanceof PostDomainException)) {
        throw exception
      }

      if (exception.id === PostDomainException.postCommentNotFoundId) {
        throw DeletePostCommentApplicationException.postCommentNotFound(request.postCommentId)
      }

      if (exception.id === PostDomainException.userCannotDeleteCommentId) {
        throw DeletePostCommentApplicationException.userCannotDeleteComment(request.userIp, request.postCommentId)
      }

      if (exception.id === PostDomainException.cannotDeleteCommentId) {
        throw DeletePostCommentApplicationException.cannotDeleteComment(request.postCommentId)
      }

      throw exception
    }
  }

  private deletePostChildComment (post: Post, request: DeletePostCommentApplicationRequestDto): void {
    try {
      post.deleteChildComment(request.parentCommentId as string, request.postCommentId, request.userIp)
    } catch (exception: unknown) {
      if (!(exception instanceof PostDomainException)) {
        throw exception
      }

      if (exception.id === PostDomainException.parentCommentNotFoundId) {
        throw DeletePostCommentApplicationException.parentCommentNotFound(request.parentCommentId as string)
      }

      if (exception.id === PostDomainException.postCommentNotFoundId) {
        throw DeletePostCommentApplicationException.postCommentNotFound(request.postCommentId)
      }

      if (exception.id === PostDomainException.userCannotDeleteCommentId) {
        throw DeletePostCommentApplicationException.userCannotDeleteComment(request.userIp, request.postCommentId)
      }

      if (exception.id === PostDomainException.cannotDeleteCommentId) {
        throw DeletePostCommentApplicationException.cannotDeleteComment(request.postCommentId)
      }

      throw exception
    }
  }

  private async deletePostCommentFromPersistence (request: DeletePostCommentApplicationRequestDto): Promise<void> {
    try {
      await this.postRepository.deleteComment(request.postCommentId)
    } catch (exception: unknown) {
      console.error(exception)

      throw DeletePostCommentApplicationException.cannotDeleteCommentFromPersistence(request.postCommentId)
    }
  }
}
