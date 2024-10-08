import { PostWithRelationsApplicationDto } from '~/modules/Posts/Application/Dtos/PostWithRelationsApplicationDto'

export interface GetRelatedPostsApplicationResponseDto {
  posts: PostWithRelationsApplicationDto[]
}
