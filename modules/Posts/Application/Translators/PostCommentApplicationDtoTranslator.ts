import { PostCommentApplicationDto } from '~/modules/Posts/Application/Dtos/PostCommentApplicationDto'
import { PostComment } from '~/modules/Posts/Domain/PostComments/PostComment'

export class PostCommentApplicationDtoTranslator {
  public static fromDomain (comment: PostComment): PostCommentApplicationDto {
    return {
      id: comment.id,
      comment: comment.comment,
      createdAt: comment.createdAt.toISO(),
      updatedAt: comment.updatedAt.toISO(),
      postId: comment.postId,
      userIp: comment.userIp,
      username: comment.username,
    }
  }
}
