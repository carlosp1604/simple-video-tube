import { DateTime } from 'luxon'

export class MediaProvider {
  public readonly id: string
  public readonly name: string
  public readonly logoUrl: string
  public readonly advertisingLevel: number
  public readonly downloadSpeed: number
  public readonly paymentRequired: boolean
  public readonly freeDownloadsDay: number
  public readonly delayBetweenDownloads: number
  public readonly refUrl: string
  public readonly multiQuality: boolean
  public readonly maxResolution: string
  public readonly createdAt: DateTime
  public readonly updatedAt: DateTime

  public constructor (
    id: string,
    name: string,
    logoUrl: string,
    advertisingLevel: number,
    downloadSpeed: number,
    paymentRequired: boolean,
    freeDownloadsDay: number,
    delayBetweenDownloads: number,
    refUrl: string,
    multiQuality: boolean,
    maxResolution: string,
    createdAt: DateTime,
    updatedAt: DateTime
  ) {
    this.id = id
    this.name = name
    this.logoUrl = logoUrl
    this.advertisingLevel = advertisingLevel
    this.downloadSpeed = downloadSpeed
    this.paymentRequired = paymentRequired
    this.freeDownloadsDay = freeDownloadsDay
    this.delayBetweenDownloads = delayBetweenDownloads
    this.refUrl = refUrl
    this.multiQuality = multiQuality
    this.maxResolution = maxResolution
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}
