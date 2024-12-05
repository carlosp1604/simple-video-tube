import { GetServerSideProps } from 'next'
import { container } from '~/awilix.container'
import { getServerSideSitemapLegacy } from 'next-sitemap'
import { GetAllCategories } from '~/modules/Categories/Application/GetAllCategories/GetAllCategories'
import { i18nConfig } from '~/i18n.config'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const getCategories = container.resolve<GetAllCategories>('getAllCategoriesUseCase')

  const { env } = process
  let baseUrl = ''

  if (!env.BASE_URL) {
    throw Error('Missing env var: BASE_URL. Required in the categories sitemap page')
  } else {
    baseUrl = env.BASE_URL
  }

  const categories = await getCategories.get()

  if (categories.length === 0) {
    return {
      notFound: true,
    }
  }

  const fields = categories.map((category) => ({
    loc: `${baseUrl}/categories/${category.slug}`,
    // TODO: Change this for updatedAt field
    lastmod: category.createdAt,
    alternateRefs: i18nConfig.locales.map((locale) => (
      {
        href: `${baseUrl}/${locale}/categories/${category.slug}`,
        hreflang: locale,
      }
    )),
  }))

  context.res.setHeader(
    'Cache-Control',
    'no-store'
  )

  return getServerSideSitemapLegacy(context, fields)
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function CategoriesSitemapPage () {}
