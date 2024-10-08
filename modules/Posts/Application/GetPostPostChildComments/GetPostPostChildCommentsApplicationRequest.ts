export interface GetPostPostChildCommentsApplicationRequest {
  readonly parentCommentId: string
  readonly page: number
  readonly perPage: number
  readonly userId: string | null
}
