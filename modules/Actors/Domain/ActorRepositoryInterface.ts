import { Actor } from './Actor'
import { RepositoryFilterOptionInterface } from '~/modules/Shared/Domain/RepositoryFilterOption'
import { RepositorySortingCriteria, RepositorySortingOptions } from '~/modules/Shared/Domain/RepositorySorting'

export type ActorRepositoryFilterOption = Extract<RepositoryFilterOptionInterface,
  'actorName' |
  'actorId'
>

export interface ActorRepositoryInterface {
  /**
   * Find an Actor given its ID
   * @param actorId Actor ID
   * @return Actor if found or null
   */
  findById(actorId: Actor['id']): Promise<Actor | null>

  /**
   * Find Actors based on filter and order criteria
   * @param offset Post offset
   * @param limit
   * @param sortingOption Post sorting option
   * @param sortingCriteria Post sorting criteria
   * @return Post if found or null
   */
  findWithOffsetAndLimit(
    offset: number,
    limit: number,
    sortingOption: RepositorySortingOptions,
    sortingCriteria: RepositorySortingCriteria,
    filters: RepositoryFilterOptionInterface[],
  ): Promise<Actor[]>

  /**
   * Count Actos based on filters
   * @param filters Actor filters
   * @return Number of actors that accomplish with the filters
   */
  countPostsWithFilters(
    filters: RepositoryFilterOptionInterface[],
  ): Promise<number>
}
