import { NextPage } from 'next'
import { ReactElement, useState } from 'react'
import styles from './ActorPage.module.scss'
import { ActorPageComponentDto } from '~/modules/Actors/Infrastructure/ActorPageComponentDto'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { defaultPerPage, PaginationHelper } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { PostCardGallery } from '~/modules/Posts/Infrastructure/Components/PostCardGallery/PostCardGallery'
import { EmptyState } from '~/components/EmptyState/EmptyState'
import { useRouter } from 'next/router'
import { BsDot } from 'react-icons/bs'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useGetPosts } from '~/hooks/GetPosts'
import { PostsPaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationSortingType'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import { PostFilterOptions } from '~/modules/Shared/Infrastructure/PostFilterOptions'
import { ProfileHeader } from '~/modules/Shared/Infrastructure/Components/ProfileHeader/ProfileHeader'
import { useTranslation } from 'next-i18next'

export interface ActorPageProps {
  actor: ActorPageComponentDto
  initialPosts: PostCardComponentDto[]
  initialPostsNumber: number
}

export const ActorPage: NextPage<ActorPageProps> = ({ actor, initialPosts, initialPostsNumber }) => {
  const [page, setPage] = useState<number>(1)
  const [posts, setPosts] = useState<PostCardComponentDto[]>(initialPosts)
  const [postsNumber, setPostsNumber] = useState<number>(initialPostsNumber)

  const { loading, getPosts } = useGetPosts()
  const router = useRouter()
  const locale = router.locale ?? 'en'

  const { t } = useTranslation('actor_page')

  const updatePosts = async (page:number) => {
    try {
      const newPosts = await getPosts(
        page,
        PostsPaginationSortingType.LATEST,
        [{ type: PostFilterOptions.ACTOR_SLUG, value: actor.slug }]
      )

      if (newPosts) {
        if (page === 1) {
          setPosts(newPosts.posts.map((post) => {
            return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale ?? 'en')
          }))
        } else {
          setPosts([
            ...posts,
            ...newPosts.posts.map((post) => {
              return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale ?? 'en')
            }),
          ])
        }

        setPostsNumber(newPosts.postsNumber)
      }
    } catch (exception: unknown) {
      console.error(exception)
    }
  }
  const onEndGalleryReach = async () => {
    const newPage = page + 1

    setPage(newPage)
    await updatePosts(newPage)
  }

  let content: ReactElement

  if (initialPostsNumber > 0 && !loading) {
    content = (
      <InfiniteScroll
        next={ onEndGalleryReach }
        hasMore={ page < PaginationHelper.calculatePagesNumber(initialPostsNumber, defaultPerPage) }
        loader={ null }
        dataLength={ posts.length }
      >
      <PostCardGallery
        posts={ posts }
        postCardOptions={ [{ type: 'savePost' }, { type: 'react' }] }
        loading={ loading }
      />
      </InfiniteScroll>
    )
  } else {
    content = (
      <EmptyState
        title={ t('actor_posts_empty_state_title') }
        subtitle={ t('actor_posts_empty_state_subtitle', { actorName: actor.name }) }
      />
    )
  }

  return (
    <div className={ styles.actorPage__container }>
      <ProfileHeader
        name={ actor.name }
        imageAlt={ t('actor_image_alt_title', { actorName: actor.name }) }
        imageUrl={ actor.imageUrl }
      />

      <h2 className={ styles.actorPage__actorPostsHeader }>
        { t('actor_posts_gallery_title', { actorName: actor.name }) }
        <BsDot className={ styles.actorPage__actorPostsHeaderSeparatorIcon }/>
        <small className={ styles.actorPage__actorPostsQuantity }>
          { t('actor_posts_gallery_posts_quantity', { postsNumber }) }
        </small>
      </h2>

      { content }
    </div>
  )
}
