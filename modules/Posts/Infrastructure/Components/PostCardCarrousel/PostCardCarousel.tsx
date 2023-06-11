import { CSSProperties, FC, useState } from 'react'
import styles from './PostCardCarousel.module.scss'
import { Carousel } from '~/components/Carousel/Carousel'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { PostCard } from '~/modules/Posts/Infrastructure/Components/PostCard/PostCard'

interface Props {
  posts: PostCardComponentDto[]
}

export const PostCardCarousel: FC<Props> = ({ posts }) => {
  const [playerId, setPlayerId] = useState<string>('')

  return (
    <Carousel onEndReached={ undefined }>
        { posts.map((post) => {
          return (
            <PostCard
              setPlayerId={ setPlayerId }
              playerId={ playerId }
              post={ post }
              key={ post.id }
            />
          )
        }) }
    </Carousel>

  )
}