import { useCallback } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { APIException } from '~/modules/Shared/Infrastructure/FrontEnd/ApiException'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import { ReactionType } from '~/modules/Reactions/Infrastructure/ReactionType'
import {
  ReactionComponentDtoTranslator
} from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDtoTranslator'
import { PostsApiService } from '~/modules/Posts/Infrastructure/Frontend/PostsApiService'
import { useRouter } from 'next/router'
import { useToast } from '~/components/AppToast/ToastContext'

export interface ReactPostInterface {
  reactPost: (postId: string, type: ReactionType) => Promise<ReactionComponentDto | null>
  removeReaction: (postId: string) => Promise<boolean>
}

export function useReactPost (namespace: string): ReactPostInterface {
  const { t } = useTranslation(namespace)
  const { error, success } = useToast()
  const locale = useRouter().locale ?? 'en'

  const reactPost = useCallback(async (postId: string, type: ReactionType): Promise<ReactionComponentDto | null> => {
    try {
      const reaction = await new PostsApiService().createPostReaction(postId, type)
      const reactionComponentDto = ReactionComponentDtoTranslator.fromApplicationDto(reaction)

      success(t('post_reaction_added_correctly_message'))

      return reactionComponentDto
    } catch (exception: unknown) {
      if (!(exception instanceof APIException)) {
        error(t('api_exceptions:something_went_wrong_error_message'))

        console.error(exception)

        return null
      }

      error(t(`api_exceptions:${exception.translationKey}`))

      return null
    }
  }, [locale])

  const removeReaction = useCallback(async (postId: string): Promise<boolean> => {
    try {
      await new PostsApiService().deletePostReaction(postId)

      success(t('post_reaction_deleted_correctly_message'))

      return true
    } catch (exception: unknown) {
      if (!(exception instanceof APIException)) {
        error(t('api_exceptions:something_went_wrong_error_message'))

        console.error(exception)

        return false
      }

      error(t(`api_exceptions:${exception.translationKey}`))

      return false
    }
  }, [locale])

  return { reactPost, removeReaction }
}
