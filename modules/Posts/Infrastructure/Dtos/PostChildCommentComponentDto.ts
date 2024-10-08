import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'

export interface PostChildCommentComponentDto {
  id: string
  comment: string
  createdAt: string
  username: string
  parentCommentId: string
  reactionsNumber: number
  userReaction: ReactionComponentDto | null
}
