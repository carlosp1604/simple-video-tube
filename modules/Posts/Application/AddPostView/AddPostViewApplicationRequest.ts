import { Post } from '~/modules/Posts/Domain/Post'

export interface AddPostViewApplicationRequest {
  postId: Post['id']
}
