import { AddPostViewApplicationRequest } from '~/modules/Posts/Application/AddPostView/AddPostViewApplicationRequest'
import { Post } from '~/modules/Posts/Domain/Post'
import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import {
  AddPostViewApplicationException
} from '~/modules/Posts/Application/AddPostView/AddPostViewApplicationException'

export class AddPostView {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly postRepository: PostRepositoryInterface) {}

  public async add (request: AddPostViewApplicationRequest): Promise<void> {
    const post = await this.getPost(request.postId)

    try {
      await this.postRepository.createPostView(post.id)
    } catch (exception: unknown) {
      console.error(exception)
      throw AddPostViewApplicationException.cannotCreatePostView(request.postId)
    }
  }

  private async getPost (postId: AddPostViewApplicationRequest['postId']): Promise<Post> {
    const post = await this.postRepository.findById(postId)

    if (post === null) {
      throw AddPostViewApplicationException.postNotFound(postId)
    }

    return post as Post
  }
}
