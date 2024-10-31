import { CreatePostCommentApplicationRequestDto } from './CreatePostCommentApplicationRequestDto'
import { CreatePostCommentApplicationException } from './CreatePostCommentApplicationException'
import { PostRepositoryInterface, RepositoryOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { Post } from '~/modules/Posts/Domain/Post'
import { PostComment } from '~/modules/Posts/Domain/PostComments/PostComment'
import {
  PostCommentApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostCommentApplicationDtoTranslator'
import { PostCommentApplicationDto } from '~/modules/Posts/Application/Dtos/PostCommentApplicationDto'
import { NameValidator } from '~/modules/Shared/Domain/NameValidator'

export class CreatePostComment {
  private options: RepositoryOptions[] = ['comments']

  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly postRepository: PostRepositoryInterface) {}

  public async create (request: CreatePostCommentApplicationRequestDto): Promise<PostCommentApplicationDto> {
    new NameValidator().validate(request.userName)

    const post = await this.getPost(request.postId)

    const postComment = this.addCommentToPost(post, request)

    await this.savePostComment(postComment)

    return PostCommentApplicationDtoTranslator.fromDomain(postComment)
  }

  private async getPost (postId: CreatePostCommentApplicationRequestDto['postId']): Promise<Post> {
    const post = await this.postRepository.findById(postId, this.options)

    if (post === null) {
      throw CreatePostCommentApplicationException.postNotFound(postId)
    }

    return post as Post
  }

  private addCommentToPost (post: Post, request: CreatePostCommentApplicationRequestDto): PostComment {
    return post.addComment(request.comment, request.userIp, request.userName)
  }

  private async savePostComment (postComment: PostComment): Promise<void> {
    try {
      await this.postRepository.createComment(postComment)
    } catch (exception: unknown) {
      console.log(exception)
      throw CreatePostCommentApplicationException.cannotAddComment(postComment.postId, postComment.userIp)
    }
  }
}
