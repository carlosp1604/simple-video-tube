import type { NextApiRequest, NextApiResponse } from 'next'
import {
  GetPostPostCommentsApiRequestDto
} from '~/modules/Posts/Infrastructure/Api/Requests/GetPostPostCommentsApiRequestDto'
import {
  GetPostPostCommentsApiRequestValidator
} from '~/modules/Posts/Infrastructure/Api/Validators/GetPostPostCommentsApiRequestValidator'
import { GetPostPostComments } from '~/modules/Posts/Application/GetPostPostComments/GetPostPostComments'
import {
  CreatePostCommentApplicationException
} from '~/modules/Posts/Application/CreatePostComment/CreatePostCommentApplicationException'
import {
  CreatePostCommentApiRequestDto
} from '~/modules/Posts/Infrastructure/Api/Requests/CreatePostCommentApiRequestDto'
import {
  CreatePostCommentRequestSanitizer
} from '~/modules/Posts/Infrastructure/Api/Sanitizers/CreatePostCommentRequestSanitizer'
import {
  CreatePostCommentApiRequestValidator
} from '~/modules/Posts/Infrastructure/Api/Validators/CreatePostCommentApiRequestValidator'
import {
  CreatePostCommentRequestDtoTranslator
} from '~/modules/Posts/Infrastructure/Api/Translators/CreatePostCommentRequestDtoTranslator'
import { CreatePostComment } from '~/modules/Posts/Application/CreatePostComment/CreatePostComment'
import {
  PostCommentApiRequestValidatorError
} from '~/modules/Posts/Infrastructure/Api/Validators/PostCommentApiRequestValidatorError'
import { container } from '~/awilix.container'
import {
  GetPostPostCommentsApplicationException
} from '~/modules/Posts/Application/GetPostPostComments/GetPostPostCommentsApplicationException'
import {
  POST_COMMENT_BAD_REQUEST, POST_COMMENT_INVALID_NAME,
  POST_COMMENT_INVALID_PAGE,
  POST_COMMENT_INVALID_PER_PAGE,
  POST_COMMENT_METHOD,
  POST_COMMENT_POST_NOT_FOUND,
  POST_COMMENT_SERVER_ERROR, POST_COMMENT_USER_NOT_FOUND,
  POST_COMMENT_VALIDATION
} from '~/modules/Posts/Infrastructure/Api/PostApiExceptionCodes'
import {
  GetPostPostCommentsRequestDtoTranslator
} from '~/modules/Posts/Infrastructure/Api/Translators/GetPostPostCommentsRequestDtoTranslator'
import { ValidationException } from '~/modules/Shared/Domain/ValidationException'
import { ClientIpServiceInterface } from '~/modules/Shared/Domain/ClientIpServiceInterface'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  switch (request.method) {
    case 'POST':
      return handlePOST(request, response)

    case 'GET':
      return handleGET(request, response)

    default:
      return handleMethod(request, response)
  }
}

async function handleGET (request: NextApiRequest, response: NextApiResponse) {
  const { postId, page, perPage } = request.query

  if (!postId || !page || !perPage) {
    return handleBadRequest(response)
  }

  const apiRequest: GetPostPostCommentsApiRequestDto = {
    postId: String(postId),
    page: parseInt(String(page)),
    perPage: parseInt(String(perPage)),
  }

  const validationError = GetPostPostCommentsApiRequestValidator.validate(apiRequest)

  if (validationError) {
    return handleValidationError(response, validationError)
  }

  const clientIpService = container.resolve<ClientIpServiceInterface>('clientIpService')
  const userIp = clientIpService.getClientIp(request, false)

  const useCase = container.resolve<GetPostPostComments>('getPostPostCommentsUseCase')

  const applicationRequest =
    GetPostPostCommentsRequestDtoTranslator.fromApiDto(apiRequest, userIp)

  try {
    const comments = await useCase.get(applicationRequest)

    return response.status(200).json(comments)
  } catch (exception: unknown) {
    if (!(exception instanceof GetPostPostCommentsApplicationException)) {
      return handleServerError(response)
    }

    switch (exception.id) {
      case GetPostPostCommentsApplicationException.invalidPageValueId:
        return handleUnprocessableEntity(response, exception.message, POST_COMMENT_INVALID_PAGE)

      case GetPostPostCommentsApplicationException.invalidPerPageValueId:
        return handleUnprocessableEntity(response, exception.message, POST_COMMENT_INVALID_PER_PAGE)

      default: {
        console.error(exception)

        return handleServerError(response)
      }
    }
  }
}

async function handlePOST (request: NextApiRequest, response: NextApiResponse) {
  const { postId } = request.query
  const comment = request.body.comment
  const userName = request.body.userName

  const clientIpService = container.resolve<ClientIpServiceInterface>('clientIpService')
  const userIp = clientIpService.getClientIp(request, false)

  if (!postId) {
    return handleBadRequest(response)
  }

  let apiRequest: CreatePostCommentApiRequestDto

  try {
    apiRequest = CreatePostCommentRequestSanitizer.sanitize({
      comment,
      userName,
      postId: String(postId),
    })
  } catch (exception: unknown) {
    console.error(exception)

    return handleServerError(response)
  }

  const validationError = CreatePostCommentApiRequestValidator.validate(apiRequest)

  if (validationError) {
    return handleValidationError(response, validationError)
  }

  const applicationRequest = CreatePostCommentRequestDtoTranslator.fromApiDto(apiRequest, userIp)

  const useCase = container.resolve<CreatePostComment>('createPostCommentUseCase')

  try {
    const comment = await useCase.create(applicationRequest)

    return response.status(201).json(comment)
  } catch (exception: unknown) {
    if (
      !(exception instanceof CreatePostCommentApplicationException) &&
      !(exception instanceof ValidationException)
    ) {
      console.error(exception)

      return handleServerError(response)
    }

    switch (exception.id) {
      case CreatePostCommentApplicationException.postNotFoundId:
        return handleNotFound(response, exception.message, POST_COMMENT_POST_NOT_FOUND)

      case CreatePostCommentApplicationException.userNotFoundId:
        return handleNotFound(response, exception.message, POST_COMMENT_USER_NOT_FOUND)

      case ValidationException.invalidNameId:
        return handleUnprocessableEntity(response, exception.message, POST_COMMENT_INVALID_NAME)

      default: {
        console.error(exception)

        return handleServerError(response)
      }
    }
  }
}

function handleBadRequest (response: NextApiResponse) {
  return response
    .status(400)
    .json({
      code: POST_COMMENT_BAD_REQUEST,
      message: 'postId parameter is required',
    })
}

function handleMethod (request: NextApiRequest, response: NextApiResponse) {
  return response
    .status(405)
    .setHeader('Allow', ['POST', 'GET'])
    .json({
      code: POST_COMMENT_METHOD,
      message: `Cannot ${request.method} ${request.url?.toString()}`,
    })
}

function handleValidationError (
  response: NextApiResponse,
  validationError: PostCommentApiRequestValidatorError
) {
  return response.status(400)
    .json({
      code: POST_COMMENT_VALIDATION,
      message: 'Invalid request',
      errors: validationError.exceptions,
    })
}

function handleServerError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: POST_COMMENT_SERVER_ERROR,
      message: 'Something went wrong while processing the request',
    })
}

function handleNotFound (response: NextApiResponse, message: string, code: string) {
  return response.status(404)
    .json({
      code,
      message,
    })
}

function handleUnprocessableEntity (
  response: NextApiResponse,
  message: string,
  code: string
) {
  return response.status(422)
    .json({
      code,
      message,
    })
}
