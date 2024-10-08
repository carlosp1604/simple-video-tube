import { MediaProvider as PrismaMediaProviderModel } from '@prisma/client'
import { DateTime } from 'luxon'
import { MediaProvider } from '~/modules/Posts/Domain/PostMedia/MediaProvider'

export class MediaProviderModelTranslator {
  public static toDomain (prismaMediaProviderModel: PrismaMediaProviderModel) {
    return new MediaProvider(
      prismaMediaProviderModel.id,
      prismaMediaProviderModel.name,
      prismaMediaProviderModel.logoUrl,
      prismaMediaProviderModel.advertisingLevel,
      prismaMediaProviderModel.downloadSpeed,
      prismaMediaProviderModel.paymentRequired,
      prismaMediaProviderModel.freeDownloadsDay,
      prismaMediaProviderModel.delayBetweenDownloads,
      prismaMediaProviderModel.refUrl,
      prismaMediaProviderModel.multiQuality,
      prismaMediaProviderModel.maxResolution,
      DateTime.fromJSDate(prismaMediaProviderModel.createdAt),
      DateTime.fromJSDate(prismaMediaProviderModel.updatedAt)
    )
  }
}
