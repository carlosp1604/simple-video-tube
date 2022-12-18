import { UserApplicationDto } from './UserApplicationDto'
import { User } from '../Domain/User'

export class UserApplicationDtoTranslator {
  public static fromDomain(user: User): UserApplicationDto {
    let emailVerified: string | null = null

    if (user.emailVerified !== null) {
      emailVerified = user.emailVerified.toISO()
    }

    return {
      id: user.id,
      name: user.name,
      imageUrl: user.imageUrl,
      emailVerified,
      updatedAt: user.updatedAt.toISO(),
      email: user.email,
      language: user.language,
      viewsCount: user.viewsCount,
      createdAt: user.createdAt.toISO()
    }
  }
}