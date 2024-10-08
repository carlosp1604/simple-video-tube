export interface CreatePostCommentApiRequestDto {
  readonly comment: string
  readonly postId: string
  readonly username: string
}
