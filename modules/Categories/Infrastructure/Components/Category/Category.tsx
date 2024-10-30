import { FC, useEffect, useState } from 'react'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { EmptyState } from '~/components/EmptyState/EmptyState'
import { useRouter } from 'next/router'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import useTranslation from 'next-translate/useTranslation'
import { ElementLinkMode } from '~/modules/Shared/Infrastructure/FrontEnd/ElementLinkMode'
import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import {
  PaginatedPostCardGallery
} from '~/modules/Shared/Infrastructure/Components/PaginatedPostCardGallery/PaginatedPostCardGallery'
import { NumberFormatter } from '~/modules/Shared/Infrastructure/FrontEnd/NumberFormatter'
import { FilterOptions } from '~/modules/Shared/Infrastructure/FrontEnd/FilterOptions'
import { CategoryPageComponentDto } from '~/modules/Categories/Infrastructure/Dtos/CategoryPageComponentDto'
import { CategoriesApiService } from '~/modules/Categories/Infrastructure/Frontend/CategoriesApiService'
import { i18nConfig } from '~/i18n.config'

export interface Props {
  initialPage: number
  initialOrder: PostsPaginationSortingType
  category: CategoryPageComponentDto
  initialPosts: PostCardComponentDto[]
  initialPostsNumber: number
}

export const Category: FC<Props> = ({
  initialPage,
  initialOrder,
  category,
  initialPosts,
  initialPostsNumber,
}) => {
  const [postsNumber, setPostsNumber] = useState<number>(initialPostsNumber)

  const router = useRouter()
  const locale = router.locale ?? i18nConfig.defaultLocale

  const { t } = useTranslation('categories')

  useEffect(() => {
    (new CategoriesApiService()).addCategoryView(category.id)
      .then()
      .catch((exception) => console.error(exception))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sortingOptions: PostsPaginationSortingType[] = [
    PaginationSortingType.LATEST,
    PaginationSortingType.OLDEST,
    PaginationSortingType.MOST_VIEWED,
  ]

  const linkMode: ElementLinkMode = {
    replace: false,
    shallowNavigation: true,
    scrollOnClick: true,
  }

  const emptyState = (
    <EmptyState
      title={ t('category_posts_empty_state_title') }
      subtitle={ t('category_posts_empty_state_subtitle', { categoryName: category.name }) }
    />
  )

  return (
    <PaginatedPostCardGallery
      key={ locale }
      title={ 'categories:category_posts_gallery_title' }
      subtitle={ t('category_posts_gallery_posts_quantity',
        { postsNumber: NumberFormatter.compatFormat(postsNumber, locale) }) }
      term={ { title: 'categoryName', value: category.name } }
      headerTag={ 'h2' }
      page={ initialPage }
      order={ initialOrder }
      initialPosts={ initialPosts }
      initialPostsNumber={ initialPostsNumber }
      filters={ [{ type: FilterOptions.CATEGORY_SLUG, value: category.slug }] }
      filtersToParse={ [FilterOptions.CATEGORY_SLUG] }
      linkMode={ linkMode }
      sortingOptions={ sortingOptions }
      defaultSortingOption={ PaginationSortingType.LATEST }
      onPostsFetched={ (postsNumber, _posts) => setPostsNumber(postsNumber) }
      emptyState={ emptyState }
      onPaginationStateChanges={ undefined }
    />
  )
}
