import { CategoryRepositoryInterface } from '~/modules/Categories/Domain/CategoryRepositoryInterface'
import {
  GetCategoryBySlugApplicationException
} from '~/modules/Categories/Application/GetCategoryBySlug/GetCategoryBySlugApplicationException'
import { CategoryApplicationDtoTranslator } from '~/modules/Categories/Application/CategoryApplicationDtoTranslator'
import {
  GetCategoryBySlugApplicationResponseDto
} from '~/modules/Categories/Application/GetCategoryBySlug/GetCategoryBySlugApplicationResponseDto'

export class GetCategoryBySlug {
  // eslint-disable-next-line no-useless-constructor
  public constructor (readonly categoryRepository: CategoryRepositoryInterface) {}

  public async get (categorySlug: string): Promise<GetCategoryBySlugApplicationResponseDto> {
    const category = await this.categoryRepository.findBySlug(categorySlug)

    if (category === null) {
      throw GetCategoryBySlugApplicationException.categoryNotFound(categorySlug)
    }

    return CategoryApplicationDtoTranslator.fromDomain(category)
  }
}
