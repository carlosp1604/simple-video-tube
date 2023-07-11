import { GetPostPostCommentsResponseDto } from '~/modules/Posts/Application/Dtos/GetPostPostCommentsResponseDto'
import { defaultPerPage } from '~/modules/Shared/Domain/Pagination'
import { PostCommentApplicationDto } from '~/modules/Posts/Application/Dtos/PostCommentApplicationDto'

export class CommentsApiService {
  public async create (
    postId: string,
    comment: string,
    parentCommentId: string | null
  ): Promise<PostCommentApplicationDto> {
    return (await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        comment,
        parentCommentId,
      }),
    })).json()
  }

  public async getComments (
    postId: string,
    pageNumber: number,
    perPage: number = defaultPerPage
  ): Promise<GetPostPostCommentsResponseDto> {
    const params = new URLSearchParams()

    params.append('page', pageNumber.toString())
    params.append('perPage', perPage.toString())

    return (await fetch(`/api/posts/${postId}/comments?${params}`)).json()
  }
}
