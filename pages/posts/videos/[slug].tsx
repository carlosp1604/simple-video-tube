import { container } from '~/awilix.container'
import { GetPostBySlug } from '~/modules/Posts/Application/GetPostBySlug/GetPostBySlug'
import { GetRelatedPosts } from '~/modules/Posts/Application/GetRelatedPosts/GetRelatedPosts'
import { GetServerSideProps } from 'next'
import { PostPage, PostPageProps } from '~/components/pages/PostPage/PostPage'
import { PostComponentDtoTranslator } from '~/modules/Posts/Infrastructure/Translators/PostComponentDtoTranslator'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import {
  HtmlPageMetaContextService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextService'
import { Duration, Settings } from 'luxon'

export const getServerSideProps: GetServerSideProps<PostPageProps> = async (context) => {
  if (!context.query.slug) {
    return {
      notFound: true,
    }
  }

  const { env } = process
  const slug = String(context.query.slug)
  const locale = context.locale ?? 'en'

  Settings.defaultLocale = locale
  Settings.defaultZone = 'Europe/Madrid'

  Settings.defaultLocale = locale
  Settings.defaultZone = 'Europe/Madrid'

  const useCase = container.resolve<GetPostBySlug>('getPostBySlugUseCase')
  const getRelatedPosts = container.resolve<GetRelatedPosts>('getRelatedPostsUseCase')
  const htmlPageMetaContextService = new HtmlPageMetaContextService(context)

  let postWithCount

  try {
    postWithCount = await useCase.get({ slug })
  } catch (exception: unknown) {
    console.error(exception)

    return {
      notFound: true,
    }
  }

  if (postWithCount.post.externalUrl) {
    const pat = /^https?:\/\//i

    if (pat.test(postWithCount.post.externalUrl)) {
      return {
        redirect: {
          destination: postWithCount.post.externalUrl,
          permanent: false,
        },
      }
    }

    return {
      redirect: {
        destination: `/${locale}/${postWithCount.post.externalUrl}`,
        permanent: false,
      },
    }
  }

  if (postWithCount.post.deletedAt) {
    return {
      notFound: true,
    }
  }

  const relatedPosts = await getRelatedPosts.get(postWithCount.post.id)

  let postEmbedUrl = ''
  let baseUrl = ''

  if (!env.BASE_URL) {
    throw Error('Missing env var: BASE_URL. Required to build post page embed URL')
  } else {
    postEmbedUrl = `${env.BASE_URL}/${locale}/posts/videos/embed/${slug}`
    baseUrl = env.BASE_URL
  }

  const applicationPost = PostComponentDtoTranslator.fromApplicationDto(postWithCount.post, locale)

  return {
    props: {
      post: PostComponentDtoTranslator.fromApplicationDto(postWithCount.post, locale),
      relatedPosts: relatedPosts.posts.map((relatedPost) => {
        return PostCardComponentDtoTranslator.fromApplication(relatedPost, locale)
      }),
      parsedDuration: Duration.fromMillis(applicationPost.duration * 1000).toString(),
      postViewsNumber: postWithCount.post.viewsCount,
      postLikes: postWithCount.reactions.like,
      postDislikes: postWithCount.reactions.dislike,
      postCommentsNumber: postWithCount.comments,
      postEmbedUrl,
      baseUrl,
      htmlPageMetaContextProps: htmlPageMetaContextService.getProperties(),
    },
  }
}

export default PostPage
