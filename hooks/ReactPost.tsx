import { useCallback } from 'react'
import useTranslation from 'next-translate/useTranslation'
import toast from 'react-hot-toast'
import { APIException } from '~/modules/Shared/Infrastructure/FrontEnd/ApiException'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import { ReactionType } from '~/modules/Reactions/Infrastructure/ReactionType'
import {
  ReactionComponentDtoTranslator
} from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDtoTranslator'
import { PostsApiService } from '~/modules/Posts/Infrastructure/Frontend/PostsApiService'
import { useRouter } from 'next/router'

export interface ReactPostInterface {
  reactPost: (postId: string, type: ReactionType) => Promise<ReactionComponentDto | null>
  removeReaction: (postId: string) => Promise<boolean>
}

export function useReactPost (namespace: string): ReactPostInterface {
  const { t } = useTranslation(namespace)
  const locale = useRouter().locale ?? 'en'

  const reactPost = useCallback(async (postId: string, type: ReactionType): Promise<ReactionComponentDto | null> => {
    try {
      const reaction = await new PostsApiService().createPostReaction(postId, type)
      const reactionComponentDto = ReactionComponentDtoTranslator.fromApplicationDto(reaction)

      toast.success(t('post_reaction_added_correctly_message'))

      return reactionComponentDto
    } catch (exception: unknown) {
      if (!(exception instanceof APIException)) {
        toast.error(t('api_exceptions:something_went_wrong_error_message'))

        console.error(exception)

        return null
      }

      toast.error(t(`api_exceptions:${exception.translationKey}`))

      return null
    }
  }, [locale])

  const removeReaction = useCallback(async (postId: string): Promise<boolean> => {
    try {
      await new PostsApiService().deletePostReaction(postId)

      toast.success(t('post_reaction_deleted_correctly_message'))

      return true
    } catch (exception: unknown) {
      if (!(exception instanceof APIException)) {
        toast.error(t('api_exceptions:something_went_wrong_error_message'))

        console.error(exception)

        return false
      }

      toast.error(t(`api_exceptions:${exception.translationKey}`))

      return false
    }
  }, [locale])

  return { reactPost, removeReaction }
}
