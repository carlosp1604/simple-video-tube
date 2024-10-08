export interface DeletePostCommentApplicationRequestDto {
  readonly postId: string
  readonly postCommentId: string
  readonly parentCommentId: string | null
  readonly userIp: string
}
