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

  const slug = String(context.query.slug)
  const locale = context.locale ?? i18nConfig.defaultLocale

  const useCase = container.resolve<GetPostBySlug>('getPostBySlugUseCase')
  const htmlPageMetaContextService = new HtmlPageMetaContextService(
    context,
    { includeQuery: false, includeLocale: true },
    { index: true, follow: true }
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
