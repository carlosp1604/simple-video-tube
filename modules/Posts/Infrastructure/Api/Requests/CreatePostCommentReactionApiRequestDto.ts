export interface CreatePostCommentReactionApiRequestDto {
  postCommentId: string
  parentCommentId: string | null
}
