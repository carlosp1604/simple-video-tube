export interface DeletePostCommentReactionApiRequestDto {
  postCommentId: string
  parentCommentId: string | null
}
