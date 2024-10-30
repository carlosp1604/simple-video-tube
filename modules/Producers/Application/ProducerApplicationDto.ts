export interface ProducerApplicationDto {
  readonly id: string
  readonly slug: string
  readonly name: string
  readonly description: string | null
  readonly imageUrl: string | null
  readonly viewsCount: number
  readonly parentProducerId: string | null
  readonly createdAt: string
  readonly parentProducer: ProducerApplicationDto | null
}
