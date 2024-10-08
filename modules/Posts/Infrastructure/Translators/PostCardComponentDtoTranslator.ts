import { PostAnimationDtoTranslator } from './PostAnimationDtoTranslator'
import {
  ActorPostCardComponentDto,
  PostCardComponentDto,
  ProducerPostCardComponentDto
} from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { PostAnimationDto } from '~/modules/Posts/Infrastructure/Dtos/PostAnimationDto'
import {
  PostWithRelationsApplicationDto
} from '~/modules/Posts/Application/Dtos/PostWithRelationsApplicationDto'
import { DateService } from '~/helpers/Infrastructure/DateService'

export class PostCardComponentDtoTranslator {
  public static fromApplication (
    applicationDto: PostWithRelationsApplicationDto,
    locale: string
  ): PostCardComponentDto {
    const animation: PostAnimationDto | null = PostAnimationDtoTranslator.fromApplication(applicationDto.trailerUrl)

    const dateService = new DateService()
    const date = dateService.formatDate(applicationDto.publishedAt, locale)
    const duration = dateService.formatSecondsToHHMMSSFormat(parseInt(String(applicationDto.duration)))

    let producer: ProducerPostCardComponentDto | null = null

    // TODO: Support producer hierarchy
    if (applicationDto.producer !== null) {
      producer = {
        id: applicationDto.producer.id,
        slug: applicationDto.producer.slug,
        name: applicationDto.producer.name,
      }
    }

    let actor: ActorPostCardComponentDto | null = null

    if (applicationDto.actor !== null) {
      actor = {
        id: applicationDto.actor.id,
        slug: applicationDto.actor.slug,
        name: applicationDto.actor.name,
      }
    }

    let titleTranslation = applicationDto.title
    const languageHasTranslations = applicationDto.translations.find((translation) => translation.language === locale)

    if (languageHasTranslations) {
      const fieldTranslation = languageHasTranslations.translations.find((translation) => translation.field === 'title')

      if (fieldTranslation) {
        titleTranslation = fieldTranslation.value
      }
    }

    return {
      id: applicationDto.id,
      animation,
      date,
      producer,
      thumb: applicationDto.thumbnailUrl,
      resolution: applicationDto.resolution,
      title: titleTranslation,
      views: applicationDto.postViews,
      duration,
      slug: applicationDto.slug,
      actor,
      externalLink: applicationDto.externalUrl,
    }
  }
}
