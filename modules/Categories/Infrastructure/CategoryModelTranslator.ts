import { DateTime } from 'luxon'
import { Category as PrismaCategoryModel } from '@prisma/client'
import { Category } from '~/modules/Categories/Domain/Category'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { Translation } from '~/modules/Translations/Domain/Translation'
import { CategoryWithTranslations } from '~/modules/Posts/Infrastructure/PrismaModels/CategoryModel'
import { TranslationModelTranslator } from '~/modules/Translations/Infrastructure/TranslationModelTranslator'

export class CategoryModelTranslator {
  public static toDomain (
    prismaCategoryModel: PrismaCategoryModel
  ) {
    let deletedAt: DateTime | null = null

    if (prismaCategoryModel.deletedAt !== null) {
      deletedAt = DateTime.fromJSDate(prismaCategoryModel.deletedAt)
    }

    const translationsCollection: Collection<Translation, string> = Collection.initializeCollection()

    const postTagWithTranslations = prismaCategoryModel as CategoryWithTranslations

    postTagWithTranslations.translations.forEach((translation) => {
      const domainTranslation = TranslationModelTranslator.toDomain(translation)

      translationsCollection.addItem(
        domainTranslation, translation.language + translation.field
      )
    })

    return new Category(
      prismaCategoryModel.id,
      prismaCategoryModel.slug,
      prismaCategoryModel.name,
      prismaCategoryModel.description,
      prismaCategoryModel.imageUrl,
      Number.parseInt(String(prismaCategoryModel.viewsCount)),
      DateTime.fromJSDate(prismaCategoryModel.createdAt),
      DateTime.fromJSDate(prismaCategoryModel.updatedAt),
      deletedAt,
      translationsCollection
    )
  }

  public static toDatabase (category: Category): PrismaCategoryModel {
    return {
      id: category.id,
      slug: category.slug,
      imageUrl: category.imageUrl,
      name: category.name,
      viewsCount: BigInt(category.viewsCount),
      description: category.description,
      createdAt: category.createdAt.toJSDate(),
      deletedAt: category.deletedAt?.toJSDate() ?? null,
      updatedAt: category.updatedAt.toJSDate(),
    }
  }
}
