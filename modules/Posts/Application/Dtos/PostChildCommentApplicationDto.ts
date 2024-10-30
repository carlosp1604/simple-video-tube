export interface PostChildCommentApplicationDto {
  readonly id: string
  readonly comment: string
  readonly userIp: string
  readonly userName: string
  readonly parentCommentId: string
  readonly createdAt: string
  readonly updatedAt: string
}
