import { CreatePostCommentRequestDto } from './Dtos/CreatePostCommentRequestDto'
import { CreatePostCommentApplicationException } from './CreatePostCommentApplicationException'
import { PostCommentApplicationDto } from './Dtos/PostCommentApplicationDto'
import { PostCommentApplicationDtoTranslator } from './Translators/PostCommentApplicationDtoTranslator'
import { PostRepositoryInterface, RepositoryOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { PostDomainException } from '~/modules/Posts/Domain/PostDomainException'

export class CreatePostComment {
  private options: RepositoryOptions[] = ['comments', 'comments.user']

  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly postRepository: PostRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface
  ) {}

  public async create (request: CreatePostCommentRequestDto): Promise<PostCommentApplicationDto> {
    const post = await this.postRepository.findById(request.postId, this.options)

    if (post === null) {
      throw CreatePostCommentApplicationException.postNotFound(request.postId)
    }

    const user = await this.userRepository.findById(request.userId)

    if (user === null) {
      throw CreatePostCommentApplicationException.userNotFound(request.userId)
    }

    try {
      const comment = post.addComment(request.comment, request.userId)

      comment.setUser(user)

      await this.postRepository.createComment(comment)

      return PostCommentApplicationDtoTranslator.fromDomain(comment)
    } catch (exception: unknown) {
      if (!(exception instanceof PostDomainException)) {
        throw exception
      }

      throw CreatePostCommentApplicationException.cannotAddComment(request.postId, request.userId)
    }
  }
}
