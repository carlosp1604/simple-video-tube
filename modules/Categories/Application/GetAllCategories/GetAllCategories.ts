import { CategoryRepositoryInterface } from '~/modules/Categories/Domain/CategoryRepositoryInterface'
import { CategoryApplicationDto } from '~/modules/Categories/Application/CategoryApplicationDto'
import { CategoryApplicationDtoTranslator } from '~/modules/Categories/Application/CategoryApplicationDtoTranslator'

export class GetAllCategories {
  // eslint-disable-next-line no-useless-constructor
  public constructor (private categoryRepository: CategoryRepositoryInterface) {}

  public async get (): Promise<CategoryApplicationDto[]> {
    const categories = await this.categoryRepository.getAll()

    return categories.map(CategoryApplicationDtoTranslator.fromDomain)
  }
}
