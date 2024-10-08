export interface PostCommentApplicationDto {
  readonly id: string
  readonly comment: string
  readonly postId: string
  readonly userIp: string
  readonly createdAt: string
  readonly updatedAt: string
  readonly username: string
}
