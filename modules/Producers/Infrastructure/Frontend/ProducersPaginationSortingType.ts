import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'

export type ProducersPaginationSortingType = Extract<PaginationSortingType,
  PaginationSortingType.POPULARITY |
  PaginationSortingType.NAME_FIRST |
  PaginationSortingType.NAME_LAST
  // Not supported by prisma for the moment
  // PaginationSortingType.MORE_POSTS |
  // PaginationSortingType.LESS_POSTS
>
