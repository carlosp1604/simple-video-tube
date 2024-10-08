import { DateTime } from 'luxon'
import { MediaUrl } from '~/modules/Posts/Domain/PostMedia/MediaUrl'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { PostMediaDomainException } from '~/modules/Posts/Domain/PostMedia/PostMediaDomainException'

export enum PostMediaType {
  IMAGE = 'Image',
  VIDEO = 'Video',
  EMBED = 'Embed'
}

export class PostMedia {
  public readonly id: string
  public readonly type: PostMediaType
  public readonly title: string
  public readonly postId: string
  public readonly thumbnailUrl: string | null
  public readonly removalReason: string | null
  public readonly createdAt: DateTime
  public readonly updatedAt: DateTime
  public readonly deletedAt: DateTime | null

  /** Relationships **/
  private readonly _mediaUrls: Collection<MediaUrl, MediaUrl['url'] & string>

  public constructor (
    id: string,
    type: string,
    title: string,
    postId: string,
    thumbnailUrl: string | null,
    removalReason: string | null,
    createdAt: DateTime,
    updatedAt: DateTime,
    deletedAt: DateTime | null,
    mediaUrls: Collection<MediaUrl, MediaUrl['url'] & string> = Collection.notLoaded()
  ) {
    this.id = id
    this.type = PostMedia.validatePostMediaType(id, type)
    this.title = title
    this.postId = postId
    this.thumbnailUrl = thumbnailUrl
    this.removalReason = removalReason
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
    this._mediaUrls = mediaUrls
  }

  get mediaUrls (): Array<MediaUrl> {
    return this._mediaUrls.values
  }

  get removedMediaUrls (): Array<MediaUrl> {
    return this._mediaUrls.removedValues
  }

  private static validatePostMediaType (id: string, value: string): PostMediaType {
    const values: string [] = Object.values(PostMediaType)

    if (!values.includes(value)) {
      throw PostMediaDomainException.invalidPostMediaType(id, value)
    }

    return value as PostMediaType
  }
}
