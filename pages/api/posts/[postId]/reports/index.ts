import { NextApiRequest, NextApiResponse } from 'next'
import {
  PostsApiRequestValidatorError
} from '~/modules/Posts/Infrastructure/Api/Validators/PostsApiRequestValidatorError'
import { container } from '~/awilix.container'
import requestIp from 'request-ip'
import { CreateReportApiRequestDto } from '~/modules/Reports/Infrastructure/Api/CreateReportApiRequestDto'
import { CreateReportApiRequestSanitizer } from '~/modules/Reports/Infrastructure/Api/CreateReportApiRequestSanitizer'
import { CreateReportApiRequestValidator } from '~/modules/Reports/Infrastructure/Api/CreateReportApiRequestValidator'
import { CreateReportRequestDtoTranslator } from '~/modules/Reports/Infrastructure/Api/CreateReportRequestDtoTranslator'
import { CreateReport } from '~/modules/Reports/Application/CreateReport'
import {
  REPORT_BAD_REQUEST, REPORT_CREATE_REPORT_INVALID_EMAIL,
  REPORT_CREATE_REPORT_INVALID_USERNAME,
  REPORT_CREATE_REPORT_POST_ALREADY_REPORTED,
  REPORT_CREATE_REPORT_POST_NOT_FOUND,
  REPORT_METHOD,
  REPORT_SERVER_ERROR,
  REPORT_VALIDATION
} from '~/modules/Reports/Infrastructure/Api/ReportApiExceptionCodes'
import { CreateReportApplicationException } from '~/modules/Reports/Application/CreateReportApplicationException'
import { ValidationException } from '~/modules/Shared/Domain/ValidationException'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  const userIp = requestIp.getClientIp(request) ?? '127.0.0.1'

  if (request.method !== 'POST') {
    return handleMethod(request, response)
  }

  const { postId } = request.query
  const content = request.body.content
  const userEmail = request.body.userEmail
  const userName = request.body.userName

  if (!postId) {
    return handleBadRequest(response)
  }

  let apiRequest: CreateReportApiRequestDto

  try {
    apiRequest = CreateReportApiRequestSanitizer.sanitize({
      content,
      userEmail,
      userName,
      postId: String(postId),
    })
  } catch (exception: unknown) {
    console.error(exception)

    return handleServerError(response)
  }

  const validationError = CreateReportApiRequestValidator.validate(apiRequest)

  if (validationError) {
    return handleValidationError(response, validationError)
  }

  const applicationRequest = CreateReportRequestDtoTranslator.fromApiDto(apiRequest, userIp)

  const useCase = container.resolve<CreateReport>('createReportUseCase')

  try {
    await useCase.create(applicationRequest)

    return response.status(201).end()
  } catch (exception: unknown) {
    if (!(exception instanceof CreateReportApplicationException || exception instanceof ValidationException)) {
      console.error(exception)

      return handleServerError(response)
    }

    switch (exception.id) {
      case CreateReportApplicationException.postNotFoundId:
        return handleNotFound(response, exception.message)

      case CreateReportApplicationException.postAlreadyReportedByUserId:
        return handleConflict(response, exception.message)

      case ValidationException.invalidEmailId:
        return handleUnprocessableEntity(response, exception.message, REPORT_CREATE_REPORT_INVALID_EMAIL)

      case ValidationException.invalidUsernameId:
        return handleUnprocessableEntity(response, exception.message, REPORT_CREATE_REPORT_INVALID_USERNAME)

      default: {
        console.error(exception)

        return handleServerError(response)
      }
    }
  }
}

function handleMethod (request: NextApiRequest, response: NextApiResponse) {
  return response
    .status(405)
    .setHeader('Allow', 'POST')
    .json({
      code: REPORT_METHOD,
      message: `Cannot ${request.method} ${request.url?.toString()}`,
    })
}

function handleValidationError (
  response: NextApiResponse,
  validationError: PostsApiRequestValidatorError
) {
  return response.status(400)
    .json({
      code: REPORT_VALIDATION,
      message: 'Invalid request',
      errors: validationError.exceptions,
    })
}

function handleNotFound (response: NextApiResponse, message: string) {
  return response.status(404)
    .json({
      code: REPORT_CREATE_REPORT_POST_NOT_FOUND,
      message,
    })
}

function handleConflict (response: NextApiResponse, message: string) {
  return response.status(409)
    .json({
      code: REPORT_CREATE_REPORT_POST_ALREADY_REPORTED,
      message,
    })
}

function handleUnprocessableEntity (
  response: NextApiResponse,
  code: string,
  message: string
) {
  return response.status(422)
    .json({
      code,
      message,
    })
}

function handleBadRequest (response: NextApiResponse) {
  return response.status(400)
    .json({
      code: REPORT_BAD_REQUEST,
      message: 'postId parameter is required',
    })
}

function handleServerError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: REPORT_SERVER_ERROR,
      message: 'Something went wrong while processing the request',
    })
}
