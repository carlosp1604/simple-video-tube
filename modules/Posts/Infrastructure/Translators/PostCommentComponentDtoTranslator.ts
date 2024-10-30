import { PostCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCommentComponentDto'
import { DateService } from '~/helpers/Infrastructure/DateService'
import { PostCommentApplicationDto } from '~/modules/Posts/Application/Dtos/PostCommentApplicationDto'
import { ModelReactionApplicationDto } from '~/modules/Reactions/Application/ModelReactionApplicationDto'
import {
  ReactionComponentDtoTranslator
} from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDtoTranslator'

export class PostCommentComponentDtoTranslator {
  public static fromApplication (
    applicationDto: PostCommentApplicationDto,
    repliesNumber: number,
    reactionsNumber: number,
    userReaction: ModelReactionApplicationDto | null,
    locale: string
  ): PostCommentComponentDto {
    return {
      id: applicationDto.id,
      postId: applicationDto.postId,
      comment: applicationDto.comment,
      createdAt: new DateService().formatDateToDateMedFromIso(applicationDto.createdAt, locale),
      userName: applicationDto.userName,
      repliesNumber,
      reactionsNumber,
      userReaction: userReaction !== null ? ReactionComponentDtoTranslator.fromApplicationDto(userReaction) : null,
    }
  }
}
