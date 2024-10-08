import {
  CreatePostCommentReactionApiRequestDto
} from '~/modules/Posts/Infrastructure/Api/Requests/CreatePostCommentReactionApiRequestDto'
import {
  CreatePostCommentReactionApplicationRequest
} from '~/modules/Posts/Application/CreatePostCommentReaction/CreatePostCommentReactionApplicationRequest'

export class CreatePostCommentReactionRequestTranslator {
  public static fromApiDto (
    request: CreatePostCommentReactionApiRequestDto,
    userIp: string
  ): CreatePostCommentReactionApplicationRequest {
    return {
      postCommentId: request.postCommentId,
      userIp,
      parentCommentId: request.parentCommentId,
    }
  }
}
