import * as fs from 'fs'
import { randomUUID } from 'crypto'
import { DateTime } from 'luxon'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { Translation } from '~/modules/Translations/Domain/Translation'
import { MysqlCategoryRepository } from '~/modules/Categories/Infrastructure/MysqlCategoryRepository'
import { Category } from '~/modules/Categories/Domain/Category'

const categoryRepository = new MysqlCategoryRepository()

const findOrCreateCategory = async (category: any): Promise<void> => {
  console.log(`  - Finding category with slug: ${category.slug}`)

  const categoryExists = await categoryRepository.findBySlug(category.slug)

  if (categoryExists) {
    console.log(`\t- Category with slug: ${category.slug} already exists. Skipping`)

    return
  }

  console.log(`\t- Building Category with slug: ${category.slug}`)

  const nowDate = DateTime.now()
  const categoryUuid = randomUUID()

  const translationsCollection :Collection<Translation, string> = Collection.initializeCollection()

  console.log(`\t  - Building translations for Category with slug: ${category.slug}`)

  for (const language in category.translations) {
    for (const field in category.translations[language]) {
      const newTranslation = buildTranslation(
        field,
        language,
        category.translations[language][field],
        categoryUuid,
        'Category'
      )

      translationsCollection.addItem(newTranslation, newTranslation.language + newTranslation.field)
    }
  }

  console.log('\t  - Translations built')

  const newCategory = new Category(
    randomUUID(),
    category.slug,
    category.name,
    category.description ?? null,
    category.image ?? null,
    0,
    nowDate,
    nowDate,
    null,
    translationsCollection
  )

  try {
    await categoryRepository.save(newCategory)

    console.log(`\t- Category with slug: ${newCategory.slug} saved`)
  } catch (exception: unknown) {
    console.error(`\t- Cannot save Category with slug: ${newCategory.slug}`)
    console.error(exception)
  }
}

const buildTranslation = (
  field: string,
  language: string,
  value: string,
  translatableId: string,
  translatableType: string
): Translation => {
  const nowDate = DateTime.now()

  return new Translation(
    translatableId,
    translatableType,
    field,
    value,
    language,
    nowDate,
    nowDate
  )
}

async function run () {
  const categories = fs.readFileSync('data/categories-to-import.json', 'utf-8')
  const categoriesToImport = JSON.parse(categories)

  console.log(`- Processing [${categoriesToImport.length}] categories`)

  let index = 1

  for (const category of categoriesToImport) {
    await findOrCreateCategory(category)
    console.log(`  - Category with slug: ${category.slug} [${index}/${categoriesToImport.length}] processed\n`)
    index++
  }

  process.exit()
}

run()
