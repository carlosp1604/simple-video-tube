import { FC, ReactElement } from 'react'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import styles from './PostCardGallery.module.scss'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { PostCardSkeleton } from '~/modules/Posts/Infrastructure/Components/PostCard/PostCardSkeleton/PostCardSkeleton'
import { Banner } from '~/modules/Shared/Infrastructure/Components/Banner/Banner'
import { DesktopBanner } from '~/modules/Shared/Infrastructure/Components/ExoclickBanner/DesktopBanner'
import { PostCard } from '~/modules/Posts/Infrastructure/Components/PostCard/PostCard'

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
  showAds = false,
}) => {
  let postsSkeletonNumber

  if (posts.length <= defaultPerPage) {
    postsSkeletonNumber = defaultPerPage - posts.length
  } else {
    postsSkeletonNumber = posts.length % defaultPerPage
  }

  const createSkeletonList = (skeletonNumber: number): ReactElement[] => {
    return Array.from(Array(skeletonNumber).keys())
      .map((index) => (
        <PostCardSkeleton
          key={ index }
          loading={ loading }
        />
      ))
  }

  const skeletonPosts = createSkeletonList(postsSkeletonNumber)

  const postCards = posts.map((post) => {
    return (
      <PostCard
        post={ post }
        key={ post.id }
      />
    )
  })

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

  // Code depends on defaultPerPage
  if (showAds) {
    let firstPostList : ReactElement[]
    let secondPostList: ReactElement[] = []
    let thirdPostList: ReactElement[] = []
    let firstSkeletonList: ReactElement[] = []
    let secondSkeletonList: ReactElement[] = []
    let thirdSkeletonList: ReactElement[] = []

    if (postCards.length < 12) {
      firstPostList = postCards
      firstSkeletonList = createSkeletonList(12 - postCards.length)
    } else {
      firstPostList = postCards.slice(0, 12)

      if (postCards.length < 24) {
        secondPostList = postCards.slice(12)
        secondSkeletonList = createSkeletonList(24 - postCards.length)
      } else {
        secondPostList = postCards.slice(12, 24)
        thirdPostList = postCards.slice(24)

        if (postCards.length < defaultPerPage) {
          thirdSkeletonList = createSkeletonList(defaultPerPage - postCards.length)
        }
      }
    }

    let exoClickBanner: ReactElement | null = null

    if (secondPostList.length > 0) {
      exoClickBanner = (<DesktopBanner />)
    }

    content = (
      <>
        <div className={ `
          ${styles.postCardGallery__container}
          ${loading && posts.length !== 0 ? styles.postCardGallery__container__loading : ''}
        ` }
        >
          { firstPostList }
          { loading ? firstSkeletonList : null }
        </div>

        <Banner/>

        <div className={ `
          ${styles.postCardGallery__container}
          ${loading && posts.length !== 0 ? styles.postCardGallery__container__loading : ''}
        ` }
        >
          { secondPostList }
          { loading ? secondSkeletonList : null }
        </div>
        { exoClickBanner }
        <div className={ `
          ${styles.postCardGallery__container}
          ${loading && posts.length !== 0 ? styles.postCardGallery__container__loading : ''}
        ` }
        >
          { thirdPostList }
          { loading ? thirdSkeletonList : null }
        </div>
      </>)
  }

  if (posts.length === 0 && !loading) {
    content = emptyState
  }

  return content
}
