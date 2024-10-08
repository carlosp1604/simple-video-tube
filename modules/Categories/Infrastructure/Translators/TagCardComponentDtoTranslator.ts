import { CategoryApplicationDto } from '~/modules/Categories/Application/CategoryApplicationDto'
import { TagCardComponentDto } from '~/modules/Categories/Infrastructure/Dtos/TagCardComponentDto'

export class TagCardComponentDtoTranslator {
  public static fromApplicationDto (applicationDto: CategoryApplicationDto, locale: string): TagCardComponentDto {
    const languageHasTranslations =
      applicationDto.translations.find((translation) => translation.language === locale)

    let nameTranslation = applicationDto.name

    if (languageHasTranslations) {
      const nameFieldTranslation =
          languageHasTranslations.translations.find((translation) => translation.field === 'name')

      if (nameFieldTranslation) {
        nameTranslation = nameFieldTranslation.value
      }
    }

    return {
      id: applicationDto.id,
      name: nameTranslation,
      slug: applicationDto.slug,
      imageUrl: applicationDto.imageUrl,
    }
  }
}
