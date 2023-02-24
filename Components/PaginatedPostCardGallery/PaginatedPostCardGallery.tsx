import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react'
import { GetPostsApplicationResponse } from '../../modules/Posts/Application/Dtos/GetPostsApplicationDto'
import { PostCardList } from '../../modules/Posts/Infrastructure/Components/PostCardList'
import { PostCardComponentDto } from '../../modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { PostCardComponentDtoTranslator } from '../../modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import { FetchPostsFilter } from '../../modules/Shared/Infrastructure/InfrastructureFilter'
import { calculatePagesNumber, defaultPostsPerPage } from '../../modules/Shared/Infrastructure/Pagination'
import { PaginationBar } from '../PaginationBar/PaginationBar'
import styles from './PaginatedPostCardGallery.module.scss'

const useFirstRender = () => {
  const firstRender = useRef(true)

  useEffect(() => {
    firstRender.current = false
  }, [])

  return firstRender.current
}

interface Props {
  posts: PostCardComponentDto[]
  postsNumber: number,
  setPostsNumber: Dispatch<SetStateAction<number>>
  filters: FetchPostsFilter[]
  fetchEndpoint: string
}

export const PaginatedPostCardGallery: FC<Props> = ({
  posts,
  postsNumber,
  setPostsNumber,
  filters,
  fetchEndpoint
}) => {
  const [pagesNumber, setPagesNumber] = useState<number>(calculatePagesNumber(postsNumber, defaultPostsPerPage))
  const [pageNumber, setPageNumber] = useState(1)
  const [currentPosts, setCurrentPosts] = useState<PostCardComponentDto[]>(posts)
  const [playerId, setPlayerId] = useState<string>('')
  const firstRender = useFirstRender()

  const buildSearchParams = (): URLSearchParams => {
    let params = new URLSearchParams()
    params.append('page', pageNumber.toString())
    params.append('perPage', defaultPostsPerPage.toString())
    
    for (const filter of filters) {
      if (filter.value !== null) {
        params.append(filter.type, filter.value)
      }
    }

    return params
  }

  const fetchPosts = async (): Promise<GetPostsApplicationResponse> => {
    const params = buildSearchParams().toString()
    return ((await fetch(`${fetchEndpoint}?${params}`)).json())
  }

  const updatePosts = async () => {
    const posts = await fetchPosts()

    setCurrentPosts(posts.posts.map((post) => {
      return PostCardComponentDtoTranslator.fromApplication(post.post, post.postReactions)
    }))
    setPostsNumber(posts.postsNumber)
    setPagesNumber(calculatePagesNumber(posts.postsNumber, defaultPostsPerPage))
  }

  useEffect(() => {
    if (pageNumber === 1 && !firstRender) {
      updatePosts()
    }

    setPageNumber(1)
  }, [filters])

  useEffect(() => {
    if (!firstRender) {
      updatePosts()
    } 
  }, [pageNumber])

  return (
    <div className={styles.paginatedPostCardGallery__container}>
      <PostCardList 
        posts={currentPosts}
        playerId={playerId}
        setPlayerId={setPlayerId}
      />

      <PaginationBar
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        pagesNumber={pagesNumber}
        scrollToTopWhenPageChanges={ true }
      />
    </div>
  )
}