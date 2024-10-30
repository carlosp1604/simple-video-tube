import { GetServerSideProps } from 'next'
import { container } from '~/awilix.container'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { ProducersPage, ProducersPageProps } from '~/components/pages/ProducersPage/ProducersPage'
import { GetProducers } from '~/modules/Producers/Application/GetProducers/GetProducers'
import { ProducerCardDtoTranslator } from '~/modules/Producers/Infrastructure/ProducerCardDtoTranslator'
import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import {
  HtmlPageMetaContextService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextService'
import { ProducerQueryParamsParser } from '~/modules/Producers/Infrastructure/Frontend/ProducerQueryParamsParser'
import { FilterOptions } from '~/modules/Shared/Infrastructure/FrontEnd/FilterOptions'
import { i18nConfig } from '~/i18n.config'

export const getServerSideProps: GetServerSideProps<ProducersPageProps> = async (context) => {
  const locale = context.locale ?? i18nConfig.defaultLocale

  const paginationQueryParams = new ProducerQueryParamsParser(
    context.query,
    {
      filters: {
        filtersToParse: [FilterOptions.PRODUCER_NAME],
      },
      sortingOptionType: {
        defaultValue: PaginationSortingType.POPULARITY,
        parseableOptionTypes: [
          PaginationSortingType.POPULARITY,
          PaginationSortingType.NAME_FIRST,
          PaginationSortingType.NAME_LAST,
        ],
      },
      page: { defaultValue: 1, minValue: 1, maxValue: Infinity },
    }
  )

  if (paginationQueryParams.parseFailed) {
    const stringPaginationParams = paginationQueryParams.getParsedQueryString()

    return {
      redirect: {
        destination: `/${locale}/producers?${stringPaginationParams}`,
        permanent: false,
      },
    }
  }

  // Experimental: Try yo improve performance
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=50, stale-while-revalidate=10'
  )

  const htmlPageMetaContextService = new HtmlPageMetaContextService(
    context,
    { includeQuery: false, includeLocale: true },
    { index: true, follow: true }
  )

  const props: ProducersPageProps = {
    initialSearchTerm: '',
    initialProducers: [],
    initialProducersNumber: 0,
    initialOrder: paginationQueryParams.sortingOptionType ?? PaginationSortingType.NAME_FIRST,
    initialPage: paginationQueryParams.page ?? 1,
    htmlPageMetaContextProps: htmlPageMetaContextService.getProperties(),
  }

  const getProducers = container.resolve<GetProducers>('getProducersUseCase')

  try {
    let sortCriteria: InfrastructureSortingCriteria = InfrastructureSortingCriteria.DESC
    let sortOption: InfrastructureSortingOptions = InfrastructureSortingOptions.DATE
    let page = 1

    if (paginationQueryParams.componentSortingOption) {
      sortOption = paginationQueryParams.componentSortingOption.option
      sortCriteria = paginationQueryParams.componentSortingOption.criteria
    }

    if (paginationQueryParams.page) {
      page = paginationQueryParams.page
    }

    const producerNameFilter = paginationQueryParams.getFilter(FilterOptions.PRODUCER_NAME)

    if (producerNameFilter) {
      props.initialSearchTerm = producerNameFilter.value
    }

    const actors = await getProducers.get({
      producersPerPage: defaultPerPage,
      page,
      sortCriteria,
      sortOption,
      filters: producerNameFilter ? [producerNameFilter] : [],
    })

    props.initialProducersNumber = actors.producersNumber
    props.initialProducers = actors.producers.map((producer) => {
      return ProducerCardDtoTranslator
        .fromApplicationDto(producer.producer, producer.postsNumber, producer.producerViews)
    })

    return {
      props,
    }
  } catch (exception: unknown) {
    console.error(exception)

    return {
      notFound: true,
    }
  }
}

export default ProducersPage
