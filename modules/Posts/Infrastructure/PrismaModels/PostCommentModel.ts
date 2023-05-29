import { Prisma } from '@prisma/client'

export type PostCommentWithUser = Prisma.PostCommentGetPayload<{
  include: {
    user: true
  }
}>

export type PostCommentWithChilds = Prisma.PostCommentGetPayload<{
  include: {
    childComments: true
  }
}>
