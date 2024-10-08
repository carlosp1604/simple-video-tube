export interface PostChildCommentApplicationDto {
  readonly id: string
  readonly comment: string
  readonly userIp: string
  readonly username: string
  readonly parentCommentId: string
  readonly createdAt: string
  readonly updatedAt: string
}
