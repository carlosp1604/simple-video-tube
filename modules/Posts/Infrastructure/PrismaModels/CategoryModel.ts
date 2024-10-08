import { Prisma } from '@prisma/client'

export type CategoryWithTranslations = Prisma.CategoryGetPayload<{
  include: { translations: true }
}>
