export interface ProducerCardDto {
  readonly id: string
  readonly name: string
  readonly imageUrl: string | null
  readonly slug: string
  readonly postsNumber: number
  readonly producerViews: number
}
