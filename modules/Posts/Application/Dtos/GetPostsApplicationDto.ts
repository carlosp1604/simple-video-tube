import { PostWithRelationsApplicationDto } from '~/modules/Posts/Application/Dtos/PostWithRelationsApplicationDto'

export interface GetPostsApplicationResponse {
  posts: PostWithRelationsApplicationDto[]
  postsNumber: number
}
