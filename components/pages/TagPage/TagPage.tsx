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
import { Tag } from '~/modules/Categories/Infrastructure/Components/Tag/Tag'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'
import { ProfileHeader } from '~/modules/Shared/Infrastructure/Components/ProfileHeader/ProfileHeader'
import { useAvatarColor } from '~/hooks/AvatarColor'
import styles from './TagPage.module.scss'
import { useRouter } from 'next/router'
import { TagPageComponentDto } from '~/modules/Categories/Infrastructure/Dtos/TagPageComponentDto'

export interface CategoryPageProps {
  initialPage: number
  initialOrder: PostsPaginationSortingType
  category: TagPageComponentDto
  initialPosts: PostCardComponentDto[]
  initialPostsNumber: number
  htmlPageMetaContextProps: HtmlPageMetaContextProps
  baseUrl: string
}

export const TagPage: NextPage<CategoryPageProps> = ({
  initialPage,
  initialOrder,
  category,
  initialPosts,
  initialPostsNumber,
  htmlPageMetaContextProps,
  baseUrl,
}) => {
  const { t } = useTranslation('tags')
  const locale = useRouter().locale ?? 'en'
  const getRandomColor = useAvatarColor()

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
      t('tag_page_title', { tagName: category.name }),
      t('tag_page_description', { tagName: category.name }),
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
    <div className={ styles.tagPage__container }>
      <HtmlPageMeta { ...htmlPageMetaProps } />

      { /* TODO: Add imageAlt when categories have imageUrl */ }
      <ProfileHeader
        name={ category.name }
        imageAlt={ '' }
        imageUrl={ category.imageUrl }
        rounded={ false }
      />

      <Tag
        initialPage={ initialPage }
        initialOrder={ initialOrder }
        tag={ category }
        initialPosts={ initialPosts }
        initialPostsNumber={ initialPostsNumber }
      />
    </div>
  )
}
