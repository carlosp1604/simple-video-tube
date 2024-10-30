import { GetPosts } from '~/modules/Posts/Application/GetPosts/GetPosts'
import { container } from '~/awilix.container'
import { HomePage, Props } from '~/components/pages/HomePage/HomePage'
import { GetServerSideProps } from 'next'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { PostsQueryParamsParser } from '~/modules/Posts/Infrastructure/Frontend/PostsQueryParamsParser'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import {
  HtmlPageMetaContextService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextService'
import { i18nConfig } from '~/i18n.config'

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const locale = context.locale ?? i18nConfig.defaultLocale

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
        destination: `/${locale}?${stringPaginationParams}`,
        permanent: false,
      },
    }
  }

  const htmlPageMetaContextService = new HtmlPageMetaContextService(
    context,
    { includeLocale: true, includeQuery: false },
    { index: true, follow: true }
  )
  const { env } = process

  let baseUrl = ''

  if (!env.BASE_URL) {
    throw Error('Missing env var: BASE_URL. Required in the home page')
  } else {
    baseUrl = env.BASE_URL
  }

  const props: Props = {
    order: paginationQueryParams.sortingOptionType ?? PaginationSortingType.LATEST,
    page: paginationQueryParams.page ?? 1,
    initialPosts: [],
    initialPostsNumber: 0,
    baseUrl,
    htmlPageMetaContextProps: htmlPageMetaContextService.getProperties(),
  }

  const getPosts = container.resolve<GetPosts>('getPostsUseCase')

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

    const posts = await getPosts.get({
      page,
      filters: paginationQueryParams.filters,
      sortCriteria,
      sortOption,
      postsPerPage: defaultPerPage,
    })

    props.initialPosts = posts.posts.map((post) => {
      return PostCardComponentDtoTranslator.fromApplication(post, locale)
    })
    props.initialPostsNumber = posts.postsNumber
  } catch (exception: unknown) {
    console.error(exception)
  }

  return {
    props,
  }
}

export default HomePage
