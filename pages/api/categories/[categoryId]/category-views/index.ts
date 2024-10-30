import { NextApiRequest, NextApiResponse } from 'next'
import { container } from '~/awilix.container'
import {
  CATEGORY_BAD_REQUEST, CATEGORY_CATEGORY_NOT_FOUND, CATEGORY_METHOD,
  CATEGORY_SERVER_ERROR, CATEGORY_VALIDATION
} from '~/modules/Categories/Infrastructure/Api/CategoryApiExceptionCode'
import { AddCategoryViewApiRequestDto } from '~/modules/Categories/Infrastructure/Api/AddCategoryViewRequestDto'
import {
  AddCategoryViewRequestValidator
} from '~/modules/Categories/Infrastructure/Api/AddCategoryViewRequestValidator'
import { AddCategoryView } from '~/modules/Categories/Application/AddCategoryView/AddCategoryView'
import {
  AddCategoryViewApplicationException
} from '~/modules/Categories/Application/AddCategoryView/AddCategoryViewApplicationException'
import {
  CategoriesApiRequestValidatorError
} from '~/modules/Categories/Infrastructure/Api/CategoriesApiRequestValidatorError'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'POST') {
    return handleMethod(request, response)
  }

  const { categoryId } = request.query

  if (!categoryId) {
    return handleBadRequest(response)
  }

  const apiRequest: AddCategoryViewApiRequestDto = {
    categoryId: String(categoryId),
  }

  const validationError = AddCategoryViewRequestValidator.validate(apiRequest)

  if (validationError) {
    return handleValidationError(response, validationError)
  }

  const useCase = container.resolve<AddCategoryView>('addCategoryViewUseCase')

  try {
    await useCase.add({ categoryId: apiRequest.categoryId })

    response.status(201).end()
  } catch (exception: unknown) {
    if (!(exception instanceof AddCategoryViewApplicationException)) {
      console.error(exception)

      return handleServerError(response)
    }

    switch (exception.id) {
      case AddCategoryViewApplicationException.categoryNotFoundId:
        return handleNotFound(response, CATEGORY_CATEGORY_NOT_FOUND, exception.message)

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
      code: CATEGORY_METHOD,
      message: `Cannot ${request.method} ${request.url?.toString()}`,
    })
}

function handleValidationError (
  response: NextApiResponse,
  validationError: CategoriesApiRequestValidatorError
) {
  return response.status(400)
    .json({
      code: CATEGORY_VALIDATION,
      message: 'Invalid request',
      errors: validationError.exceptions,
    })
}

function handleBadRequest (response: NextApiResponse) {
  return response.status(400)
    .json({
      code: CATEGORY_BAD_REQUEST,
      message: 'categoryId parameter is required',
    })
}

function handleNotFound (
  response: NextApiResponse,
  code: string,
  message: string
) {
  return response.status(404)
    .json({
      code,
      message,
    })
}

function handleServerError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: CATEGORY_SERVER_ERROR,
      message: 'Something went wrong while processing the request',
    })
}
