import { PostChildComment } from '~/modules/Posts/Domain/PostComments/PostChildComment'
import { PostChildCommentApplicationDto } from '~/modules/Posts/Application/Dtos/PostChildCommentApplicationDto'

export class PostChildCommentApplicationDtoTranslator {
  public static fromDomain (childComment: PostChildComment): PostChildCommentApplicationDto {
    return {
      id: childComment.id,
      comment: childComment.comment,
      createdAt: childComment.createdAt.toISO(),
      updatedAt: childComment.updatedAt.toISO(),
      parentCommentId: childComment.parentCommentId,
      userIp: childComment.userIp,
      userName: childComment.userName,
    }
  }
}
