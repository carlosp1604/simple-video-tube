import { GetServerSideProps } from 'next'
import { ActorsPage, ActorsPageProps } from '~/components/pages/ActorsPage/ActorsPage'
import { container } from '~/awilix.container'
import { GetActors } from '~/modules/Actors/Application/GetActors/GetActors'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { ActorCardDtoTranslator } from '~/modules/Actors/Infrastructure/ActorCardDtoTranslator'
import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import {
  HtmlPageMetaContextService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextService'
import { ActorQueryParamsParser } from '~/modules/Actors/Infrastructure/Frontend/ActorQueryParamsParser'
import { FilterOptions } from '~/modules/Shared/Infrastructure/FrontEnd/FilterOptions'
import { i18nConfig } from '~/i18n.config'

export const getServerSideProps: GetServerSideProps<ActorsPageProps> = async (context) => {
  const locale = context.locale ?? i18nConfig.defaultLocale

  const paginationQueryParams = new ActorQueryParamsParser(
    context.query,
    {
      filters: {
        filtersToParse: [FilterOptions.ACTOR_NAME],
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
        destination: `/${locale}/actors?${stringPaginationParams}`,
        permanent: false,
      },
    }
  }

  const { env } = process
  let indexPage = false

  if (!env.INDEX_WEBSITE) {
    throw Error('Missing env var: INDEX_WEBSITE. Required in the actors page')
  } else {
    indexPage = env.INDEX_WEBSITE === 'true'
  }

  const htmlPageMetaContextService = new HtmlPageMetaContextService(
    context,
    { includeQuery: false, includeLocale: true },
    { index: indexPage, follow: indexPage }
  )

  const props: ActorsPageProps = {
    initialSearchTerm: '',
    initialActors: [],
    initialActorsNumber: 0,
    initialOrder: paginationQueryParams.sortingOptionType ?? PaginationSortingType.NAME_FIRST,
    initialPage: paginationQueryParams.page ?? 1,
    htmlPageMetaContextProps: htmlPageMetaContextService.getProperties(),
  }

  const getActors = container.resolve<GetActors>('getActorsUseCase')

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

    const actorNameFilter = paginationQueryParams.getFilter(FilterOptions.ACTOR_NAME)

    if (actorNameFilter) {
      props.initialSearchTerm = actorNameFilter.value
    }

    const actors = await getActors.get({
      actorsPerPage: defaultPerPage,
      page,
      sortCriteria,
      sortOption,
      filters: actorNameFilter ? [actorNameFilter] : [],
    })

    props.initialActorsNumber = actors.actorsNumber
    props.initialActors = actors.actors.map((actor) => {
      return ActorCardDtoTranslator.fromApplicationDto(actor.actor, actor.postsNumber)
    })

    // Experimental: Try yo improve performance
    context.res.setHeader(
      'Cache-Control',
      'public, s-maxage=50, stale-while-revalidate=10'
    )

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

export default ActorsPage
