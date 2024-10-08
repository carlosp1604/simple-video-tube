import { CreatePostReactionApiRequest } from '~/modules/Posts/Infrastructure/Api/Requests/CreatePostReactionApiRequest'
import {
  CreatePostReactionApplicationRequest
} from '~/modules/Posts/Application/CreatePostReaction/CreatePostReactionApplicationRequest'

export class CreatePostReactionRequestTranslator {
  public static fromApiDto (
    request: CreatePostReactionApiRequest,
    userIp: string
  ): CreatePostReactionApplicationRequest {
    return {
      postId: request.postId,
      userIp,
      reactionType: request.reactionType,
    }
  }
}
