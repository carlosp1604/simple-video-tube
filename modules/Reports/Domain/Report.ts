import { DateTime } from 'luxon'

export class Report {
  public readonly id: string
  public readonly postId: string
  public readonly type: string
  public readonly userIp: string
  public readonly userName: string
  public readonly userEmail: string
  public readonly content: string
  public readonly createdAt: DateTime
  public readonly updatedAt: DateTime

  public constructor (
    id: string,
    postId: string,
    type: string,
    userIp: string,
    userName: string,
    userEmail: string,
    content: string,
    createdAt: DateTime,
    updatedAt: DateTime
  ) {
    this.id = id
    this.postId = postId
    this.type = type
    this.userIp = userIp
    this.userName = userName
    this.userEmail = userEmail
    this.content = content
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}
