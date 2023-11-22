import { FetchPostsFilter } from '~/modules/Posts/Infrastructure/FetchPostsFilter'
import { ParsedUrlQuery } from 'querystring'
import { PostFilterOptions } from '~/modules/Posts/Infrastructure/PostFilterOptions'
import {
  ComponentSortingOption,
  HistoryDefaultSortingOption, HistoryOldestViewedSortingOption,
  HomeMoreViewsEntriesSortingOption,
  HomeOldestEntriesSortingOption,
  HomePostsDefaultSortingOption,
  SavedPostsDefaultSortingOption,
  SavedPostsOldestSavedSortingOption
} from '~/components/SortingMenuDropdown/ComponentSortingOptions'

export enum PostsPaginationOrderType {
  MOST_VIEWED = 'most-viewed',
  LATEST = 'latest',
  OLDEST = 'oldest',
  NEWEST_SAVED = 'rs',
  OLDEST_SAVED = 'os',
  NEWEST_VIEWED = 'nv',
  OLDEST_VIEWED = 'ov'
}

export const HomePagePaginationOrderType: PostsPaginationOrderType[] = [
  PostsPaginationOrderType.LATEST,
  PostsPaginationOrderType.OLDEST,
  PostsPaginationOrderType.MOST_VIEWED,
]

export const SavedPostsPaginationOrderType: PostsPaginationOrderType[] = [
  PostsPaginationOrderType.OLDEST_SAVED,
  PostsPaginationOrderType.NEWEST_SAVED,
]

export const HistoryPaginationOrderType: PostsPaginationOrderType[] = [
  PostsPaginationOrderType.NEWEST_VIEWED,
  PostsPaginationOrderType.OLDEST_VIEWED,
]

export interface PostsPaginationNumericParameterConfiguration {
  defaultValue: number
  maxValue: number
  minValue: number
}

export interface PostsPaginationFiltersParameterConfiguration {
  filtersToParse: PostFilterOptions[]
}

export interface PostsPaginationSortingOptionParameterConfiguration {
  defaultValue: PostsPaginationOrderType
  parseableOptionTypes: PostsPaginationOrderType[]
}

export interface PostsPaginationConfiguration {
  page: PostsPaginationNumericParameterConfiguration
  perPage: PostsPaginationNumericParameterConfiguration
  filters: PostsPaginationFiltersParameterConfiguration
  sortingOptionType: PostsPaginationSortingOptionParameterConfiguration
}

export class PostsPaginationQueryParams {
  private configuration: Partial<PostsPaginationConfiguration>
  public readonly page: number | null
  public readonly perPage: number | null
  public readonly filters: FetchPostsFilter[]
  public readonly sortingOptionType: PostsPaginationOrderType | null
  private _parseFailed = false

  constructor (
    query: ParsedUrlQuery,
    configuration: Partial<PostsPaginationConfiguration>
  ) {
    this.configuration = configuration
    this.page = this.parsePage(query)
    this.perPage = this.parsePerPage(query)
    this.filters = this.parseFilters(query)
    this.sortingOptionType = this.parseSortingOption(query)
  }

  private parsePage (query: ParsedUrlQuery): number | null {
    let parsedPage: number | null = null

    const { page } = query

    if (!page) {
      if (this.configuration.page) {
        return this.configuration.page.defaultValue
      }

      return null
    }

    if (Array.isArray(page)) {
      this._parseFailed = true
    } else {
      parsedPage = this.parseNumber(page)

      if (parsedPage === null) {
        this._parseFailed = true
      } else {
        if (this.configuration.page) {
          if (parsedPage > this.configuration.page.maxValue || parsedPage < this.configuration.page.minValue) {
            this._parseFailed = true
            parsedPage = null
          }
        }
      }
    }

    if (parsedPage === null && this.configuration.page) {
      parsedPage = this.configuration.page.defaultValue
    }

    return parsedPage
  }

  private parsePerPage (query: ParsedUrlQuery): number | null {
    let parsedPerPage: number | null = null

    const { perPage } = query

    if (!perPage) {
      if (this.configuration.perPage) {
        return this.configuration.perPage.defaultValue
      }

      return null
    }

    if (Array.isArray(perPage)) {
      this._parseFailed = true
    } else {
      parsedPerPage = this.parseNumber(perPage)

      if (parsedPerPage === null) {
        this._parseFailed = true
      } else {
        if (this.configuration.perPage) {
          if (
            parsedPerPage > this.configuration.perPage.maxValue ||
            parsedPerPage < this.configuration.perPage.minValue
          ) {
            this._parseFailed = true
            parsedPerPage = null
          }
        }
      }
    }

    if (parsedPerPage === null && this.configuration.perPage) {
      parsedPerPage = this.configuration.perPage.defaultValue
    }

    return parsedPerPage
  }

  private parseFilters (query: ParsedUrlQuery): FetchPostsFilter[] {
    const filters: FetchPostsFilter [] = []

    if (!this.configuration.filters) {
      return filters
    }

    for (const parseableFilter of this.configuration.filters.filtersToParse) {
      const filter = query[parseableFilter]

      if (!filter || (filter && Array.isArray(filter))) {
        continue
      }

      filters.push({
        type: parseableFilter,
        value: filter,
      })
    }

    return filters
  }

  private parseSortingOption (query: ParsedUrlQuery): PostsPaginationOrderType | null {
    const { order } = query

    if (!order) {
      if (this.configuration.sortingOptionType) {
        return this.configuration.sortingOptionType.defaultValue
      }

      return null
    }

    if (Array.isArray(order)) {
      this._parseFailed = true

      return null
    }

    const parseOrderBy = String(order)

    if (!this.configuration.sortingOptionType) {
      if (Object.values(PostsPaginationOrderType).includes(parseOrderBy as PostsPaginationOrderType)) {
        return parseOrderBy as PostsPaginationOrderType
      } else {
        this._parseFailed = true

        return null
      }
    }

    const validOptionMatch = this.configuration.sortingOptionType.parseableOptionTypes.find(
      (optionToParse) => optionToParse === parseOrderBy)

    if (validOptionMatch) {
      return parseOrderBy as PostsPaginationOrderType
    }

    this._parseFailed = true

    return this.configuration.sortingOptionType.defaultValue
  }

  public static fromOrderTypeToComponentSortingOption (type: PostsPaginationOrderType): ComponentSortingOption {
    switch (type) {
      case PostsPaginationOrderType.LATEST:
        return HomePostsDefaultSortingOption
      case PostsPaginationOrderType.MOST_VIEWED:
        return HomeMoreViewsEntriesSortingOption
      case PostsPaginationOrderType.OLDEST:
        return HomeOldestEntriesSortingOption
      case PostsPaginationOrderType.NEWEST_SAVED:
        return SavedPostsDefaultSortingOption
      case PostsPaginationOrderType.NEWEST_VIEWED:
        return HistoryDefaultSortingOption
      case PostsPaginationOrderType.OLDEST_SAVED:
        return SavedPostsOldestSavedSortingOption
      case PostsPaginationOrderType.OLDEST_VIEWED:
        return HistoryOldestViewedSortingOption

      default:
        throw Error('Sorting option not implemented or not exists')
    }
  }

  public getFilter (filterType: PostFilterOptions): FetchPostsFilter | null {
    const foundFilter = this.filters.find((filter) => filter.type === filterType)

    if (!foundFilter) {
      return null
    }

    return foundFilter
  }

  get parseFailed (): boolean {
    return this._parseFailed
  }

  get componentSortingOption (): ComponentSortingOption | null {
    if (this.sortingOptionType === null) {
      return null
    }

    return PostsPaginationQueryParams.fromOrderTypeToComponentSortingOption(this.sortingOptionType)
  }

  public getParsedQueryString (): string {
    const queries: string[] = []

    if (
      this.page &&
      (!this.configuration.page ||
        this.configuration.page.defaultValue !== this.page)
    ) {
      queries.push(`page=${String(this.page)}`)
    }

    if (
      this.perPage &&
      (!this.configuration.perPage ||
        this.configuration.perPage.defaultValue !== this.perPage)
    ) {
      queries.push(`perPage=${String(this.perPage)}`)
    }

    if (
      this.sortingOptionType &&
      (!this.configuration.sortingOptionType ||
        this.configuration.sortingOptionType.defaultValue !== this.sortingOptionType)
    ) {
      queries.push(`order=${String(this.sortingOptionType)}`)
    }

    return queries.join('&')
  }

  public static buildQuery (
    page: string,
    defaultPage: string,
    sortingOption: PostsPaginationOrderType,
    defaultSortingOption: PostsPaginationOrderType,
    filters: FetchPostsFilter[]
  ): ParsedUrlQuery {
    const query: ParsedUrlQuery = {}

    if (page !== defaultPage) {
      query.page = page
    }

    if (sortingOption !== defaultSortingOption) {
      query.order = sortingOption
    }

    for (const filter of filters) {
      query[filter.type] = filter.value
    }

    return query
  }

  private parseNumber (value: string): number | null {
    if (isNaN(Number(value))) {
      return null
    }

    return parseInt(value)
  }
}
