import { APIException } from '~/modules/Shared/Infrastructure/FrontEnd/ApiException'
import {
  REPORT_CREATE_REPORT_INVALID_EMAIL,
  REPORT_CREATE_REPORT_INVALID_USERNAME
} from '~/modules/Reports/Infrastructure/Api/ReportApiExceptionCodes'

export class ReportsApiService {
  public async create (
    postId: string,
    userName: string,
    userEmail: string,
    content: string
  ): Promise<void> {
    let response

    try {
      response = await fetch(`/api/posts/${postId}/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName,
          userEmail,
          content,
        }),
      })
    } catch (exception: unknown) {
      console.error(exception)
      throw new APIException(
        'server_error_error_message',
        500,
        'unexpected-exception'
      )
    }

    if (!response.ok) {
      const jsonResponse = await response.json()

      switch (response.status) {
        case 400:
          throw new APIException(
            'bad_request_error_message',
            response.status,
            jsonResponse.code
          )

        case 404:
          throw new APIException(
            'post_not_found_error_message',
            response.status,
            jsonResponse.code
          )

        case 409:
          throw new APIException(
            'user_already_reported_post_error_message',
            response.status,
            jsonResponse.code
          )

        case 422: {
          switch (jsonResponse.code) {
            case REPORT_CREATE_REPORT_INVALID_EMAIL:
              throw new APIException(
                'invalid_email_error_message',
                response.status,
                jsonResponse.code
              )

            case REPORT_CREATE_REPORT_INVALID_USERNAME:
              throw new APIException(
                'invalid_name_error_message',
                response.status,
                jsonResponse.code
              )

            default:
              throw new APIException(
                'server_error_error_message',
                response.status,
                jsonResponse.code
              )
          }
        }

        default:
          throw new APIException(
            'server_error_error_message',
            response.status,
            jsonResponse.code
          )
      }
    }
  }
}
