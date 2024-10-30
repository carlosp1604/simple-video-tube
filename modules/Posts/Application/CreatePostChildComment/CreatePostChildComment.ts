import { PostRepositoryInterface, RepositoryOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { Post } from '~/modules/Posts/Domain/Post'
import {
  CreatePostChildCommentApplicationRequestDto
} from '~/modules/Posts/Application/CreatePostChildComment/CreatePostChildCommentApplicationRequestDto'
import { PostChildComment } from '~/modules/Posts/Domain/PostComments/PostChildComment'
import {
  CreatePostChildCommentApplicationException
} from '~/modules/Posts/Application/CreatePostChildComment/CreatePostChildCommentApplicationException'
import {
  PostChildCommentApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostChildCommentApplicationDtoTranslator'
import { PostDomainException } from '~/modules/Posts/Domain/PostDomainException'
import { PostChildCommentApplicationDto } from '~/modules/Posts/Application/Dtos/PostChildCommentApplicationDto'
import { UsernameValidator } from '~/modules/Shared/Domain/UsernameValidator'

export class CreatePostChildComment {
  private options: RepositoryOptions[] =
    ['comments', 'comments.childComments', 'comments.childComments.user']

  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly postRepository: PostRepositoryInterface) {}

  public async create (request: CreatePostChildCommentApplicationRequestDto): Promise<PostChildCommentApplicationDto> {
    new UsernameValidator().validate(request.userName)

    const post = await this.getPost(request.postId)

    const postChildComment = this.addChildComment(post, request)

    await this.savePostChildComment(postChildComment)

    return PostChildCommentApplicationDtoTranslator.fromDomain(postChildComment)
  }

  private async getPost (postId: CreatePostChildCommentApplicationRequestDto['postId']): Promise<Post> {
    const post = await this.postRepository.findById(postId, this.options)

    if (post === null) {
      throw CreatePostChildCommentApplicationException.postNotFound(postId)
    }

    return post as Post
  }

  private addChildComment (
    post: Post,
    request: CreatePostChildCommentApplicationRequestDto
  ): PostChildComment {
    try {
      return post.addChildComment(request.parentCommentId, request.comment, request.userIp, request.userName)
    } catch (exception: unknown) {
      if (!(exception instanceof PostDomainException)) {
        throw exception
      }

      if (exception.id === PostDomainException.parentCommentNotFoundId) {
        throw CreatePostChildCommentApplicationException.parentCommentNotFound(request.parentCommentId)
      }

      throw exception
    }
  }

  private async savePostChildComment (postChildComment: PostChildComment): Promise<void> {
    try {
      await this.postRepository.createChildComment(postChildComment)
    } catch (exception: unknown) {
      throw CreatePostChildCommentApplicationException
        .cannotAddChildComment(postChildComment.parentCommentId, postChildComment.userIp)
    }
  }
}
