export interface CreatePostCommentReactionApplicationRequest {
  userIp: string
  postCommentId: string
  parentCommentId: string | null
}
