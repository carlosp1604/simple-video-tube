import { NextApiRequest, NextApiResponse } from 'next'
import {
  PostsApiRequestValidatorError
} from '~/modules/Posts/Infrastructure/Api/Validators/PostsApiRequestValidatorError'
import {
  POST_USER_INTERACTION_BAD_REQUEST, POST_USER_INTERACTION_METHOD, POST_USER_INTERACTION_SERVER_ERROR,
  POST_USER_INTERACTION_VALIDATION
} from '~/modules/Posts/Infrastructure/Api/PostApiExceptionCodes'
import { container } from '~/awilix.container'
import {
  GetPostUserInteractionApiRequestDto
} from '~/modules/Posts/Infrastructure/Api/Requests/GetPostUserInteractionApiRequestDto'
import {
  GetPostUserInteractionApiRequestValidator
} from '~/modules/Posts/Infrastructure/Api/Validators/GetPostUserInteractionApiRequestValidator'
import { GetPostUserInteraction } from '~/modules/Posts/Application/GetPostUserInteraction/GetPostUserInteraction'
import {
  GetPostUserInteractionDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/GetPostUserInteractionDtoTranslator'
import requestIp from 'request-ip'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  const userIp = requestIp.getClientIp(request) ?? '127.0.0.1'

  if (request.method !== 'GET') {
    return handleMethod(request, response)
  }

  const { postId } = request.query

  if (!postId) {
    return handleBadRequest(response)
  }

  const apiRequest: GetPostUserInteractionApiRequestDto = {
    postId: String(postId),
  }

  const validationError = GetPostUserInteractionApiRequestValidator.validate(apiRequest)

  if (validationError) {
    return handleValidationError(response, validationError)
  }

  const applicationRequest = GetPostUserInteractionDtoTranslator.fromApiDto(apiRequest, userIp)

  const useCase = container.resolve<GetPostUserInteraction>('getPostUserInteractionUseCase')

  try {
    const interaction = await useCase.get(applicationRequest)

    return response.status(200).json(interaction)
  } catch (exception: unknown) {
    console.error(exception)

    return handleServerError(response)
  }
}

function handleMethod (request: NextApiRequest, response: NextApiResponse) {
  return response
    .status(405)
    .setHeader('Allow', 'GET')
    .json({
      code: POST_USER_INTERACTION_METHOD,
      message: `Cannot ${request.method} ${request.url?.toString()}`,
    })
}

function handleValidationError (
  response: NextApiResponse,
  validationError: PostsApiRequestValidatorError
) {
  return response.status(400)
    .json({
      code: POST_USER_INTERACTION_VALIDATION,
      message: 'Invalid request',
      errors: validationError.exceptions,
    })
}

function handleBadRequest (response: NextApiResponse) {
  return response.status(400)
    .json({
      code: POST_USER_INTERACTION_BAD_REQUEST,
      message: 'postId parameter is required',
    })
}

function handleServerError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: POST_USER_INTERACTION_SERVER_ERROR,
      message: 'Something went wrong while processing the request',
    })
}
