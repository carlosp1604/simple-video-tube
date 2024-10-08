export interface CreatePostChildCommentApiRequestDto {
  readonly postId: string
  readonly comment: string
  readonly username: string
  readonly parentCommentId: string
}
