import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { Category } from '~/modules/Categories/Domain/Category'

export class AddCategoryViewApplicationException extends ApplicationException {
  public static cannotAddCategoryViewId = 'add_category_view_cannot_add_category_view'
  public static categoryNotFoundId = 'add_category_view_category_not_found'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, AddCategoryViewApplicationException.prototype)
  }

  public static categoryNotFound (categoryId: Category['id']): AddCategoryViewApplicationException {
    return new AddCategoryViewApplicationException(
      `Category with ID ${categoryId} was not found`,
      this.categoryNotFoundId
    )
  }

  public static cannotAddView (categoryId: Category['id']): AddCategoryViewApplicationException {
    return new AddCategoryViewApplicationException(
      `Cannot add a new view for category with ID ${categoryId}`,
      this.cannotAddCategoryViewId
    )
  }
}
