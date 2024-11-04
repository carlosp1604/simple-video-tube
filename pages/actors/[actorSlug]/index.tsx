import { GetServerSideProps } from 'next'
import { GetActorBySlug } from '~/modules/Actors/Application/GetActorBySlug/GetActorBySlug'
import { ActorPageComponentDtoTranslator } from '~/modules/Actors/Infrastructure/ActorPageComponentDtoTranslator'
import { container } from '~/awilix.container'
import { GetPosts } from '~/modules/Posts/Application/GetPosts/GetPosts'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { ActorPage, ActorPageProps } from '~/components/pages/ActorPage/ActorPage'
import {
  HtmlPageMetaContextService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextService'
import { FilterOptions } from '~/modules/Shared/Infrastructure/FrontEnd/FilterOptions'
import { i18nConfig } from '~/i18n.config'

export const getServerSideProps: GetServerSideProps<ActorPageProps> = async (context) => {
  const actorSlug = context.query.actorSlug
  const locale = context.locale ?? i18nConfig.defaultLocale

  if (!actorSlug) {
    return {
      notFound: true,
    }
  }

  if (Object.entries(context.query).length > 1) {
    return {
      redirect: {
        destination: `/${locale}/actors/${actorSlug}`,
        permanent: false,
      },
    }
  }

  const { env } = process
  let indexPage = false
  let baseUrl = ''

  if (!env.INDEX_WEBSITE) {
    throw Error('Missing env var: INDEX_WEBSITE. Required in the actor page')
  } else {
    indexPage = env.INDEX_WEBSITE === 'true'
  }

  if (!env.BASE_URL) {
    throw Error('Missing env var: BASE_URL. Required in the actor page')
  } else {
    baseUrl = env.BASE_URL
  }

  const htmlPageMetaContextService = new HtmlPageMetaContextService(
    context,
    { includeQuery: false, includeLocale: true },
    { index: indexPage, follow: indexPage }
  )

  const props: ActorPageProps = {
    actor: {
      slug: '',
      name: '',
      imageUrl: '',
      id: '',
      viewsCount: 0,
    },
    initialPosts: [],
    initialPostsNumber: 0,
    htmlPageMetaContextProps: htmlPageMetaContextService.getProperties(),
    baseUrl,
  }

  const getActor = container.resolve<GetActorBySlug>('getActorBySlugUseCase')
  const getPosts = container.resolve<GetPosts>('getPostsUseCase')

  try {
    const actor = await getActor.get(actorSlug.toString())

    props.actor = ActorPageComponentDtoTranslator.fromApplicationDto(actor)
  } catch (exception: unknown) {
    console.error(exception)

    return {
      notFound: true,
    }
  }

  try {
    const actorPosts = await getPosts.get({
      page: 1,
      filters: [{ type: FilterOptions.ACTOR_SLUG, value: String(actorSlug) }],
      sortCriteria: InfrastructureSortingCriteria.DESC,
      sortOption: InfrastructureSortingOptions.DATE,
      postsPerPage: defaultPerPage,
    })

    props.initialPosts = actorPosts.posts.map((post) => {
      return PostCardComponentDtoTranslator.fromApplication(post, locale)
    })
    props.initialPostsNumber = actorPosts.postsNumber
  } catch (exception: unknown) {
    console.error(exception)
  }

  // Experimental: Try yo improve performance
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, stale-while-revalidate=300'
  )

  return {
    props,
  }
}

export default ActorPage
