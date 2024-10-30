import { MediaProviderComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaProviderComponentDto'
import { MediaProviderApplicationDto } from '~/modules/Posts/Application/Dtos/PostMedia/MediaProviderApplicationDto'

export abstract class MediaProviderComponentDtoTranslator {
  public static fromApplicationDto (applicationDto: MediaProviderApplicationDto): MediaProviderComponentDto {
    return {
      id: applicationDto.id,
      logoUrl: applicationDto.logoUrl,
      name: applicationDto.name,
      advertisingLevel: applicationDto.advertisingLevel,
      delayBetweenDownloads: applicationDto.delayBetweenDownloads,
      downloadSpeed: applicationDto.downloadSpeed,
      freeDownloadsDay: applicationDto.freeDownloadsDay,
      maxResolution: applicationDto.maxResolution,
      refUrl: applicationDto.refUrl,
      multiQuality: applicationDto.multiQuality,
      paymentRequired: applicationDto.paymentRequired,
    }
  }
}
