import { VideoComponentDtoTranslator } from './VideoComponentDtoTranslator'
import { PostApplicationDto } from '~/modules/Posts/Application/Dtos/PostApplicationDto'
import {
  PostComponentDto,
  PostComponentDtoActorDto, PostComponentDtoProducerDto,
  PostComponentDtoCategoryDto
} from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'
import { DateService } from '~/helpers/Infrastructure/DateService'
import { PostMediaComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/PostMediaComponentDto'
import {
  PostMediaComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostMedia/PostMediaComponentDtoTranslator'

export class PostComponentDtoTranslator {
  public static fromApplicationDto (applicationDto: PostApplicationDto, locale: string): PostComponentDto {
    const actors: PostComponentDtoActorDto[] = applicationDto.actors.map((actor) => ({
      name: actor.name,
      slug: actor.slug,
      id: actor.id,
      imageUrl: actor.imageUrl,
    }))

    const categories: PostComponentDtoCategoryDto[] = applicationDto.categories.map((categories) => {
      const languageHasTranslations =
        categories.translations.find((translation) => translation.language === locale)

      let nameTranslation = categories.name

      if (languageHasTranslations) {
        const nameFieldTranslation =
          languageHasTranslations.translations.find((translation) => translation.field === 'name')

        if (nameFieldTranslation) {
          nameTranslation = nameFieldTranslation.value
        }
      }

      return {
        name: nameTranslation,
        id: categories.id,
        slug: categories.slug,
      }
    })

    let producer: PostComponentDtoProducerDto | null = null

    if (applicationDto.producer !== null) {
      producer = {
        name: applicationDto.producer.name,
        slug: applicationDto.producer.slug,
        id: applicationDto.producer.id,
        imageUrl: applicationDto.producer.imageUrl,
      }
    }

    let actor: PostComponentDtoActorDto | null = null

    if (applicationDto.actor !== null) {
      actor = {
        slug: applicationDto.actor.slug,
        name: applicationDto.actor.name,
        id: applicationDto.actor.id,
        imageUrl: applicationDto.actor.imageUrl,
      }
    }

    const video = VideoComponentDtoTranslator.fromApplicationDto(applicationDto)

    const formattedPublishedAt = (new DateService()).formatDate(applicationDto.publishedAt, locale)

    const languageHasTranslations = applicationDto.translations.find((translation) => translation.language === locale)

    let titleTranslation = applicationDto.title
    let descriptionTranslation = applicationDto.description

    if (languageHasTranslations) {
      const titleFieldTranslation =
        languageHasTranslations.translations.find((translation) => translation.field === 'title')
      const descriptionFieldTranslation =
        languageHasTranslations.translations.find((translation) => translation.field === 'description')

      if (titleFieldTranslation) {
        titleTranslation = titleFieldTranslation.value
      }

      if (descriptionFieldTranslation) {
        descriptionTranslation = descriptionFieldTranslation.value
      }
    }

    const postMediaVideoType: PostMediaComponentDto[] = applicationDto.postMedia
      .filter((postMedia) => postMedia.type === 'Video')
      .map((postMedia) => {
        return PostMediaComponentDtoTranslator.fromApplicationDto(postMedia)
      })

    const postMediaEmbedType: PostMediaComponentDto[] = applicationDto.postMedia
      .filter((postMedia) => postMedia.type === 'Embed')
      .map((postMedia) => {
        return PostMediaComponentDtoTranslator.fromApplicationDto(postMedia)
      })

    const postMediaImageType: PostMediaComponentDto[] = applicationDto.postMedia
      .filter((postMedia) => postMedia.type === 'Image')
      .map((postMedia) => {
        return PostMediaComponentDtoTranslator.fromApplicationDto(postMedia)
      })

    return {
      id: applicationDto.id,
      slug: applicationDto.slug,
      actors,
      video,
      categories,
      producer,
      description: descriptionTranslation,
      formattedPublishedAt,
      publishedAt: applicationDto.publishedAt,
      title: titleTranslation,
      thumb: applicationDto.thumbnailUrl,
      resolution: applicationDto.resolution,
      duration: applicationDto.duration,
      parsedISO8601Duration: applicationDto.parsedISO8601Duration,
      actor,
      postMediaVideoType,
      postMediaImageType,
      postMediaEmbedType,
    }
  }
}
