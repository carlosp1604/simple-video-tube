import { PostCommentCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCommentCardComponentDto'
import { DateService } from '~/helpers/Infrastructure/DateService'

export class PostCommentCardComponentDtoTranslator {
  public static translate (
    id: string,
    comment: string,
    createdAt: string,
    username: string,
    locale: string
  ): PostCommentCardComponentDto {
    return {
      id,
      comment,
      createdAt: new DateService()
        .formatAgoLike(createdAt, locale),
      username,
    }
  }
}
