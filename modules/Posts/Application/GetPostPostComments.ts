import { maxPostsPerPage, minPostsPerPage } from '../../Shared/Application/Pagination'
import { Post } from '../Domain/Post'
import { PostCommentRepositoryInterface } from '../Domain/PostCommentRepositoryInterface'
import { GetPostPostCommentsRespondeDto, PostWithChildCommentCount } from './Dtos/GetPostPostCommentsResponseDto'
import { GetPostPostCommentsApplicationException } from './GetPostPostCommentsApplicationException'
import { GetPostPostCommentsRespondeDtoTranslator } from './Translators/GetPostPostCommentsRespondeDtoTranslator'

export class GetPostPostComments {
  constructor(private repository: PostCommentRepositoryInterface) {}

  public async get(
    postId: Post['id'],
    page: number,
    perPage: number,
  ): Promise<GetPostPostCommentsRespondeDto> {
    this.validateRequest(page, perPage)

    const offset = (page - 1) * perPage

    const [postComments, postPostCommentsCount] = await Promise.all([
      await this.repository.findWithOffsetAndLimit(
        postId,
        offset,
        perPage
      ),
      await this.repository.countPostComments(postId)
    ])

    const commentsWithChildCount: PostWithChildCommentCount[] = postComments.map((comment) => {
      return GetPostPostCommentsRespondeDtoTranslator.fromDomain(comment.postComment, comment.childComments)
    })

    return {
      commentwithChildCount: commentsWithChildCount,
      postPostCommentsCount,
    }
  }

  private validateRequest(page: number, perPage: number): void {
    if (isNaN(page) || page <= 0) {
      throw GetPostPostCommentsApplicationException.invalidOffsetValue()
    }

    if (
      isNaN(perPage) ||
      perPage < minPostsPerPage ||
      perPage > maxPostsPerPage
    ) {
      throw GetPostPostCommentsApplicationException.invalidLimitValue(minPostsPerPage, maxPostsPerPage)
    }
  }
}