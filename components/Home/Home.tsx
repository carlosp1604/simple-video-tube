import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import styles from './Home.module.scss'
import { EmptyState } from '~/components/EmptyState/EmptyState'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import { FC, ReactElement, useState } from 'react'
import { ElementLinkMode } from '~/modules/Shared/Infrastructure/FrontEnd/ElementLinkMode'
import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import {
  PaginatedPostCardGallery
} from '~/modules/Shared/Infrastructure/Components/PaginatedPostCardGallery/PaginatedPostCardGallery'
import { NumberFormatter } from '~/modules/Shared/Infrastructure/FrontEnd/NumberFormatter'
import { FilterOptions } from '~/modules/Shared/Infrastructure/FrontEnd/FilterOptions'
import { i18nConfig } from '~/i18n.config'

export interface Props {
  page: number
  order: PostsPaginationSortingType
  initialPosts: PostCardComponentDto[]
  initialPostsNumber: number
}

export const Home: FC<Props> = ({
  initialPostsNumber,
  initialPosts,
  page,
  order,
}) => {
  const [postsNumber, setPostsNumber] = useState<number>(initialPostsNumber)
  const { t } = useTranslation('home_page')
  const router = useRouter()
  const locale = router.locale ?? i18nConfig.defaultLocale

  const [currentPage, setCurrentPage] = useState<number>(page)

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

  const onFetchPosts = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const emptyState: ReactElement = (
    <EmptyState
      title={ t('post_gallery_empty_state_title') }
      subtitle={ t('post_gallery_empty_state_subtitle') }
    />
  )

  let headerTitle = t('all_producers_title')

  if (currentPage > 1) {
    headerTitle = t('all_producers_title_with_page_number', { pageNumber: currentPage })
  }

  return (
    <div className={ styles.home__container }>
      <PaginatedPostCardGallery
        headerTag={ 'h1' }
        key={ locale }
        title={ headerTitle }
        subtitle={ t('post_gallery_subtitle', { postsNumber: NumberFormatter.compatFormat(postsNumber, locale) }) }
        page={ page }
        order={ order }
        initialPosts={ initialPosts }
        initialPostsNumber={ initialPostsNumber }
        filters={ [] }
        filtersToParse={ [FilterOptions.PRODUCER_SLUG] }
        linkMode={ linkMode }
        sortingOptions={ sortingOptions }
        defaultSortingOption={ PaginationSortingType.LATEST }
        onPostsFetched={ (postsNumber, _posts) => setPostsNumber(postsNumber) }
        emptyState={ emptyState }
        onPaginationStateChanges={ (page, _order, _filters) => onFetchPosts(page) }
      />
    </div>
  )
}
