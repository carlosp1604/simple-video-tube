import { ComponentSortingOption } from '~/components/SortingMenuDropdown/ComponentSortingOptions'
import {
  MoreViewsPostsSortingOption,
  NewestPostsSortingOption,
  NewestSavedPostsSortingOption,
  NewestViewedSortingOption,
  OldestPostsSortingOption,
  OldestSavedPostsSortingOption, OldestViewedSortingOption
} from '~/modules/Posts/Infrastructure/Frontend/PostsComponentSortingOptions'
import {
  LessPostsActorsSortingOption,
  MorePostsActorsSortingOption,
  NameFirstActorsSortingOption,
  NameLastActorsSortingOption
} from '~/modules/Actors/Infrastructure/Frontend/ActorsComponentSortingOptions'

export enum PaginationSortingType {
  MOST_VIEWED = 'most-viewed',
  LATEST = 'latest',
  OLDEST = 'oldest',
  NEWEST_SAVED = 'newest-saved',
  OLDEST_SAVED = 'oldest-saved',
  NEWEST_VIEWED = 'newest-viewed',
  OLDEST_VIEWED = 'oldest-viewed',
  NAME_FIRST = 'name-first',
  NAME_LAST = 'name-last',
  MORE_POSTS = 'more-posts',
  LESS_POSTS = 'less-posts'
}

export const fromOrderTypeToComponentSortingOption = (type: PaginationSortingType): ComponentSortingOption => {
  switch (type) {
    case PaginationSortingType.LATEST:
      return NewestPostsSortingOption
    case PaginationSortingType.MOST_VIEWED:
      return MoreViewsPostsSortingOption
    case PaginationSortingType.OLDEST:
      return OldestPostsSortingOption
    case PaginationSortingType.NEWEST_SAVED:
      return NewestSavedPostsSortingOption
    case PaginationSortingType.NEWEST_VIEWED:
      return NewestViewedSortingOption
    case PaginationSortingType.OLDEST_SAVED:
      return OldestSavedPostsSortingOption
    case PaginationSortingType.OLDEST_VIEWED:
      return OldestViewedSortingOption
    case PaginationSortingType.NAME_FIRST:
      return NameFirstActorsSortingOption
    case PaginationSortingType.NAME_LAST:
      return NameLastActorsSortingOption
    case PaginationSortingType.MORE_POSTS:
      return MorePostsActorsSortingOption
    case PaginationSortingType.LESS_POSTS:
      return LessPostsActorsSortingOption

    default:
      throw Error('Sorting option not implemented or not exists')
  }
}
