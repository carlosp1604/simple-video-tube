import { NextPage } from 'next'
import { TagCardComponentDto } from '~/modules/Categories/Infrastructure/Dtos/TagCardComponentDto'
import { Tags } from '~/modules/Categories/Infrastructure/Components/Tags/Tags'
import { useRouter } from 'next/router'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import {
  HtmlPageMetaContextResourceType,
  HtmlPageMetaResourceService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaResourceService'
import useTranslation from 'next-translate/useTranslation'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'
import { MobileBanner } from '~/modules/Shared/Infrastructure/Components/Banner/MobileBanner'

export interface CategoriesPageProps {
  categoriesCards: TagCardComponentDto[]
  htmlPageMetaContextProps: HtmlPageMetaContextProps
  baseUrl: string
}

export const TagsPage: NextPage<CategoriesPageProps> = ({ categoriesCards, htmlPageMetaContextProps, baseUrl }) => {
  const locale = useRouter().locale ?? 'en'
  const { t } = useTranslation('tags')

  let canonicalUrl = `${baseUrl}/categories`

  if (locale !== 'en') {
    canonicalUrl = `${baseUrl}/${locale}/categories`
  }

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaResourceService(
      t('tags_page_title'),
      t('tags_page_description'),
      HtmlPageMetaContextResourceType.ARTICLE,
      canonicalUrl
    )
  ).getProperties()

  const htmlPageMetaProps = {
    ...htmlPageMetaContextProps,
    resourceProps: htmlPageMetaUrlProps,
  }

  return (
    <>
      <HtmlPageMeta { ...htmlPageMetaProps } />

      <MobileBanner />

      <Tags tagCards={ categoriesCards } />
    </>
  )
}
