import { PostWithViewsInterface } from '~/modules/Posts/Domain/PostWithCountInterface'
import {
  GetRelatedPostsApplicationResponseDto
} from '~/modules/Posts/Application/GetRelatedPosts/GetRelatedPostsApplicationResponseDto'
import { PostWithRelationsApplicationDtoTranslator } from '~/modules/Posts/Application/Translators/PostWithRelationsApplicationDtoTranslator'

export class GetRelatedPostsApplicationResponseDtoTranslator {
  public static fromDomain (postsWithViews: PostWithViewsInterface[]): GetRelatedPostsApplicationResponseDto {
    return {
      posts: postsWithViews.map((postWithViews) => {
        return PostWithRelationsApplicationDtoTranslator.fromDomain(postWithViews.post)
      }),
    }
  }
}
