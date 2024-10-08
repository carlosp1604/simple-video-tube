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
    const tag = await this.categoryRepository.findBySlug(categorySlug)

    if (tag === null) {
      throw GetCategoryBySlugApplicationException.tagNotFound(categorySlug)
    }

    return CategoryApplicationDtoTranslator.fromDomain(tag)
  }
}
