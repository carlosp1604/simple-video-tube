import { VideoComponentDto } from './VideoComponentDto'
import { PostMediaComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/PostMediaComponentDto'

export interface PostComponentDtoActorDto {
  readonly id: string
  readonly slug: string
  readonly imageUrl: string | null
  readonly name: string
}

export interface PostComponentDtoCategoryDto {
  readonly id: string
  readonly name: string
  readonly slug: string
}

export interface PostComponentDtoProducerDto {
  readonly id: string
  readonly imageUrl: string | null
  readonly name: string
  readonly slug: string
}

export interface PostComponentDto {
  readonly id: string
  readonly slug: string
  readonly title: string
  readonly thumb: string
  readonly resolution: number
  readonly duration: number
  readonly parsedISO8601Duration: string
  readonly video: VideoComponentDto
  readonly formattedPublishedAt: string
  readonly formattedReleaseDate: string | null
  readonly publishedAt: string
  readonly description: string
  readonly actors: PostComponentDtoActorDto[]
  readonly categories: PostComponentDtoCategoryDto[]
  readonly producer: PostComponentDtoProducerDto | null
  readonly actor: PostComponentDtoActorDto | null
  readonly postMediaVideoType: PostMediaComponentDto[]
  readonly postMediaEmbedType: PostMediaComponentDto[]
  readonly postMediaImageType: PostMediaComponentDto[]
}
