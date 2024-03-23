import { ValidationException } from '~/modules/Shared/Domain/ValidationException'
import { SortingCriteriaValidator } from '~/modules/Shared/Domain/SortingCriteriaValidator'
import { maxPerPage, minPerPage } from '~/modules/Shared/Domain/Pagination'
import { SortingCriteria } from '~/modules/Shared/Domain/SortingCriteria'
import { ProducerRepositoryInterface } from '~/modules/Producers/Domain/ProducerRepositoryInterface'
import {
  GetProducersApplicationRequestDto
} from '~/modules/Producers/Application/GetProducers/GetProducersApplicationRequestDto'
import {
  GetProducersApplicationResponseDto
} from '~/modules/Producers/Application/GetProducers/GetProducersApplicationResponseDto'
import {
  GetProducersApplicationResponseDtoTranslator
} from '~/modules/Producers/Application/GetProducers/GetProducersApplicationResponseDtoTranslator'
import {
  GetProducersApplicationException
} from '~/modules/Producers/Application/GetProducers/GetProducersApplicationException'
import {
  GetProducersSortingOption
} from '~/modules/Producers/Domain/ProducerSorting'
import {
  GetProducersSortingOptionValidator
} from '~/modules/Producers/Domain/Validators/GetProducersSortingOptionValidator'

export class GetProducers {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly producerRepository: ProducerRepositoryInterface) {}

  public async get (request: GetProducersApplicationRequestDto): Promise<GetProducersApplicationResponseDto> {
    GetProducers.validateRequest(request)
    const offset = (request.page - 1) * request.producersPerPage

    const sortingCriteria = GetProducers.validateSortingCriteria(request.sortCriteria)
    const sortingOption = GetProducers.validateSortingOption(request.sortOption)

    const producers = await this.producerRepository.findWithOffsetAndLimit(
      offset,
      request.producersPerPage,
      sortingOption,
      sortingCriteria
    )

    return GetProducersApplicationResponseDtoTranslator.fromDomain(producers)
  }

  private static validateRequest (request: GetProducersApplicationRequestDto): void {
    if (isNaN(request.page) || request.page <= 0) {
      throw GetProducersApplicationException.invalidPageValue()
    }

    if (isNaN(request.producersPerPage) ||
      request.producersPerPage < minPerPage ||
      request.producersPerPage > maxPerPage
    ) {
      throw GetProducersApplicationException.invalidPerPage(minPerPage, maxPerPage)
    }
  }

  private static validateSortingOption (sortingOption: string): GetProducersSortingOption {
    try {
      return new GetProducersSortingOptionValidator().validate(sortingOption)
    } catch (exception: unknown) {
      if (!(exception instanceof ValidationException)) {
        throw exception
      }

      if (exception.id === ValidationException.invalidSortingOptionId) {
        throw GetProducersApplicationException.invalidSortingOption(sortingOption)
      }

      throw exception
    }
  }

  private static validateSortingCriteria (sortingCriteria: string): SortingCriteria {
    try {
      return new SortingCriteriaValidator().validate(sortingCriteria)
    } catch (exception: unknown) {
      if (!(exception instanceof ValidationException)) {
        throw exception
      }

      if (exception.id === ValidationException.invalidSortingCriteriaId) {
        throw GetProducersApplicationException.invalidSortingCriteria(sortingCriteria)
      }

      throw exception
    }
  }
}