import { Validator } from '~/modules/Shared/Infrastructure/FrontEnd/Validators/Validator'

export class NameValidator implements Validator<string> {
  private nameFormat = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/
  private nameMinLength = 4
  private nameMaxLength = 256

  public validate (name: string): boolean {
    return !(name.match(this.nameFormat) === null ||
      name.length < this.nameMinLength ||
      name.length > this.nameMaxLength)
  }
}
