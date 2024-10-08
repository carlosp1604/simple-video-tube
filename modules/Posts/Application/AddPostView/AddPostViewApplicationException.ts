import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { Post } from '~/modules/Posts/Domain/Post'

export class AddPostViewApplicationException extends ApplicationException {
  public static cannotCreatePostViewId = 'add_post_view_cannot_add_post_view'
  public static postNotFoundId = 'add_post_view_post_not_found'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, AddPostViewApplicationException.prototype)
  }

  public static postNotFound (postId: Post['id']): AddPostViewApplicationException {
    return new AddPostViewApplicationException(
      `Post with ID ${postId} was not found`,
      this.postNotFoundId
    )
  }

  public static cannotCreatePostView (postId: Post['id']): AddPostViewApplicationException {
    return new AddPostViewApplicationException(
      `Cannot add a new post view for post with ID ${postId}`,
      this.cannotCreatePostViewId
    )
  }
}
