import { CategoryApplicationDto } from '~/modules/Categories/Application/CategoryApplicationDto'
import { Category } from '~/modules/Categories/Domain/Category'
import {
  CategoryTranslationTranslatorDto
} from '~/modules/Categories/Application/CategoryTranslationTranslatorDto'

// NOTE: We are not testing this due to this class does not have logic to be tested
export class CategoryApplicationDtoTranslator {
  public static fromDomain (category: Category): CategoryApplicationDto {
    return {
      id: category.id,
      slug: category.slug,
      name: category.name,
      imageUrl: category.imageUrl,
      description: category.description,
      translations: CategoryTranslationTranslatorDto.fromDomain(category),
      createdAt: category.createdAt.toISO(),
    }
  }
}
