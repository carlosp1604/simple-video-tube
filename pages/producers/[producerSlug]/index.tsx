import { GetServerSideProps } from 'next'
import { container } from '~/awilix.container'
import { GetPosts } from '~/modules/Posts/Application/GetPosts/GetPosts'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { GetProducerBySlug } from '~/modules/Producers/Application/GetProducerBySlug/GetProducerBySlug'
import { ProducerPage, ProducerPageProps } from '~/components/pages/ProducerPage/ProducerPage'
import {
  ProducerPageComponentDtoTranslator
} from '~/modules/Producers/Infrastructure/ProducerPageComponentDtoTranslator'
import { PostsQueryParamsParser } from '~/modules/Posts/Infrastructure/Frontend/PostsQueryParamsParser'
import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import {
  HtmlPageMetaContextService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextService'
import { FilterOptions } from '~/modules/Shared/Infrastructure/FrontEnd/FilterOptions'
import { i18nConfig } from '~/i18n.config'

export const getServerSideProps: GetServerSideProps<ProducerPageProps> = async (context) => {
  const producerSlug = context.query.producerSlug
  const locale = context.locale ?? i18nConfig.defaultLocale

  if (!producerSlug) {
    return {
      notFound: true,
    }
  }

  if (Object.entries(context.query).length > 1) {
    return {
      redirect: {
        destination: `/${locale}/producers/${producerSlug}`,
        permanent: false,
      },
    }
  }

  const paginationQueryParams = new PostsQueryParamsParser(
    context.query,
    {
      sortingOptionType: {
        defaultValue: PaginationSortingType.LATEST,
        parseableOptionTypes: [
          PaginationSortingType.LATEST,
          PaginationSortingType.OLDEST,
          PaginationSortingType.MOST_VIEWED,
        ],
      },
      page: { defaultValue: 1, minValue: 1, maxValue: Infinity },
    }
  )

  if (paginationQueryParams.parseFailed) {
    const stringPaginationParams = paginationQueryParams.getParsedQueryString()

    return {
      redirect: {
        destination: `/${locale}/producers/${producerSlug}?${stringPaginationParams}`,
        permanent: false,
      },
    }
  }

  const { env } = process
  let indexPage = false
  let baseUrl = ''

  if (!env.INDEX_WEBSITE) {
    throw Error('Missing env var: INDEX_WEBSITE. Required in the producer page')
  } else {
    indexPage = env.INDEX_WEBSITE === 'true'
  }

  if (!env.BASE_URL) {
    throw Error('Missing env var: BASE_URL. Required in the producer page')
  } else {
    baseUrl = env.BASE_URL
  }

  const htmlPageMetaContextService = new HtmlPageMetaContextService(
    context,
    { includeQuery: false, includeLocale: true },
    { index: indexPage, follow: indexPage }
  )

  const props: ProducerPageProps = {
    producer: {
      description: '',
      slug: '',
      name: '',
      imageUrl: '',
      id: '',
      viewsNumber: 0,
    },
    initialOrder: paginationQueryParams.sortingOptionType ?? PaginationSortingType.LATEST,
    initialPage: paginationQueryParams.page ?? 1,
    initialPosts: [],
    initialPostsNumber: 0,
    htmlPageMetaContextProps: htmlPageMetaContextService.getProperties(),
    baseUrl,
  }

  const getProducer = container.resolve<GetProducerBySlug>('getProducerBySlugUseCase')
  const getPosts = container.resolve<GetPosts>('getPostsUseCase')

  try {
    const producer = await getProducer.get(producerSlug.toString())

    props.producer = ProducerPageComponentDtoTranslator.fromApplicationDto(producer)
  } catch (exception: unknown) {
    console.error(exception)

    return {
      notFound: true,
    }
  }

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

    const producerPosts = await getPosts.get({
      page,
      filters: [{ type: FilterOptions.PRODUCER_SLUG, value: String(producerSlug) }],
      sortCriteria,
      sortOption,
      postsPerPage: defaultPerPage,
    })

    props.initialPosts = producerPosts.posts.map((post) => {
      return PostCardComponentDtoTranslator.fromApplication(post, locale)
    })
    props.initialPostsNumber = producerPosts.postsNumber
  } catch (exception: unknown) {
    console.error(exception)
  }

  // Experimental: Try yo improve performance
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=50, stale-while-revalidate=10'
  )

  return {
    props,
  }
}

export default ProducerPage
