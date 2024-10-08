import { Post } from '@prisma/client'
import { PostChildComment } from './PostChildComment'
import { PostCommentWithCountAndUserInteraction } from './PostCommentWithCountInterface'
import {
  PostChildCommentWithReactionCountAndUserInteraction
} from '~/modules/Posts/Domain/PostComments/PostChildCommentWithReactionCountAndUserInteraction'
import { PostComment } from '~/modules/Posts/Domain/PostComments/PostComment'
import { RepositoryOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'

export const PostCommentRepositoryOptions:
  Extract<RepositoryOptions, 'comments.childComments' | 'comments.reactions'>[] = [
    'comments.childComments',
    'comments.reactions',
  ]

export type PostCommentRepositoryOption = typeof PostCommentRepositoryOptions[number]

export interface PostCommentRepositoryInterface {

  /**
   * Find Comments based on its postId (includes user model, childComments count and reactions (like) count)
   * Retrieves user reaction if userId is not null
   * @param postId Post ID
   * @param offset Comment offset
   * @param limit Comment limit
   * @param userIp User IP
   * @return Array of PostCommentWithCountAndUserInteraction
   */
  findWithOffsetAndLimit(
    postId: Post['id'],
    offset: number,
    limit: number,
    userIp: PostComment['userIp'] | null
  ): Promise<PostCommentWithCountAndUserInteraction[]>

  /**
   * Find Child Comments based on its postId (includes user model and childComments count and reactions (like) count)
   * @param parentCommentId Parent comment ID
   * @param offset Comment offset
   * @param limit Comment limit
   * @param userIp User IP
   * @return Array of PostChildCommentWithReactionCount
   */
  findChildWithOffsetAndLimit(
    parentCommentId: PostChildComment['id'],
    offset: number,
    limit: number,
    userIp: PostComment['userIp'] | null
  ): Promise<PostChildCommentWithReactionCountAndUserInteraction[]>

  /**
   * Count Comments from a Post
   * @param postId Post ID
   * @return Post's comments number
   */
  countPostComments(
    postId: Post['id'],
  ): Promise<number>

  /**
   * Count Child Comments from a Post
   * @param parentCommentId Parent comment ID
   * @return Child Post's comments number
   */
  countPostChildComments(
    parentCommentId: PostChildComment['parentCommentId']
  ): Promise<number>

  /**
   * Find a PostComment/PostChildComment by its ID
   * @param postCommentId Comment ID
   * @param parentCommentId Parent comment ID
   * @return PostComment or PostChildComment
   */
  findById(
    postCommentId: PostComment['id'] | PostChildComment['id'],
    parentCommentId: PostChildComment['parentCommentId'] | null
  ): Promise<PostComment | PostChildComment | null>
}
