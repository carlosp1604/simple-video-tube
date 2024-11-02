import { NextPage } from 'next'
import { CategoryCardComponentDto } from '~/modules/Categories/Infrastructure/Dtos/CategoryCardComponentDto'
import { Categories } from '~/modules/Categories/Infrastructure/Components/Categories/Categories'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import {
  HtmlPageMetaContextResourceType,
  HtmlPageMetaResourceService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaResourceService'
import useTranslation from 'next-translate/useTranslation'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'

export interface CategoriesPageProps {
  categoriesCards: CategoryCardComponentDto[]
  htmlPageMetaContextProps: HtmlPageMetaContextProps
}

export const CategoriesPage: NextPage<CategoriesPageProps> = ({
  categoriesCards,
  htmlPageMetaContextProps,
}) => {
  const { t } = useTranslation('categories')

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaResourceService(
      t('categories_page_title'),
      t('categories_page_description'),
      HtmlPageMetaContextResourceType.ARTICLE,
      htmlPageMetaContextProps.canonicalUrl
    )
  ).getProperties()

  const htmlPageMetaProps = {
    ...htmlPageMetaContextProps,
    resourceProps: htmlPageMetaUrlProps,
  }

  return (
    <>
      <HtmlPageMeta { ...htmlPageMetaProps } />

      <Categories categoryCards={ categoriesCards } />
    </>
  )
}
