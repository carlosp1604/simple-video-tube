import { DeletePostCommentApiRequestDto } from '../Requests/DeletePostCommentApiRequestDto'
import { DeletePostCommentApplicationRequestDto } from '~/modules/Posts/Application/DeletePostComment/DeletePostCommentApplicationRequestDto'

export class DeletePostRequestDtoTranslator {
  public static fromApiDto (
    request: DeletePostCommentApiRequestDto,
    userIp: string
  ): DeletePostCommentApplicationRequestDto {
    return {
      postCommentId: request.postCommentId,
      postId: request.postId,
      userIp,
      parentCommentId: request.parentCommentId,
    }
  }
}
