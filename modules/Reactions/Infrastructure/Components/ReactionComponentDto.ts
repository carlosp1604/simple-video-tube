export enum ReactionType {
  LIKE = 'like',
  DISLIKE = 'dislike'
}

export interface ReactionComponentDto {
  reactionableId: string
  userIp: string
  reactionType: string
}
