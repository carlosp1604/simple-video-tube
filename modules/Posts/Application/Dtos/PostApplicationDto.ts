import { MetaApplicationDto } from './MetaApplicationDto'
import { TagApplicationDto } from './TagApplicationDto'
import { ActorApplicationDto } from '~/modules/Actors/Application/ActorApplicationDto'
import { ProducerApplicationDto } from '~/modules/Producers/Application/ProducerApplicationDto'
import { ModelTranslationsApplicationDto } from '~/modules/Translations/Application/ModelTranslationsApplicationDto'

export interface PostApplicationDto {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly slug: string
  readonly publishedAt: string
  readonly producer: ProducerApplicationDto | null
  readonly meta: MetaApplicationDto[]
  readonly actors: ActorApplicationDto[]
  readonly tags: TagApplicationDto[]
  readonly translations: ModelTranslationsApplicationDto[]
  readonly createdAt: string
}
