import { PostApplicationDto } from '~/modules/Posts/Application/Dtos/PostApplicationDto'
import { VideoComponentDto, VideoQualityDto } from '~/modules/Posts/Infrastructure/Dtos/VideoComponentDto'

export class VideoComponentDtoTranslator {
  public static fromApplicationDto (applicationDto: PostApplicationDto): VideoComponentDto {
    const thumb = applicationDto.thumbnailUrl

    const qualities: VideoQualityDto[] = []

    return {
      poster: thumb,
      qualities,
      download: null,
    }
  }
}
