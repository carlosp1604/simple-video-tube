export interface MediaProviderApplicationDto {
  readonly id: string
  readonly name: string
  readonly logoUrl: string
  readonly advertisingLevel: number
  readonly downloadSpeed: number
  readonly paymentRequired: boolean
  readonly freeDownloadsDay: number
  readonly delayBetweenDownloads: number
  readonly refUrl: string
  readonly multiQuality: boolean
  readonly maxResolution: string
}
