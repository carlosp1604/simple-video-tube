import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import {
  PostReactionApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostReactionApplicationDtoTranslator'
import {
  GetPostUserInteractionApplicationRequestDto
} from '~/modules/Posts/Application/GetPostUserInteraction/GetPostUserInteractionApplicationRequestDto'
import {
  GetPostUserInteractionApplicationResponseDto
} from '~/modules/Posts/Application/GetPostUserInteraction/GetPostUserInteractionApplicationResponseDto'

export class GetPostUserInteraction {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly postRepository: PostRepositoryInterface) {}

  public async get (
    request: GetPostUserInteractionApplicationRequestDto
  ): Promise<GetPostUserInteractionApplicationResponseDto> {
    const postUserInteraction = await this.postRepository.findUserInteraction(request.postId, request.userIp)

    return {
      userReaction: postUserInteraction.reaction
        ? PostReactionApplicationDtoTranslator.fromDomain(postUserInteraction.reaction)
        : null,
    }
  }
}
