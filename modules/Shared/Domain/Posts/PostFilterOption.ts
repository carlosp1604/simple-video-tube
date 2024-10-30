export type PostFilterStringTypeOption =
  'postTitle' |
  'producerSlug' |
  'actorId' |
  'tagId' |
  'actorSlug' |
  'categorySlug' |
  'savedBy' |
  'viewedBy'

export const PostFilterStringTypeOptions: PostFilterStringTypeOption[] = [
  'postTitle',
  'producerSlug',
  'actorId',
  'tagId',
  'actorSlug',
  'categorySlug',
  'savedBy',
  'viewedBy',
]

export const GetPostsFilterStringTypeOptions:
  Extract<PostFilterStringTypeOption, 'postTitle' | 'producerSlug' | 'actorSlug' | 'categorySlug'>[] = [
    'postTitle', 'producerSlug', 'actorSlug', 'categorySlug',
  ]

export type GetPostsFilterStringTypeOption = typeof GetPostsFilterStringTypeOptions[number]

export interface PostFilterOptionInterface {
  type: PostFilterStringTypeOption
  value: string
}
