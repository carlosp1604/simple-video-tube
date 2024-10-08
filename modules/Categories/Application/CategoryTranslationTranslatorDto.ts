import { ModelTranslationsApplicationDto } from '~/modules/Translations/Application/ModelTranslationsApplicationDto'
import {
  TranslationApplicationDtoTranslator
} from '~/modules/Translations/Application/TranslationApplicationDtoTranslator'
import { Category } from '~/modules/Categories/Domain/Category'

export class CategoryTranslationTranslatorDto {
  public static fromDomain (category: Category): ModelTranslationsApplicationDto[] {
    const postTranslations: ModelTranslationsApplicationDto[] = []

    category.translations.forEach((value, key) => {
      const languageTranslations = value.map((translation) => {
        return TranslationApplicationDtoTranslator.fromDomain(translation)
      })

      const categoryLanguageTranslation: ModelTranslationsApplicationDto = {
        language: key,
        translations: languageTranslations,
      }

      postTranslations.push(categoryLanguageTranslation)
    })

    return postTranslations
  }
}
