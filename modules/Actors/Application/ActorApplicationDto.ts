export interface ActorApplicationDto {
  readonly id: string
  readonly slug: string
  readonly name: string
  readonly imageUrl: string | null
  readonly viewsCount: number
  readonly createdAt: string
}
