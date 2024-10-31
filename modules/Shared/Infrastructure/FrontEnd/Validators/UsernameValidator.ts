import { Validator } from '~/modules/Shared/Infrastructure/FrontEnd/Validators/Validator'

export class UsernameValidator implements Validator<string> {
  private usernameFormat = /^[a-zA-Z0-9_]+$/
  private usernameMinLength = 4
  private usernameMaxLength = 256

  public validate (username: string): boolean {
    return !(
      username.match(this.usernameFormat) === null ||
      username.length < this.usernameMinLength ||
      username.length > this.usernameMaxLength
    )
  }
}
