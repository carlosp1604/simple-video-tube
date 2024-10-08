import { CreateReportApiRequestDto } from '~/modules/Reports/Infrastructure/Api/CreateReportApiRequestDto'
import { CreateReportApplicationRequestDto } from '~/modules/Reports/Application/CreateReportApplicationRequestDto'

export class CreateReportRequestDtoTranslator {
  public static fromApiDto (apiDto: CreateReportApiRequestDto, userIp: string): CreateReportApplicationRequestDto {
    return {
      content: apiDto.content,
      userEmail: apiDto.userEmail,
      postId: apiDto.postId,
      userName: apiDto.userName,
      userIp,
    }
  }
}
