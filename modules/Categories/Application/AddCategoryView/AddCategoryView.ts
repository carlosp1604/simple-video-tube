import { CategoryRepositoryInterface } from '~/modules/Categories/Domain/CategoryRepositoryInterface'
import {
  AddCategoryViewApplicationException
} from '~/modules/Categories/Application/AddCategoryView/AddCategoryViewApplicationException'
import {
  AddCategoryViewApplicationRequest
} from '~/modules/Categories/Application/AddCategoryView/AddCategoryViewApplicationRequest'
import { Category } from '~/modules/Categories/Domain/Category'

export class AddCategoryView {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly categoryRepository: CategoryRepositoryInterface) {}

  public async add (request: AddCategoryViewApplicationRequest): Promise<void> {
    const category = await this.getCategory(request.categoryId)

    try {
      await this.categoryRepository.addCategoryView(category.id)
    } catch (exception: unknown) {
      console.error(exception)
      throw AddCategoryViewApplicationException.cannotAddView(category.id)
    }
  }

  private async getCategory (categoryId: AddCategoryViewApplicationRequest['categoryId']): Promise<Category> {
    const category = await this.categoryRepository.findById(categoryId)

    if (category === null) {
      throw AddCategoryViewApplicationException.categoryNotFound(categoryId)
    }

    return category as Category
  }
}
