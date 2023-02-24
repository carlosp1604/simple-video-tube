import { GetServerSideProps } from 'next'
import { ActorPage, ActorPageProps } from '../../../Components/pages/ActorPage/ActorPage'
import { GetActor } from '../../../modules/Actors/Application/GetActor'
import { ActorPageComponentDtoTranslator } from '../../../modules/Actors/Infrastructure/ActorPageComponentDtoTranslator'
import { bindings as ActorBindings } from '../../../modules/Actors/Infrastructure/Bindings'
import { GetPosts } from '../../../modules/Posts/Application/GetPosts'
import { bindings as PostBindings } from '../../../modules/Posts/Infrastructure/Bindings'
import { PostCardComponentDtoTranslator } from '../../../modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import { defaultPostsPerPage } from '../../../modules/Shared/Infrastructure/Pagination'

export const getServerSideProps: GetServerSideProps<ActorPageProps> = async (context) => {
  let actorId = context.query.actorId

  if (!actorId) {
    return {
      notFound: true
    }
  }

  const getPosts = PostBindings.get<GetPosts>('GetPosts')
  const getActor = ActorBindings.get<GetActor>('GetActor')  

  try {
    const actor = await getActor.get(actorId.toString())
    const posts = await getPosts.get({
      filters: [
        { type: 'actorId', value: actorId.toString() }
      ],
      page: 1,
      postsPerPage: defaultPostsPerPage,
      sortCriteria: 'desc',
      sortOption: 'date'
    })

    return {
      props: {
        actor: ActorPageComponentDtoTranslator.fromApplicationDto(actor),
        posts: posts.posts.map((post) => {
          return PostCardComponentDtoTranslator.fromApplication(post.post, post.postReactions)
        }),
        postsNumber: posts.postsNumber
      }
    }
  }
  catch (exception: unknown) {
    console.error(exception)

    return {
      notFound: true
    }
  }
}

export default ActorPage