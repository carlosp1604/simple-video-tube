import { sanitize } from 'sanitizer'
import { UpdatePostCommentApiRequestDto } from '~/modules/Posts/Infrastructure/Dtos/UpdatePostCommentApiRequestDto'

export class UpdatePostCommentRequestSanitizer {
  public static sanitize (request: UpdatePostCommentApiRequestDto): UpdatePostCommentApiRequestDto {
    const comment = sanitize(request.comment)

    return {
      ...request,
      comment,
    }
  }
}
