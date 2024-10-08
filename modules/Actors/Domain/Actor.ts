import { DateTime } from 'luxon'

export class Actor {
  public readonly id: string
  public readonly slug: string
  public readonly name: string
  public readonly imageUrl: string | null
  public readonly viewsCount: number
  public readonly createdAt: DateTime
  public updatedAt: DateTime
  public deletedAt: DateTime | null

  public constructor (
    id: string,
    slug: string,
    name: string,
    imageUrl: string | null,
    viewsCount: number,
    createdAt: DateTime,
    updatedAt: DateTime,
    deletedAt: DateTime | null
  ) {
    this.id = id
    this.slug = slug
    this.name = name
    this.imageUrl = imageUrl
    this.viewsCount = viewsCount
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
  }
}
