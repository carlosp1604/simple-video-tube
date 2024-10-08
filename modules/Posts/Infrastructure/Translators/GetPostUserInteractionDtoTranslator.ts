import {
  GetPostUserInteractionApiRequestDto
} from '~/modules/Posts/Infrastructure/Api/Requests/GetPostUserInteractionApiRequestDto'
import {
  GetPostUserInteractionApplicationRequestDto
} from '~/modules/Posts/Application/GetPostUserInteraction/GetPostUserInteractionApplicationRequestDto'

export class GetPostUserInteractionDtoTranslator {
  public static fromApiDto (
    request: GetPostUserInteractionApiRequestDto,
    userIp: string
  ): GetPostUserInteractionApplicationRequestDto {
    return {
      postId: request.postId,
      userIp,
    }
  }
}
