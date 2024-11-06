import { CategoryApplicationDto } from '~/modules/Categories/Application/CategoryApplicationDto'
import { ActorApplicationDto } from '~/modules/Actors/Application/ActorApplicationDto'
import { ProducerApplicationDto } from '~/modules/Producers/Application/ProducerApplicationDto'
import { ModelTranslationsApplicationDto } from '~/modules/Translations/Application/ModelTranslationsApplicationDto'
import { PostMediaApplicationDto } from '~/modules/Posts/Application/Dtos/PostMedia/PostMediaApplicationDto'

export interface PostApplicationDto {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly slug: string
  readonly duration: number
  readonly parsedISO8601Duration: string
  readonly trailerUrl: string | null
  readonly thumbnailUrl: string
  readonly externalUrl: string | null
  readonly resolution: number
  readonly viewsCount: number
  readonly publishedAt: string
  readonly releaseDate: string | null
  readonly producer: ProducerApplicationDto | null
  readonly actor: ActorApplicationDto | null
  readonly actors: ActorApplicationDto[]
  readonly categories: CategoryApplicationDto[]
  readonly translations: ModelTranslationsApplicationDto[]
  readonly postMedia: PostMediaApplicationDto[]
  readonly createdAt: string
  readonly deletedAt: string | null
}
