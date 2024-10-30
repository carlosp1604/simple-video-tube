export interface CreatePostChildCommentApiRequestDto {
  readonly postId: string
  readonly comment: string
  readonly userName: string
  readonly parentCommentId: string
}
