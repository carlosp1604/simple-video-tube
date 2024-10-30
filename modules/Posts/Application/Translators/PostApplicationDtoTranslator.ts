import { CategoryApplicationDtoTranslator } from '~/modules/Categories/Application/CategoryApplicationDtoTranslator'
import { Post } from '~/modules/Posts/Domain/Post'
import { PostApplicationDto } from '~/modules/Posts/Application/Dtos/PostApplicationDto'
import { ActorApplicationDtoTranslator } from '~/modules/Actors/Application/ActorApplicationDtoTranslator'
import { ProducerApplicationDtoTranslator } from '~/modules/Producers/Application/ProducerApplicationDtoTranslator'
import { PostTranslationsDtoTranslator } from '~/modules/Posts/Application/Translators/PostTranslationsDtoTranslator'
import {
  PostMediaApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostMedia/PostMediaApplicationDtoTranslator'
import { Duration } from 'luxon'

// NOTE: We are not testing this due to this class does not have logic to be tested
export class PostApplicationDtoTranslator {
  public static fromDomain (post: Post): PostApplicationDto {
    let deletedAt: string | null = null

    if (post.deletedAt) {
      deletedAt = post.deletedAt.toISO()
    }

    return {
      id: post.id,
      createdAt: post.createdAt.toISO(),
      actors: post.actors.map((actor) => {
        return ActorApplicationDtoTranslator.fromDomain(actor)
      }),
      parsedISO8601Duration: Duration.fromMillis(post.duration * 1000).toString(),
      resolution: post.resolution,
      description: post.description,
      duration: post.duration,
      trailerUrl: post.trailerUrl,
      thumbnailUrl: post.thumbnailUrl,
      externalUrl: post.externalUrl,
      viewsCount: post.viewsCount,
      publishedAt: post.publishedAt?.toISO() ?? '',
      categories: post.categories.map((category) => {
        return CategoryApplicationDtoTranslator.fromDomain(category)
      }),
      title: post.title,
      producer: post.producer !== null
        ? ProducerApplicationDtoTranslator.fromDomain(post.producer)
        : null,
      slug: post.slug,
      translations: PostTranslationsDtoTranslator.fromDomain(post),
      actor: post.actor !== null
        ? ActorApplicationDtoTranslator.fromDomain(post.actor)
        : null,
      postMedia: post.postMedia.map((postMedia) => {
        return PostMediaApplicationDtoTranslator.fromDomain(postMedia)
      }),
      deletedAt,
    }
  }
}
