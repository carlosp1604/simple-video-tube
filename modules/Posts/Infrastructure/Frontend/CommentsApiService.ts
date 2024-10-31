import { GetPostPostCommentsResponseDto } from '~/modules/Posts/Application/Dtos/GetPostPostCommentsResponseDto'
import { ModelReactionApplicationDto } from '~/modules/Reactions/Application/ModelReactionApplicationDto'
import { APIException } from '~/modules/Shared/Infrastructure/FrontEnd/ApiException'
import {
  POST_COMMENT_PARENT_COMMENT_NOT_FOUND,
  POST_COMMENT_POST_NOT_FOUND,
  POST_COMMENT_REACTION_NOT_FOUND,
  POST_COMMENT_REACTION_POST_COMMENT_NOT_FOUND,
  POST_COMMENT_USER_NOT_FOUND
} from '~/modules/Posts/Infrastructure/Api/PostApiExceptionCodes'
import { PostCommentApplicationDto } from '~/modules/Posts/Application/Dtos/PostCommentApplicationDto'
import { PostChildCommentApplicationDto } from '~/modules/Posts/Application/Dtos/PostChildCommentApplicationDto'
import {
  GetPostPostChildCommentsResponseDto
} from '~/modules/Posts/Application/GetPostPostChildComments/GetPostPostChildCommentsResponseDto'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import {
  ReactionComponentDtoTranslator
} from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDtoTranslator'
import { PostChildCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostChildCommentComponentDto'
import {
  PostChildCommentComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostChildCommentComponentTranslator'
import {
  PostCommentComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCommentComponentDtoTranslator'
import { PostCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCommentComponentDto'

interface GetCommentsResponse {
  comments: PostCommentComponentDto[]
  commentsNumber: number
}

interface GetChildCommentsResponse {
  comments: PostChildCommentComponentDto[]
  commentsNumber: number
}

export class CommentsApiService {
  public async create (
    postId: string,
    comment: string,
    userName: string,
    parentCommentId: string | null,
    locale:string
  ): Promise<PostCommentComponentDto> {
    const response = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        comment,
        userName,
        parentCommentId,
      }),
    })

    const jsonResponse = await response.json()

    if (response.ok) {
      return PostCommentComponentDtoTranslator
        .fromApplication(jsonResponse as PostCommentApplicationDto, 0, 0, null, locale)
    }

    switch (response.status) {
      case 400:
        throw new APIException(
          'bad_request_error_message',
          response.status,
          jsonResponse.code
        )

      case 422:
        throw new APIException(
          'invalid_name_error_message',
          response.status,
          jsonResponse.code
        )

      case 404:
        switch (jsonResponse.code) {
          case POST_COMMENT_POST_NOT_FOUND:
            throw new APIException(
              'post_not_found_error_message',
              response.status,
              jsonResponse.code
            )

          case POST_COMMENT_USER_NOT_FOUND:
            throw new APIException(
              'user_not_found_error_message',
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

  public async createReply (
    postId: string,
    comment: string,
    userName: string,
    parentCommentId: string,
    locale: string
  ): Promise<PostChildCommentComponentDto> {
    const response = await fetch(`/api/posts/${postId}/comments/${parentCommentId}/children`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ comment, userName }),
    })

    const jsonResponse = await response.json()

    if (response.ok) {
      return PostChildCommentComponentDtoTranslator
        .fromApplication(jsonResponse as PostChildCommentApplicationDto, 0, null, locale)
    }

    switch (response.status) {
      case 400:
        throw new APIException(
          'bad_request_error_message',
          response.status,
          jsonResponse.code
        )

      case 422:
        throw new APIException(
          'invalid_name_error_message',
          response.status,
          jsonResponse.code
        )

      case 404:
        switch (jsonResponse.code) {
          case POST_COMMENT_POST_NOT_FOUND:
            throw new APIException(
              'create_post_child_comment_post_not_found_error_message',
              response.status,
              jsonResponse.code
            )

          case POST_COMMENT_PARENT_COMMENT_NOT_FOUND:
            throw new APIException(
              'create_post_child_comment_parent_comment_not_found_error_message',
              response.status,
              jsonResponse.code
            )

          case POST_COMMENT_USER_NOT_FOUND:
            throw new APIException(
              'user_not_found_error_message',
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

  public async getComments (
    postId: string,
    pageNumber: number,
    perPage: number = defaultPerPage,
    locale: string
  ): Promise<GetCommentsResponse> {
    const params = new URLSearchParams()

    params.append('page', pageNumber.toString())
    params.append('perPage', perPage.toString())

    const response = await fetch(`/api/posts/${postId}/comments?${params}`)

    const jsonResponse = await response.json()

    if (response.ok) {
      return {
        comments: (jsonResponse as GetPostPostCommentsResponseDto)
          .postCommentsWithChildrenCount.map((applicationDto) => {
            return PostCommentComponentDtoTranslator.fromApplication(
              applicationDto.postComment,
              applicationDto.childrenNumber,
              applicationDto.reactionsNumber,
              applicationDto.userReaction,
              locale
            )
          }),
        commentsNumber: (jsonResponse as GetPostPostCommentsResponseDto).postPostCommentsCount,
      }
    }

    /**
     * Currently, we don't handle the possible error since is not possible
     * for user to manipulate the request, so simply we return a 500
     */

    throw new APIException(
      'server_error_error_message',
      response.status,
      jsonResponse.code
    )
  }

  public async getChildComments (
    postId: string,
    parentCommentId: string,
    pageNumber: number,
    perPage: number = defaultPerPage,
    locale: string
  ): Promise<GetChildCommentsResponse> {
    const params = new URLSearchParams()

    params.append('page', pageNumber.toString())
    params.append('perPage', perPage.toString())

    const response = await fetch(`/api/posts/${postId}/comments/${parentCommentId}/children?${params}`)

    const jsonResponse = await response.json()

    if (response.ok) {
      return {
        comments: (jsonResponse as GetPostPostChildCommentsResponseDto)
          .childCommentsWithReactions.map((applicationDto) => {
            return PostChildCommentComponentDtoTranslator.fromApplication(
              applicationDto.postChildComment, applicationDto.reactionsNumber, applicationDto.userReaction, locale
            )
          }),
        commentsNumber: (jsonResponse as GetPostPostChildCommentsResponseDto).childCommentsCount,
      }
    }

    /**
     * Currently, we don't handle the possible error since is not possible
     * for user to manipulate the request, so simply we return a 500
     */

    throw new APIException(
      'server_error_error_message',
      response.status,
      jsonResponse.code
    )
  }

  public async createPostCommentReaction (postCommentId: string): Promise<ReactionComponentDto> {
    const response = await fetch(`/api/comments/${postCommentId}/reactions`, { method: 'POST' })

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
          'create_post_comment_reaction_post_comment_not_found_error_message',
          response.status,
          jsonResponse.code
        )

      case 409:
        throw new APIException(
          'create_post_comment_reaction_user_already_reacted_error_message',
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

  public async deletePostCommentReaction (postCommentId: string): Promise<void> {
    const response = await fetch(`/api/comments/${postCommentId}/reactions`, { method: 'DELETE' })

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
          case POST_COMMENT_REACTION_POST_COMMENT_NOT_FOUND:
            throw new APIException(
              'delete_post_comment_reaction_post_comment_not_found_error_message',
              response.status,
              jsonResponse.code
            )

          case POST_COMMENT_REACTION_NOT_FOUND:
            throw new APIException(
              'delete_post_comment_reaction_user_has_not_reacted_error_messaged',
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

  public async createPostChildCommentReaction (
    postCommentId: string,
    parentCommentId: string
  ): Promise<ReactionComponentDto> {
    const response =
      await fetch(`/api/comments/${parentCommentId}/children/${postCommentId}/reactions`, { method: 'POST' })

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
          'create_post_comment_reaction_post_comment_not_found_error_message',
          response.status,
          jsonResponse.code
        )

      case 409:
        throw new APIException(
          'create_post_comment_reaction_user_already_reacted_error_message',
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

  public async deletePostChildCommentReaction (
    postCommentId: string,
    parentCommentId: string
  ): Promise<void> {
    const response =
      await fetch(`/api/comments/${parentCommentId}/children/${postCommentId}/reactions`, { method: 'DELETE' })

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
          case POST_COMMENT_REACTION_POST_COMMENT_NOT_FOUND:
            throw new APIException(
              'delete_post_comment_reaction_post_comment_not_found_error_message',
              response.status,
              jsonResponse.code
            )

          case POST_COMMENT_REACTION_NOT_FOUND:
            throw new APIException(
              'delete_post_comment_reaction_user_has_not_reacted_error_messaged',
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
}
