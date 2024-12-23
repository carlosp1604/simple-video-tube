import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { GetActorsApplicationResponseDto } from '~/modules/Actors/Application/GetActors/GetActorsApplicationResponseDto'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { FetchFilter } from '~/modules/Shared/Infrastructure/FrontEnd/FetchFilter'
import { ActorFilterOptions } from '~/modules/Actors/Infrastructure/Frontend/ActorFilterOptions'

export class ActorsApiService {
  public async getActors (
    pageNumber: number,
    perPage: number = defaultPerPage,
    order: InfrastructureSortingCriteria,
    orderBy: InfrastructureSortingOptions,
    filters: FetchFilter<ActorFilterOptions>[]
  ): Promise<GetActorsApplicationResponseDto> {
    const params = new URLSearchParams()

    params.append('page', pageNumber.toString())
    params.append('perPage', perPage.toString())
    params.append('orderBy', orderBy)
    params.append('order', order)

    for (const filter of filters) {
      if (filter.value !== null) {
        params.append(filter.type, filter.value)
      }
    }

    return ((await fetch(`/api/actors?${params}`)).json())
  }

  public async addActorView (actorId: string): Promise<Response> {
    return fetch(`/api/actors/${actorId}/actor-views`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
