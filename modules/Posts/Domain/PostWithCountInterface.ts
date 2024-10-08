import { Post } from './Post'

export interface PostReactionsInterface {
  like: number
  dislike: number
}

export interface PostWithViewsCommentsReactionsInterface {
  post: Post
  postComments: number
  reactions: PostReactionsInterface
}

export interface PostWithViewsInterface {
  post: Post
}

export interface PostsWithViewsInterfaceWithTotalCount {
  posts: PostWithViewsInterface[]
  count: number
}
