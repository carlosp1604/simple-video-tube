import styles from './PostCardGallery.module.scss'
import useTranslation from 'next-translate/useTranslation'
import { PostCard } from '~/modules/Posts/Infrastructure/Components/PostCard/PostCard'
import { nativeAdsData } from '~/nativeAdsData'
import { PostCardSkeleton } from '~/modules/Posts/Infrastructure/Components/PostCard/PostCardSkeleton/PostCardSkeleton'
import { PostCardAdvertising } from '~/modules/Shared/Infrastructure/Components/Advertising/PostCardAdvertising'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { adsPerPage, defaultPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { PaginatedPostCardGalleryHelper } from '~/modules/Posts/Infrastructure/Frontend/PaginatedPostCardGalleryHelper'
import { FC, ReactElement, useEffect, useMemo, useState } from 'react'

interface Props {
  posts: PostCardComponentDto[]
  loading: boolean
  emptyState: ReactElement | null
  showAds: boolean
}

export const PostCardGallery: FC<Partial<Props> & Pick<Props, 'posts'>> = ({
  posts,
  loading = false,
  emptyState = null,
  showAds,
}) => {
  const { t } = useTranslation('advertising')
  const [placesToAddAds, setPlacesToAddAds] = useState<Array<number>>([])

  useEffect(() => {
    if (showAds && postCards.length > 0 && !placesToAddAds.length) {
      let adsToInsert = adsPerPage

      if (postCards.length < 6) {
        adsToInsert = 1
      }

      if (postCards.length >= 6 && postCards.length < 12) {
        adsToInsert = 2
      }

      if (postCards.length >= 12 && postCards.length < 24) {
        adsToInsert = 3
      }

      const positions: Array<number> = []

      Array.from(Array(adsToInsert).keys()).forEach(() => {
        positions.push(PaginatedPostCardGalleryHelper.genRandomValue(1, postCards.length - 1, positions))
      })

      setPlacesToAddAds(positions)
    }
  }, [])

  const skeletonPosts = useMemo(() => {
    const createSkeletonList = (skeletonNumber: number): ReactElement[] => {
      return Array.from(Array(skeletonNumber).keys())
        .map((index) => (
          <PostCardSkeleton
            key={ index }
            loading={ loading }
          />
        ))
    }

    let postsSkeletonNumber

    if (posts.length <= defaultPerPage + adsPerPage) {
      postsSkeletonNumber = (defaultPerPage + adsPerPage) - posts.length
    } else {
      postsSkeletonNumber = posts.length % (defaultPerPage + adsPerPage)
    }

    return createSkeletonList(postsSkeletonNumber)
  }, [posts])

  const postCards = useMemo(() => {
    const postCards = posts.map((post) => {
      return (
        <PostCard
          post={ post }
          key={ post.id }
        />
      )
    })

    if (showAds && postCards.length > 0 && placesToAddAds.length) {
      const firstCardViews = posts[0].views
      const firstCardDate = posts[0].date

      const indexes: Array<number> = []

      for (let i = 0; i < placesToAddAds.length; i++) {
        const adIndex = PaginatedPostCardGalleryHelper.genRandomValue(0, nativeAdsData.length - 1, indexes)

        indexes.push(adIndex)

        postCards.splice(Math.floor(Math.random() * (postCards.length - 1) + 1), 0, (
          <PostCardAdvertising
            key={ nativeAdsData[adIndex].offerUrl }
            offerUrl={ nativeAdsData[adIndex].offerUrl }
            thumb={ PaginatedPostCardGalleryHelper.getRandomElementFromArray(nativeAdsData[adIndex].thumbs) }
            title={ t(nativeAdsData[adIndex].titleKey) }
            adNetworkName={ nativeAdsData[adIndex].adNetworkName }
            views={ firstCardViews }
            date={ firstCardDate }
          />
        ))
      }
    }

    return postCards
  }, [posts, placesToAddAds])

  let content: ReactElement | null = (
    <div className={ `
      ${styles.postCardGallery__container}
      ${loading && posts.length !== 0 ? styles.postCardGallery__container__loading : ''}
    ` }
    >
      { postCards }
      { loading ? skeletonPosts : null }
    </div>
  )

  if (posts.length === 0 && !loading) {
    content = emptyState
  }

  return content
}
