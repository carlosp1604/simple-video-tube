import { GetStaticProps } from 'next'
import { container } from '~/awilix.container'
import { Settings } from 'luxon'
import { CategoriesPageProps, TagsPage } from '~/components/pages/TagsPage/TagsPage'
import { GetAllCategories } from '~/modules/Categories/Application/GetAllCategories/GetAllCategories'
import {
  TagCardComponentDtoTranslator
} from '~/modules/Categories/Infrastructure/Translators/TagCardComponentDtoTranslator'
import {
  HtmlPageMetaContextService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextService'

export const getStaticProps: GetStaticProps<CategoriesPageProps> = async (context) => {
  const locale = context.locale ?? 'en'

  Settings.defaultLocale = locale
  Settings.defaultZone = 'Europe/Madrid'

  const { env } = process
  let baseUrl = ''

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
  })

  const props: CategoriesPageProps = {
    categoriesCards: [],
    baseUrl,
    htmlPageMetaContextProps: htmlPageMetaContextService.getProperties(),
  }

  const getCategories = container.resolve<GetAllCategories>('getAllCategoriesUseCase')

  try {
    const categories = await getCategories.get()

    props.categoriesCards =
      categories.map((tagApplicationDto) => TagCardComponentDtoTranslator.fromApplicationDto(tagApplicationDto, locale))

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

export default TagsPage
