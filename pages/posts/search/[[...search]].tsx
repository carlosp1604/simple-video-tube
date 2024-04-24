import { GetServerSideProps } from 'next'
import { SearchPage, SearchPageProps } from '~/components/pages/SearchPage/SearchPage'
import {
  PostsPaginationConfiguration,
  PostsPaginationQueryParams
} from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationQueryParams'
import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import {
  HtmlPageMetaContextService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextService'
import DOMPurify from 'isomorphic-dompurify'
import { Settings } from 'luxon'

export const getServerSideProps: GetServerSideProps<SearchPageProps> = async (context) => {
  const search = context.query.search

  if (!search) {
    return {
      notFound: true,
    }
  }

  if (Array.isArray(search) && search.length > 1) {
    return {
      notFound: true,
    }
  }

  const cleanSearchTerm = DOMPurify.sanitize(search.toLocaleString())

  if (cleanSearchTerm === '') {
    return {
      notFound: true,
    }
  }

  const locale = context.locale ?? 'en'

  Settings.defaultLocale = locale
  Settings.defaultZone = 'Europe/Madrid'

  const configuration: Partial<PostsPaginationConfiguration> &
    Pick<PostsPaginationConfiguration, 'page' | 'sortingOptionType'> = {
      page: {
        defaultValue: 1,
        maxValue: Infinity,
        minValue: 1,
      },
      sortingOptionType: {
        defaultValue: PaginationSortingType.LATEST,
        parseableOptionTypes: [
          PaginationSortingType.LATEST,
          PaginationSortingType.OLDEST,
          PaginationSortingType.MOST_VIEWED,
        ],
      },
    }

  const paginationQueryParams = new PostsPaginationQueryParams(context.query, configuration)

  if (paginationQueryParams.parseFailed) {
    const query = paginationQueryParams.getParsedQueryString()

    return {
      redirect: {
        destination: `/${locale}/posts/search?search=${search}${query !== '' ? `&${query}` : ''}`,
        permanent: false,
      },
    }
  }

  // Experimental: Try yo improve performance
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=300'
  )

  const htmlPageMetaContextService = new HtmlPageMetaContextService(context)
  const { env } = process

  let baseUrl = ''

  if (!env.BASE_URL) {
    throw Error('Missing env var: BASE_URL. Required in the search page')
  } else {
    baseUrl = env.BASE_URL
  }

  return {
    props: {
      initialSearchTerm: DOMPurify.sanitize(search.toLocaleString()),
      initialSortingOption: paginationQueryParams.sortingOptionType ?? configuration.sortingOptionType.defaultValue,
      initialPage: paginationQueryParams.page ?? configuration.page.defaultValue,
      htmlPageMetaContextProps: htmlPageMetaContextService.getProperties(),
      baseUrl,
    },
  }
}

export default SearchPage
