import { Post } from '~/modules/Posts/Domain/Post'
import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { GetRelatedPostsApplicationResponseDto } from './GetRelatedPostsApplicationResponseDto'
import { GetRelatedPostsApplicationResponseDtoTranslator } from './GetRelatedPostsApplicationResponseDtoTranslator'

export class GetRelatedPosts {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly postRepository: PostRepositoryInterface) {}

  public async get (postId: Post['id']): Promise<GetRelatedPostsApplicationResponseDto> {
    const relatedPosts = await this.postRepository.getRelatedPosts(postId)

    return GetRelatedPostsApplicationResponseDtoTranslator.fromDomain(relatedPosts)
  }
}
