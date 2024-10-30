export interface CreatePostCommentApplicationRequestDto {
  readonly comment: string
  readonly postId: string
  readonly userIp: string
  readonly userName: string
}
