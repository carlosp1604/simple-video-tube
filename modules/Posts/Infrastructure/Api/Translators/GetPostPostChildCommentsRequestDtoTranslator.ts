import {
  GetPostPostChildCommentsApiRequestDto
} from '~/modules/Posts/Infrastructure/Api/Requests/GetPostPostChildCommentsApiRequestDto'
import {
  GetPostPostChildCommentsApplicationRequest
} from '~/modules/Posts/Application/GetPostPostChildComments/GetPostPostChildCommentsApplicationRequest'

export class GetPostPostChildCommentsRequestDtoTranslator {
  public static fromApiDto (
    request: GetPostPostChildCommentsApiRequestDto,
    userIp: string
  ): GetPostPostChildCommentsApplicationRequest {
    return {
      page: request.page,
      perPage: request.perPage,
      parentCommentId: request.parentCommentId,
      userIp,
    }
  }
}
