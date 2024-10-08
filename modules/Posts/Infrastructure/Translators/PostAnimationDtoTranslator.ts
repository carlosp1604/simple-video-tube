import { PostAnimationDto } from '~/modules/Posts/Infrastructure/Dtos/PostAnimationDto'

export class PostAnimationDtoTranslator {
  public static fromApplication (trailerUrl: string | null): PostAnimationDto | null {
    if (trailerUrl === null) {
      return null
    }

    const animationType = trailerUrl
      .split('.')
      .filter(Boolean)
      .slice(1)
      .join('.')

    return {
      value: trailerUrl,
      type: animationType,
    }
  }
}
