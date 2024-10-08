import { PostWithViewsInterface } from '~/modules/Posts/Domain/PostWithCountInterface'
import { GetPostsApplicationResponse } from '~/modules/Posts/Application/Dtos/GetPostsApplicationDto'
import { PostWithRelationsApplicationDtoTranslator } from '~/modules/Posts/Application/Translators/PostWithRelationsApplicationDtoTranslator'

export class GetPostsApplicationDtoTranslator {
  public static fromDomain (
    postsWithViews: PostWithViewsInterface[],
    postsNumber: number
  ): GetPostsApplicationResponse {
    return {
      posts: postsWithViews.map((postWithViews) => {
        return PostWithRelationsApplicationDtoTranslator.fromDomain(postWithViews.post)
      }),
      postsNumber,
    }
  }
}
