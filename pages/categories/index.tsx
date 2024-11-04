import { GetStaticProps } from 'next'
import { container } from '~/awilix.container'
import { CategoriesPageProps, CategoriesPage } from '~/components/pages/CategoriesPage/CategoriesPage'
import { GetAllCategories } from '~/modules/Categories/Application/GetAllCategories/GetAllCategories'
import {
  CategoryCardComponentDtoTranslator
} from '~/modules/Categories/Infrastructure/Translators/CategoryCardComponentDtoTranslator'
import {
  HtmlPageMetaContextService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextService'
import { i18nConfig } from '~/i18n.config'

export const getStaticProps: GetStaticProps<CategoriesPageProps> = async (context) => {
  const locale = context.locale ?? i18nConfig.defaultLocale

  const { env } = process
  let indexPage = false
  let baseUrl = ''

  if (!env.INDEX_WEBSITE) {
    throw Error('Missing env var: INDEX_WEBSITE. Required in the categories page')
  } else {
    indexPage = env.INDEX_WEBSITE === 'true'
  }

  if (!env.BASE_URL) {
    throw Error('Missing env var: BASE_URL. Required in the categories page')
  } else {
    baseUrl = env.BASE_URL
  }

  let url = `${baseUrl}/categories`

  if (locale !== 'en') {
    url = `${baseUrl}/${locale}/categories`
  }

  const htmlPageMetaContextService = new HtmlPageMetaContextService({
    ...context,
    locale,
    pathname: 'categories',
    req: {
      url,
    },
  }, { includeQuery: false, includeLocale: true }, { follow: indexPage, index: indexPage })

  const props: CategoriesPageProps = {
    categoriesCards: [],
    htmlPageMetaContextProps: htmlPageMetaContextService.getProperties(),
  }

  const getCategories = container.resolve<GetAllCategories>('getAllCategoriesUseCase')

  try {
    const categories = await getCategories.get()

    props.categoriesCards = categories.map(
      (categoryApplicationDto) =>
        CategoryCardComponentDtoTranslator.fromApplicationDto(categoryApplicationDto, locale)
    )

    return {
      props,
    }
  } catch (exception: unknown) {
    console.error(exception)

    return {
      notFound: true,
    }
  }
}

export default CategoriesPage
