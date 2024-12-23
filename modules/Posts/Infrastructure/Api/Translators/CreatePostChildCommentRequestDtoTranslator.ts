import {
  CreatePostChildCommentApplicationRequestDto
} from '~/modules/Posts/Application/CreatePostChildComment/CreatePostChildCommentApplicationRequestDto'
import {
  CreatePostChildCommentApiRequestDto
} from '~/modules/Posts/Infrastructure/Api/Requests/CreatePostChildCommentApiRequestDto'

export class CreatePostChildCommentRequestDtoTranslator {
  public static fromApiDto (
    request: CreatePostChildCommentApiRequestDto,
    userIp: string
  ): CreatePostChildCommentApplicationRequestDto {
    return {
      postId: request.postId,
      userIp,
      userName: request.userName,
      comment: request.comment,
      parentCommentId: request.parentCommentId,
    }
  }
}
