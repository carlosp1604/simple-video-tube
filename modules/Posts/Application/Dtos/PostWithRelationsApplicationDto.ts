import { ProducerApplicationDto } from '~/modules/Producers/Application/ProducerApplicationDto'
import { ModelTranslationsApplicationDto } from '~/modules/Translations/Application/ModelTranslationsApplicationDto'
import { ActorApplicationDto } from '~/modules/Actors/Application/ActorApplicationDto'

export interface PostWithRelationsApplicationDto {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly slug: string
  readonly duration: number
  readonly resolution: number
  readonly trailerUrl: string | null
  readonly thumbnailUrl: string
  readonly externalUrl: string | null
  readonly publishedAt: string
  readonly producer: ProducerApplicationDto | null
  readonly actor: ActorApplicationDto | null
  readonly createdAt: string
  readonly updatedAt: string
  readonly translations: ModelTranslationsApplicationDto[]
  readonly postViews: number
}
