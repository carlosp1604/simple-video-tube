import { ModelTranslationsApplicationDto } from '~/modules/Translations/Application/ModelTranslationsApplicationDto'

export interface CategoryApplicationDto {
  readonly id: string
  readonly slug: string
  readonly name: string
  readonly description: string | null
  readonly imageUrl: string | null
  readonly viewsCount: number
  readonly translations: ModelTranslationsApplicationDto[]
  readonly createdAt: string
}
