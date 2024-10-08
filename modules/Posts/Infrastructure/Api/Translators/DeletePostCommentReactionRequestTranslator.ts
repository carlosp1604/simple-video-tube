import {
  DeletePostCommentReactionApiRequestDto
} from '~/modules/Posts/Infrastructure/Api/Requests/DeletePostCommentReactionApiRequestDto'
import {
  DeletePostCommentReactionApplicationRequestDto
} from '~/modules/Posts/Application/DeletePostCommentReaction/DeletePostCommentReactionApplicationRequestDto'

export class DeletePostCommentReactionRequestTranslator {
  public static fromApiDto (
    request: DeletePostCommentReactionApiRequestDto,
    userIp: string
  ): DeletePostCommentReactionApplicationRequestDto {
    return {
      postCommentId: request.postCommentId,
      userIp,
      parentCommentId: request.parentCommentId,
    }
  }
}
