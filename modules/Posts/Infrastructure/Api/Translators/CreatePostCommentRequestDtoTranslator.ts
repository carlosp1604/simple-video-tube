import {
  CreatePostCommentApplicationRequestDto
} from '~/modules/Posts/Application/CreatePostComment/CreatePostCommentApplicationRequestDto'
import {
  CreatePostCommentApiRequestDto
} from '~/modules/Posts/Infrastructure/Api/Requests/CreatePostCommentApiRequestDto'

export class CreatePostCommentRequestDtoTranslator {
  public static fromApiDto (
    request: CreatePostCommentApiRequestDto,
    userIp: string
  ): CreatePostCommentApplicationRequestDto {
    return {
      postId: request.postId,
      userName: request.userName,
      userIp,
      comment: request.comment,
    }
  }
}
