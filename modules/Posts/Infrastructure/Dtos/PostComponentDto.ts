import { VideoComponentDto } from './VideoComponentDto'

export interface PostComponentDtoActorDto {
  readonly id: string
  readonly imageUrl: string | null
  readonly name: string
}

export interface PostComponentDtoTagDto {
  readonly id: string
  readonly name: string
}

export interface PostComponentDtoProducerDto {
  readonly id: string
  readonly imageUrl: string | null
  readonly name: string
}

export interface PostComponentDto {
  readonly id: string
  readonly title: string
  readonly video: VideoComponentDto
  readonly date: string
  readonly views: number
  readonly reactions: number
  readonly comments: number
  readonly description: string
  readonly actors: PostComponentDtoActorDto[]
  readonly tags: PostComponentDtoTagDto[]
  readonly producer: PostComponentDtoProducerDto | null
}
