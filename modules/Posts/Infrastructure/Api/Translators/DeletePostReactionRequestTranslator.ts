import { DeletePostReactionApiRequestDto } from '~/modules/Posts/Infrastructure/Api/Requests/DeletePostReactionApiRequestDto'
import {
  DeletePostReactionApplicationRequestDto
} from '~/modules/Posts/Application/DeletePostReaction/DeletePostReactionApplicationRequestDto'

export class DeletePostReactionRequestTranslator {
  public static fromApiDto (
    request: DeletePostReactionApiRequestDto,
    userIp: string
  ): DeletePostReactionApplicationRequestDto {
    return {
      postId: request.postId,
      userIp,
    }
  }
}
