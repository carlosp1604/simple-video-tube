import { prisma } from '~/persistence/prisma'
import { CategoryRepositoryInterface } from '~/modules/Categories/Domain/CategoryRepositoryInterface'
import { Category } from '~/modules/Categories/Domain/Category'
import { CategoryModelTranslator } from '~/modules/Categories/Infrastructure/CategoryModelTranslator'
import { TranslationModelTranslator } from '~/modules/Translations/Infrastructure/TranslationModelTranslator'

export class MysqlCategoryRepository implements CategoryRepositoryInterface {
  /**
   * Insert a Category in the persistence layer
   * @param category Category to persist
   */
  public async save (category: Category): Promise<void> {
    const categoryModel = CategoryModelTranslator.toDatabase(category)
    const translations = Array.from(category.translations.values()).flat()
      .map((translation) => { return TranslationModelTranslator.toDatabase(translation) })

    await prisma.category.create({
      data: {
        slug: categoryModel.slug,
        updatedAt: categoryModel.updatedAt,
        deletedAt: categoryModel.deletedAt,
        createdAt: categoryModel.createdAt,
        name: categoryModel.name,
        id: categoryModel.id,
        description: categoryModel.description,
        imageUrl: categoryModel.imageUrl,
        translations: {
          connectOrCreate: translations.map((translation) => {
            return {
              where: {
                translatableId_field_translatableType_language: {
                  language: translation.language,
                  translatableType: translation.translatableType,
                  field: translation.field,
                  translatableId: translation.translatableId,
                },
              },
              create: {
                createdAt: translation.createdAt,
                updatedAt: translation.updatedAt,
                language: translation.language,
                translatableType: translation.translatableType,
                field: translation.field,
                value: translation.value,
              },
            }
          }),
        },
      },
    })
  }

  /**
   * Find a Category given its slug
   * @param categorySlug Category Slug
   * @return Category if found or null
   */
  public async findBySlug (categorySlug: Category['slug']): Promise<Category | null> {
    const category = await prisma.category.findFirst({
      where: {
        slug: categorySlug,
        deletedAt: null,
      },
      include: {
        translations: true,
      },
    })

    if (category === null) {
      return null
    }

    return CategoryModelTranslator.toDomain(category)
  }

  /**
   * Find a Category given its ID
   * @param categoryId Category ID
   * @return Category if found or null
   */
  public async findById (categoryId: Category['id']): Promise<Category | null> {
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        deletedAt: null,
      },
      include: {
        translations: true,
      },
    })

    if (category === null) {
      return null
    }

    return CategoryModelTranslator.toDomain(category)
  }

  /**
   * Get all categories from database
   * @return Array of Categories
   */
  public async getAll (): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        translations: true,
      },
    })

    return categories.map(CategoryModelTranslator.toDomain)
  }

  /**
   * Add a new category view for a category given its ID
   * @param categoryId Category ID
   */
  public async addCategoryView (categoryId: Category['id']): Promise<void> {
    await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        viewsCount: {
          increment: 1,
        },
      },
    })
  }
}
