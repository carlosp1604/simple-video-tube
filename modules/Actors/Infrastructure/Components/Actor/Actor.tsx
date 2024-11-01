import { FC, useEffect, useState } from 'react'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import { EmptyState } from '~/components/EmptyState/EmptyState'
import {
  PaginatedPostCardGallery
} from '~/modules/Shared/Infrastructure/Components/PaginatedPostCardGallery/PaginatedPostCardGallery'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import { ActorsApiService } from '~/modules/Actors/Infrastructure/Frontend/ActorsApiService'
import { FilterOptions } from '~/modules/Shared/Infrastructure/FrontEnd/FilterOptions'
import { i18nConfig } from '~/i18n.config'

export interface Props {
  actorName: string
  actorId: string
  actorSlug: string
  actorViews: number
  initialPosts: PostCardComponentDto[]
  initialPostsNumber: number
}

export const Actor: FC<Props> = ({
  actorName,
  actorId,
  actorSlug,
  initialPosts,
  initialPostsNumber,
}) => {
  const [postsNumber, setPostsNumber] = useState<number>(initialPostsNumber)

  const router = useRouter()
  const locale = router.locale ?? i18nConfig.defaultLocale

  const { t } = useTranslation('actors')

  useEffect(() => {
    (new ActorsApiService()).addActorView(actorId)
      .then()
      .catch((exception) => console.error(exception))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sortingOptions: PostsPaginationSortingType[] = [
    PaginationSortingType.LATEST,
    PaginationSortingType.OLDEST,
    PaginationSortingType.MOST_VIEWED,
  ]

  const emptyState = (
    <EmptyState
      title={ t('actor_posts_empty_state_title') }
      subtitle={ t('actor_posts_empty_state_subtitle', { actorName }) }
    />
  )

  return (
    <PaginatedPostCardGallery
      key={ locale }
      headerTag={ 'h1' }
      initialPosts={ initialPosts }
      initialPostsNumber={ initialPostsNumber }
      title={ 'actors:actor_posts_gallery_title' }
      subtitle={ t('actor_posts_gallery_posts_quantity', { postsNumber }) }
      term={ { title: 'actorName', value: actorName } }
      page={ 1 }
      order={ PaginationSortingType.LATEST }
      filters={ [{ type: FilterOptions.ACTOR_SLUG, value: actorSlug }] }
      filtersToParse={ [FilterOptions.ACTOR_SLUG] }
      sortingOptions={ sortingOptions }
      defaultSortingOption={ PaginationSortingType.LATEST }
      onPostsFetched={ (postsNumber, _posts) => setPostsNumber(postsNumber) }
      emptyState={ emptyState }
    />
  )
}
