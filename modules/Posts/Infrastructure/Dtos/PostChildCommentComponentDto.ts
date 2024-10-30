import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'

export interface PostChildCommentComponentDto {
  id: string
  comment: string
  createdAt: string
  userName: string
  parentCommentId: string
  reactionsNumber: number
  userReaction: ReactionComponentDto | null
}
