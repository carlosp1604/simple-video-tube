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
import { PostsQueryParamsParser } from '~/modules/Posts/Infrastructure/Frontend/PostsQueryParamsParser'
import { GetCategoryBySlug } from '~/modules/Categories/Application/GetCategoryBySlug/GetCategoryBySlug'
import { CategoryPage, CategoryPageProps } from '~/components/pages/CategoryPage/CategoryPage'
import {
  CategoryPageComponentDtoTranslator
} from '~/modules/Categories/Infrastructure/Translators/CategoryPageComponentDtoTranslator'
import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import {
  HtmlPageMetaContextService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextService'
import { FilterOptions } from '~/modules/Shared/Infrastructure/FrontEnd/FilterOptions'
import { i18nConfig } from '~/i18n.config'

export const getServerSideProps: GetServerSideProps<CategoryPageProps> = async (context) => {
  const categorySlug = context.query.categorySlug
  const locale = context.locale ?? i18nConfig.defaultLocale

  if (!categorySlug) {
    return {
      notFound: true,
    }
  }

  if (Object.entries(context.query).length > 1) {
    return {
      redirect: {
        destination: `/${locale}/categories/${categorySlug}`,
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
        destination: `/${locale}/categories/${categorySlug}?${stringPaginationParams}`,
        permanent: false,
      },
    }
  }

  const { env } = process
  let baseUrl = ''

  if (!env.BASE_URL) {
    throw Error('Missing env var: BASE_URL. Required in the category page')
  } else {
    baseUrl = env.BASE_URL
  }

  // Experimental: Try yo improve performance
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=50, stale-while-revalidate=10'
  )

  const htmlPageMetaContextService =
    new HtmlPageMetaContextService(context, { includeQuery: false, includeLocale: true })

  const props: CategoryPageProps = {
    category: {
      imageUrl: null,
      slug: '',
      name: '',
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

  const getCategory = container.resolve<GetCategoryBySlug>('getCategoryBySlugUseCase')
  const getPosts = container.resolve<GetPosts>('getPostsUseCase')

  try {
    const category = await getCategory.get(categorySlug.toString())

    props.category = CategoryPageComponentDtoTranslator.fromApplicationDto(category, locale)
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
      filters: [{ type: FilterOptions.CATEGORY_SLUG, value: String(categorySlug) }],
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

  return {
    props,
  }
}

export default CategoryPage
