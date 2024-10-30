import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { Category } from '~/modules/Categories/Domain/Category'

export class GetCategoryBySlugApplicationException extends ApplicationException {
  public static categoryNotFoundId = 'get_category_by_slug_category_not_found'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, GetCategoryBySlugApplicationException.prototype)
  }

  public static categoryNotFound (categorySlug: Category['slug']): GetCategoryBySlugApplicationException {
    return new GetCategoryBySlugApplicationException(
      `Category with slug ${categorySlug} was not found`,
      this.categoryNotFoundId
    )
  }
}
