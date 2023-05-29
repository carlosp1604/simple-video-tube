import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { User } from '~/modules/Auth/Domain/User'

export class CreateUserApplicationException extends ApplicationException {
  public static usernameAlreadyRegisteredId = 'create_user_username_already_registered'
  public static emailAlreadyRegisteredId = 'create_user_email_already_registered'
  public static cannotCreateUserId = 'create_user_cannot_create_user'
  public static verificationTokenIsNotValidId = 'create_user_verification_token_is_not_valid'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, CreateUserApplicationException.prototype)
  }

  public static usernameAlreadyRegistered (username: User['username']): CreateUserApplicationException {
    return new CreateUserApplicationException(
      `${username} is already taken`,
      this.usernameAlreadyRegisteredId
    )
  }

  public static emailAlreadyRegistered (userEmail: User['email']): CreateUserApplicationException {
    return new CreateUserApplicationException(
      `${userEmail} is already taken`,
      this.emailAlreadyRegisteredId
    )
  }

  public static cannotCreateUser (userEmail: User['email']): CreateUserApplicationException {
    return new CreateUserApplicationException(
      `Could not create user with email ${userEmail}`,
      this.cannotCreateUserId
    )
  }

  public static verificationTokenIsNotValid (userEmail: User['email']): CreateUserApplicationException {
    return new CreateUserApplicationException(
      `Verification token associated to email ${userEmail} is not valid.`,
      this.verificationTokenIsNotValidId
    )
  }
}