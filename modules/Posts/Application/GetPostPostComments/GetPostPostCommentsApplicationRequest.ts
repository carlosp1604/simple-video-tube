export interface GetPostPostCommentsApplicationRequest {
  readonly postId: string
  readonly page: number
  readonly perPage: number
  readonly userIp: string
}
