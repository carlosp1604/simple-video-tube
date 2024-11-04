import { container } from '~/awilix.container'
import { GetPostBySlug } from '~/modules/Posts/Application/GetPostBySlug/GetPostBySlug'
import { GetServerSideProps } from 'next'
import { PostPage, PostPageProps } from '~/components/pages/PostPage/PostPage'
import { PostComponentDtoTranslator } from '~/modules/Posts/Infrastructure/Translators/PostComponentDtoTranslator'
import {
  HtmlPageMetaContextService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextService'
import { i18nConfig } from '~/i18n.config'

export const getServerSideProps: GetServerSideProps<PostPageProps> = async (context) => {
  if (!context.query.slug) {
    return {
      notFound: true,
    }
  }

  const { env } = process
  let indexPage = false

  if (!env.INDEX_WEBSITE) {
    throw Error('Missing env var: INDEX_WEBSITE. Required in the page page')
  } else {
    indexPage = env.INDEX_WEBSITE === 'true'
  }

  const slug = String(context.query.slug)
  const locale = context.locale ?? i18nConfig.defaultLocale

  const useCase = container.resolve<GetPostBySlug>('getPostBySlugUseCase')
  const htmlPageMetaContextService = new HtmlPageMetaContextService(
    context,
    { includeQuery: false, includeLocale: true },
    { index: indexPage, follow: indexPage }
  )

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

  // Experimental: Try yo improve performance
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=50, stale-while-revalidate=10'
  )

  return {
    props: {
      post: PostComponentDtoTranslator.fromApplicationDto(postWithCount.post, locale),
      postViewsNumber: postWithCount.post.viewsCount,
      postLikes: postWithCount.reactions.like,
      postDislikes: postWithCount.reactions.dislike,
      postCommentsNumber: postWithCount.comments,
      htmlPageMetaContextProps: htmlPageMetaContextService.getProperties(),
    },
  }
}

export default PostPage
