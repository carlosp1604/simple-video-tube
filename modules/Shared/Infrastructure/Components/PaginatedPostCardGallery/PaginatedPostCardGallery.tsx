import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { useRouter } from 'next/router'
import { PostCardGallery } from '~/modules/Posts/Infrastructure/Components/PostCardGallery/PostCardGallery'
import { defaultPerPage, PaginationHelper } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import { FC, ReactElement, useEffect, useState } from 'react'
import { ElementLinkMode } from '~/modules/Shared/Infrastructure/FrontEnd/ElementLinkMode'
import { PostFilterOptions } from '~/modules/Posts/Infrastructure/Frontend/PostFilterOptions'
import { useFirstRender } from '~/hooks/FirstRender'
import { FetchFilter } from '~/modules/Shared/Infrastructure/FrontEnd/FetchFilter'
import dynamic from 'next/dynamic'
import { SortingMenuDropdown } from '~/components/SortingMenuDropdown/SortingMenuDropdown'
import {
  CommonGalleryHeader, HeaderTag,
  TitleTerm
} from '~/modules/Shared/Infrastructure/Components/CommonGalleryHeader/CommonGalleryHeader'
import { useUsingRouterContext } from '~/hooks/UsingRouterContext'
import { GetPostsApplicationResponse } from '~/modules/Posts/Application/Dtos/GetPostsApplicationDto'
import {
  PaginationSortingType
} from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import { QueryParamsParserConfiguration } from '~/modules/Shared/Infrastructure/FrontEnd/QueryParamsParser'
import { ParsedUrlQuery } from 'querystring'
import { i18nConfig } from '~/i18n.config'

const PaginationBar = dynamic(() =>
  import('~/components/PaginationBar/PaginationBar').then((module) => module.PaginationBar), { ssr: false }
)

export type PostsFetcher = (
  page: number,
  order: PostsPaginationSortingType,
  filters: FetchFilter<PostFilterOptions>[]
) => Promise<GetPostsApplicationResponse | null>

export type PaginationStateChange = (
  pageNumber: number,
  order: PostsPaginationSortingType,
  filters: FetchFilter<PostFilterOptions>[]
) => void

interface PaginationState {
  page: number
  order: PostsPaginationSortingType
  filters: FetchFilter<PostFilterOptions>[]
}

export interface Props {
  title: string
  term: TitleTerm | undefined
  headerTag: HeaderTag
  subtitle: string
  page: number
  order: PostsPaginationSortingType
  initialPosts: PostCardComponentDto[] | undefined
  initialPostsNumber: number | undefined
  filters: FetchFilter<PostFilterOptions>[]
  filtersToParse: PostFilterOptions[]
  linkMode: ElementLinkMode | undefined
  sortingOptions: PostsPaginationSortingType[]
  defaultSortingOption: PostsPaginationSortingType
  onPostsFetched: (postsNumber: number, posts: PostCardComponentDto[]) => void
  emptyState: ReactElement
  onPaginationStateChanges: PaginationStateChange | undefined
}

export const PaginatedPostCardGallery: FC<Partial<Props> & Omit<Props,
  'term' | 'initialPostsNumber' | 'initialPosts' | 'linkMode' | 'onPaginationStateChanges'
>> = ({
  title,
  term = undefined,
  headerTag,
  subtitle,
  initialPostsNumber = undefined,
  initialPosts = undefined,
  page,
  order,
  filtersToParse,
  filters,
  linkMode = undefined,
  sortingOptions,
  defaultSortingOption,
  emptyState,
  onPaginationStateChanges = undefined,
  onPostsFetched,
}) => {
  const [posts, setPosts] =
    useState<PostCardComponentDto[]>(initialPosts ?? [])
  const [postsNumber, setPostsNumber] =
    useState<number>(initialPostsNumber ?? 0)
  const [loading, setLoading] = useState<boolean>(false)

  const router = useRouter()
  const { query } = router
  const locale = router.locale ?? i18nConfig.defaultLocale
  const firstRender = useFirstRender()
  const { setBlocked } = useUsingRouterContext()

  const [paginationState, setPaginationState] = useState<PaginationState>({
    page,
    order,
    filters,
  })

  const updatePosts = async (
    page:number,
    order: PostsPaginationSortingType,
    filters: FetchFilter<PostFilterOptions>[]
  ) => {
    setLoading(true)

    const PostsQueryParamsParser = (await import('~/modules/Posts/Infrastructure/Frontend/PostsQueryParamsParser'))
      .PostsQueryParamsParser

    const parsedFilters = filters.map((filter) => {
      return {
        type: PostsQueryParamsParser.getFilterAlias(filter.type),
        value: filter.value,
      }
    })

    const PostsApiService =
        (await import('~/modules/Posts/Infrastructure/Frontend/PostsApiService')).PostsApiService
    const fromOrderTypeToComponentSortingOption =
      (await import('~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'))
        .fromOrderTypeToComponentSortingOption

    const postsApiService = new PostsApiService()

    const componentOrder = fromOrderTypeToComponentSortingOption(order)

    try {
      const newPosts = await postsApiService.getPosts(
        page,
        defaultPerPage,
        componentOrder.criteria,
        componentOrder.option,
        parsedFilters,
        locale
      )

      setPosts(newPosts.posts)
      setPostsNumber(newPosts.postsNumber)
      onPostsFetched(newPosts.postsNumber, newPosts.posts)
    } catch (exception: unknown) {
      console.error(exception)
    } finally {
      setLoading(false)
    }
  }

  const handleQueryChange = async (query: ParsedUrlQuery) => {
    const configuration:
      Omit<QueryParamsParserConfiguration<PostFilterOptions, PostsPaginationSortingType>, 'perPage'> = {
        page: {
          defaultValue: 1,
          maxValue: Infinity,
          minValue: 1,
        },
        filters: {
          filtersToParse,
        },
        sortingOptionType: {
          defaultValue: defaultSortingOption,
          parseableOptionTypes: sortingOptions,
        },
      }

    const PostsQueryParamsParser = (await import('~/modules/Posts/Infrastructure/Frontend/PostsQueryParamsParser'))
      .PostsQueryParamsParser

    const PaginatedPostCardGalleryHelper =
      (await import('~/modules/Posts/Infrastructure/Frontend/PaginatedPostCardGalleryHelper'))
        .PaginatedPostCardGalleryHelper

    const queryParams = new PostsQueryParamsParser(query, configuration)

    const newPage = queryParams.page ?? configuration.page.defaultValue

    const newOrder = queryParams.sortingOptionType ?? configuration.sortingOptionType.defaultValue

    const newFilters = queryParams.filters

    if (
      newPage === paginationState.page &&
      newOrder === paginationState.order &&
      PaginatedPostCardGalleryHelper.arraysEqual(paginationState.filters, newFilters)
    ) {
      return
    }

    setPaginationState({ page: newPage, order: newOrder, filters: newFilters })

    setBlocked(true)

    await updatePosts(newPage, newOrder, newFilters)

    onPaginationStateChanges && onPaginationStateChanges(newPage, newOrder, newFilters)

    setBlocked(false)
  }

  useEffect(() => {
    if (firstRender && initialPostsNumber === undefined) {
      setBlocked(true)
      updatePosts(paginationState.page, paginationState.order, paginationState.filters)
        .then(() => {
          // onFetchNewPosts(newPage, newOrder, newFilters)
          setBlocked(false)
        })

      return
    }

    handleQueryChange(query).then()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const onClickSortingMenu = async (option: PaginationSortingType) => {
    if (!linkMode) {
      setPaginationState({ ...paginationState, order: option as PostsPaginationSortingType, page: 1 })

      await updatePosts(1, option as PostsPaginationSortingType, filters)
    } else {
      if (!linkMode.scrollOnClick) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  const onPageChange = async (newPage: number) => {
    if (!linkMode) {
      setPaginationState({ ...paginationState, page: newPage })

      await updatePosts(newPage, order, filters)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      if (!linkMode.scrollOnClick) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  const sortingMenu = (
    <SortingMenuDropdown
      activeOption={ paginationState.order }
      options={ sortingOptions }
      loading={ loading }
      visible={ postsNumber > defaultPerPage }
      linkMode={ linkMode }
      onClickOption={ onClickSortingMenu }
    />
  )

  const headerContent = (
    <CommonGalleryHeader
      title={ title }
      subtitle={ subtitle }
      loading={ loading }
      sortingMenu={ sortingMenu }
      tag={ headerTag }
      term={ term }
    />
  )

  return (
    <>
      { headerContent }
      <PostCardGallery
        posts={ posts }
        loading={ loading }
        emptyState={ emptyState }
        showAds={ true }
      />
      <PaginationBar
        pageNumber={ paginationState.page }
        pagesNumber={ PaginationHelper.calculatePagesNumber(postsNumber, defaultPerPage) }
        linkMode={ linkMode }
        onPageChange={ onPageChange }
        disabled={ loading }
      />
    </>
  )
}
