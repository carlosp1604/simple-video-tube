import { FC } from 'react'
import { Carousel, KeyedComponent } from '~/components/Carousel/Carousel'
import { PostCardSkeleton } from '~/modules/Posts/Infrastructure/Components/PostCard/PostCardSkeleton/PostCardSkeleton'
import { nanoid } from 'nanoid'

interface Props {
  postCardsNumber: number
  loading: boolean
}

export const PostCardCarouselSkeleton: FC<Partial<Props> & Pick<Props, 'postCardsNumber'>> = ({
  postCardsNumber,
  loading = false,
}) => {
  const uuidGenerator = () => {
    return nanoid()
  }

  const postCardsSkeleton: KeyedComponent[] = []

  for (let i = 0; i < postCardsNumber; i++) {
    postCardsSkeleton.push({
      key: uuidGenerator(),
      component: <PostCardSkeleton showProducerImage={ true } loading={ loading }/>,
    }
    )
  }

  return (
    <Carousel
      onEndReached={ undefined }
      itemsAutoWidth={ false }
    >
      { postCardsSkeleton }
    </Carousel>
  )
}
