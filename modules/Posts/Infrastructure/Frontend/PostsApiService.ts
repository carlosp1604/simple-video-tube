import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { FetchFilter } from '~/modules/Shared/Infrastructure/FrontEnd/FetchFilter'
import { ReactionType } from '~/modules/Reactions/Infrastructure/ReactionType'
import { APIException } from '~/modules/Shared/Infrastructure/FrontEnd/ApiException'
import {
  POST_REACTION_NOT_FOUND,
  POST_REACTION_POST_NOT_FOUND
} from '~/modules/Posts/Infrastructure/Api/PostApiExceptionCodes'
import { ModelReactionApplicationDto } from '~/modules/Reactions/Application/ModelReactionApplicationDto'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { PostFilterOptions } from '~/modules/Posts/Infrastructure/Frontend/PostFilterOptions'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import {
  ReactionComponentDtoTranslator
} from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDtoTranslator'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import { GetPostsApplicationResponse } from '~/modules/Posts/Application/Dtos/GetPostsApplicationDto'
import { i18nConfig } from '~/i18n.config'

interface GetPostsResponse {
  posts: PostCardComponentDto[]
  postsNumber: number
}

export class PostsApiService {
  public async getPosts (
    pageNumber: number,
    perPage: number = defaultPerPage,
    order: InfrastructureSortingCriteria,
    orderBy: InfrastructureSortingOptions,
    filters: FetchFilter<PostFilterOptions>[],
    locale: string
  ): Promise<GetPostsResponse> {
    const params = new URLSearchParams()

    params.append('page', pageNumber.toString())
    params.append('perPage', perPage.toString())
    params.append('orderBy', orderBy)
    params.append('order', order)

    for (const filter of filters) {
      if (filter.value !== null) {
        params.append(filter.type, filter.value)
      }
    }

    const response = await fetch(`/api/posts?${params}`)

    const jsonResponse = await response.json()

    if (response.ok) {
      return {
        posts: (jsonResponse as GetPostsApplicationResponse).posts.map((post) => {
          return PostCardComponentDtoTranslator.fromApplication(post, locale ?? i18nConfig.defaultLocale)
        }),
        postsNumber: (jsonResponse as GetPostsApplicationResponse).postsNumber,
      }
    }

    throw new APIException('server_error_error_message', jsonResponse.status, jsonResponse.code)
  }

  public async getPostsFromPartner (baseUrl: string): Promise<Response> {
    const response = await fetch(`${baseUrl}/api/posts?page=1&perPage=20&orderBy=date&order=desc`)

    if (response.ok) {
      return response
    }

    const jsonResponse = await response.json()

    throw new APIException('server_error_error_message', jsonResponse.status, jsonResponse.code)
  }

  public async addPostView (postId: string): Promise<Response> {
    return fetch(`/api/posts/${postId}/post-views`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  public async createPostReaction (postId: string, reactionType: ReactionType): Promise<ReactionComponentDto> {
    const response = await fetch(`/api/posts/${postId}/reactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reactionType,
      }),
    })

    const jsonResponse = await response.json()

    if (response.ok) {
      return ReactionComponentDtoTranslator.fromApplicationDto(jsonResponse as ModelReactionApplicationDto)
    }

    switch (response.status) {
      case 400:
        throw new APIException(
          'bad_request_error_message',
          response.status,
          jsonResponse.code
        )

      case 404:
        throw new APIException(
          'post_not_found_error_message',
          response.status,
          jsonResponse.code
        )

      case 409:
        throw new APIException(
          'user_already_reacted_to_post_error_message',
          response.status,
          jsonResponse.code
        )

      default:
        throw new APIException(
          'server_error_error_message',
          response.status,
          jsonResponse.code
        )
    }
  }

  public async deletePostReaction (postId: string): Promise<void> {
    const response = await fetch(`/api/posts/${postId}/reactions`, {
      method: 'DELETE',
    })

    if (response.ok) {
      return
    }

    const jsonResponse = await response.json()

    switch (response.status) {
      case 400:
        throw new APIException(
          'bad_request_error_message',
          response.status,
          jsonResponse.code
        )

      case 404:
        switch (jsonResponse.code) {
          case POST_REACTION_POST_NOT_FOUND:
            throw new APIException(
              'post_not_found_error_message',
              response.status,
              jsonResponse.code
            )

          case POST_REACTION_NOT_FOUND:
            throw new APIException(
              'post_reaction_does_not_exist_error_message',
              response.status,
              jsonResponse.code
            )

          default:
            throw new APIException(
              'server_error_error_message',
              response.status,
              jsonResponse.code
            )
        }

      default:
        throw new APIException(
          'server_error_error_message',
          response.status,
          jsonResponse.code
        )
    }
  }

  public async getPostUserInteraction (postId: string): Promise<ReactionComponentDto | null> {
    const fetchRoute = `/api/posts/${postId}/user-interaction`

    const response = await fetch(fetchRoute)

    const jsonResponse = await response.json()

    if (response.ok) {
      if (jsonResponse.userReaction === null) {
        return null
      }

      return ReactionComponentDtoTranslator.fromApplicationDto(jsonResponse.userReaction)
    }

    switch (response.status) {
      case 400:
        throw new APIException(
          'bad_request_error_message',
          response.status,
          jsonResponse.code
        )

      default:
        throw new APIException(
          'server_error_error_message',
          response.status,
          jsonResponse.code
        )
    }
  }

  public async getRandomPostSlug (): Promise<string> {
    const response = await fetch('api/posts/random')

    const jsonResponse = await response.json()

    if (response.ok) {
      return jsonResponse.postSlug as string
    }

    throw new APIException('server_error_error_message', jsonResponse.status, jsonResponse.code)
  }
}
