import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { Category } from '~/modules/Categories/Domain/Category'

export class GetCategoryBySlugApplicationException extends ApplicationException {
  public static tagNotFoundId = 'get_tag_by_slug_tag_not_found'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, GetCategoryBySlugApplicationException.prototype)
  }

  public static tagNotFound (tagSlug: Category['slug']): GetCategoryBySlugApplicationException {
    return new GetCategoryBySlugApplicationException(
      `Tag with slug ${tagSlug} was not found`,
      this.tagNotFoundId
    )
  }
}
