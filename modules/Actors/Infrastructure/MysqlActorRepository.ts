import { Prisma } from '@prisma/client'
import { ActorModelTranslator } from './ActorModelTranslator'
import { ActorRepositoryInterface } from '~/modules/Actors/Domain/ActorRepositoryInterface'
import { Actor } from '~/modules/Actors/Domain/Actor'
import { prisma } from '~/persistence/prisma'
import { PostFilterOptionInterface } from '~/modules/Shared/Domain/Posts/PostFilterOption'
import { PostSortingOption } from '~/modules/Shared/Domain/Posts/PostSorting'
import { SortingCriteria } from '~/modules/Shared/Domain/SortingCriteria'

export class MysqlActorRepository implements ActorRepositoryInterface {
  /**
   * Find an Actor given its ID
   * @param actorId Actor ID
   * @return Actor if found or null
   */
  public async findById (actorId: Actor['id']): Promise<Actor | null> {
    const actor = await prisma.actor.findFirst({
      where: {
        id: actorId,
        deletedAt: null,
      },
    })

    if (actor === null) {
      return null
    }

    return ActorModelTranslator.toDomain(actor)
  }

  /**
   * Find an Actor given its slug
   * @param actorSlug Actor Slug
   * @return Actor if found or null
   */
  public async findBySlug (actorSlug: Actor['slug']): Promise<Actor | null> {
    const actor = await prisma.actor.findFirst({
      where: {
        slug: actorSlug,
        deletedAt: null,
      },
    })

    if (actor === null) {
      return null
    }

    return ActorModelTranslator.toDomain(actor)
  }

  /**
   * Find Actors based on filter and order criteria
   * @param offset Post offset
   * @param limit
   * @param sortingOption Post sorting option
   * @param sortingCriteria Post sorting criteria
   * @return Post if found or null
   */
  public async findWithOffsetAndLimit (
    offset: number,
    limit: number,
    sortingOption: PostSortingOption,
    sortingCriteria: SortingCriteria,
    filters: PostFilterOptionInterface[]
  ): Promise<Actor[]> {
    let whereClause: Prisma.ActorWhereInput | undefined = {
      deletedAt: null,
    }

    const whereFilters = this.buildFilters(filters)

    whereClause = {
      ...whereClause,
      ...whereFilters,
    }

    const actors = await prisma.actor.findMany({
      where: whereClause,
      take: limit,
      skip: offset,
    })

    return actors.map((actor) => ActorModelTranslator.toDomain(actor))
  }

  /**
   * Count Actors based on filters
   * @param filters Actor filters
   * @return Number of actors that accomplish with the filters
   */
  public async countPostsWithFilters (
    filters: PostFilterOptionInterface[]
  ): Promise<number> {
    let whereClause: Prisma.ActorWhereInput | undefined = {
      deletedAt: null,
    }

    const whereFilters = this.buildFilters(filters)

    whereClause = {
      ...whereClause,
      ...whereFilters,
    }

    const actorsNumber = await prisma.actor.count({
      where: whereClause,
    })

    return actorsNumber
  }

  private buildFilters (
    filters: PostFilterOptionInterface[]
  ): Prisma.ActorWhereInput | undefined {
    let whereClause: Prisma.ActorWhereInput | undefined = {}

    for (const filter of filters) {
      if (filter.type === 'actorSlug') {
        whereClause = {
          ...whereClause,
          name: filter.value,
        }
      }

      if (filter.type === 'actorId') {
        whereClause = {
          ...whereClause,
          id: filter.value,
        }
      }
    }

    return whereClause
  }
}
