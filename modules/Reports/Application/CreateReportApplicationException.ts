import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { Report } from '~/modules/Reports/Domain/Report'

export class CreateReportApplicationException extends ApplicationException {
  public static postNotFoundId = 'create_report_post_not_found'
  public static postAlreadyReportedByUserId = 'create_report_post_already_reported_by_user'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, CreateReportApplicationException.prototype)
  }

  public static postNotFound (postId: Report['postId']): CreateReportApplicationException {
    return new CreateReportApplicationException(
      `Post with ID ${postId} was not found`,
      this.postNotFoundId
    )
  }

  public static userAlreadyReportedPost (
    postId: Report['postId'],
    userIp: Report['userIp']
  ): CreateReportApplicationException {
    return new CreateReportApplicationException(
      `User with IP ${userIp} already reported post whit ID ${postId}`,
      this.postAlreadyReportedByUserId
    )
  }
}
