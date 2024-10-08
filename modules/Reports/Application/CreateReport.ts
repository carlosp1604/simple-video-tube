import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { CreateReportApplicationRequestDto } from '~/modules/Reports/Application/CreateReportApplicationRequestDto'
import { ReportRepositoryInterface } from '~/modules/Reports/Domain/ReportRepositoryInterface'
import { Post } from '~/modules/Posts/Domain/Post'
import { CreateReportApplicationException } from '~/modules/Reports/Application/CreateReportApplicationException'
import { EmailValidator } from '~/modules/Shared/Domain/EmailValidator'
import { NameValidator } from '~/modules/Shared/Domain/NameValidator'

export class CreateReport {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    readonly postRepository: PostRepositoryInterface,
    readonly reportRepository: ReportRepositoryInterface
  ) {}

  public async create (request: CreateReportApplicationRequestDto): Promise<void> {
    new EmailValidator().validate(request.userEmail)
    new NameValidator().validate(request.userName)

    const post = await this.postRepository.findById(request.postId, ['reports'])

    if (post === null) {
      throw CreateReportApplicationException.postNotFound(request.postId)
    }

    const report = (post as Post)
      .addReport(request.userIp, request.userName, request.userEmail, 'report', request.content)

    if (!report) {
      throw CreateReportApplicationException.userAlreadyReportedPost(request.postId, request.userIp)
    }

    await this.reportRepository.save(report)
  }
}
