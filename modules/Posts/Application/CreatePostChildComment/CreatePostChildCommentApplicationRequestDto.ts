export interface CreatePostChildCommentApplicationRequestDto {
  readonly comment: string
  readonly postId: string
  readonly parentCommentId: string
  readonly userIp: string
  readonly userName: string
}
