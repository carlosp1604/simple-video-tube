import { NextPage } from 'next'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import useTranslation from 'next-translate/useTranslation'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import {
  HtmlPageMetaContextResourceType,
  HtmlPageMetaResourceService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaResourceService'
import { Category } from '~/modules/Categories/Infrastructure/Components/Category/Category'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'
import { ProfileHeader } from '~/modules/Shared/Infrastructure/Components/ProfileHeader/ProfileHeader'
import styles from './CategoryPage.module.scss'
import { useRouter } from 'next/router'
import { CategoryPageComponentDto } from '~/modules/Categories/Infrastructure/Dtos/CategoryPageComponentDto'
import { AiOutlineTag } from 'react-icons/ai'
import { NumberFormatter } from '~/modules/Shared/Infrastructure/FrontEnd/NumberFormatter'
import { i18nConfig } from '~/i18n.config'

export interface CategoryPageProps {
  initialPage: number
  initialOrder: PostsPaginationSortingType
  category: CategoryPageComponentDto
  initialPosts: PostCardComponentDto[]
  initialPostsNumber: number
  htmlPageMetaContextProps: HtmlPageMetaContextProps
  baseUrl: string
}

export const CategoryPage: NextPage<CategoryPageProps> = ({
  initialPage,
  initialOrder,
  category,
  initialPosts,
  initialPostsNumber,
  htmlPageMetaContextProps,
  baseUrl,
}) => {
  const { t } = useTranslation('categories')
  const locale = useRouter().locale ?? i18nConfig.defaultLocale

  const structuredData = {
    '@context': 'http://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{
      '@type': 'ListItem',
      position: 1,
      name: category.name,
      item: `${baseUrl}/${locale}/categories/${category.slug}`,
    }],
  }

  let canonicalUrl = `${baseUrl}/categories/${category.slug}`

  if (locale !== 'en') {
    canonicalUrl = `${baseUrl}/${locale}/categories/${category.slug}`
  }

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaResourceService(
      t('category_page_title', { categoryName: category.name }),
      t('category_page_description', { categoryName: category.name }),
      HtmlPageMetaContextResourceType.ARTICLE,
      canonicalUrl
    )
  ).getProperties()

  const htmlPageMetaProps = {
    ...htmlPageMetaContextProps,
    resourceProps: htmlPageMetaUrlProps,
    structuredData: JSON.stringify(structuredData),
  }

  return (
    <div className={ styles.categoryPage__container }>
      <HtmlPageMeta { ...htmlPageMetaProps } />

      <ProfileHeader
        name={ category.name }
        imageAlt={ t('category_image_alt_title', { categoryName: category.name }) }
        imageUrl={ category.imageUrl }
        profileType={ t('category_page_profile_type_title') }
        icon={ <AiOutlineTag /> }
        subtitle={ t('category_page_profile_count_title', {
          categoriesNumber: NumberFormatter.compatFormat(category.viewsNumber, locale),
        }) }
      />

      <Category
        initialPage={ initialPage }
        initialOrder={ initialOrder }
        category={ category }
        initialPosts={ initialPosts }
        initialPostsNumber={ initialPostsNumber }
      />
    </div>
  )
}
