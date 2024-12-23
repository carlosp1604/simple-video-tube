import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'

export interface PostCommentComponentDto {
  id: string
  comment: string
  postId: string
  createdAt: string
  userName: string
  repliesNumber: number
  reactionsNumber: number
  userReaction: ReactionComponentDto | null
}
