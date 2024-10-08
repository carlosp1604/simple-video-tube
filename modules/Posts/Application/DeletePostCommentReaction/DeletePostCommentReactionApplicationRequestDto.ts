export interface DeletePostCommentReactionApplicationRequestDto {
  readonly postCommentId: string
  readonly userIp: string
  readonly parentCommentId: string | null
}
