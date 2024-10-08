import { Prisma } from '@prisma/client'

export type PostCommentWithChildren = Prisma.PostCommentGetPayload<{
  include: {
    childComments: true
  }
}>

export type PostCommentWithReactions = Prisma.PostCommentGetPayload<{
  include: {
    reactions: true
  }
}>
