import { ZodIssue } from 'zod'
import { ZodApiValidationException } from '~/modules/Exceptions/Infrastructure/ZodApiValidationException'

export class CategoriesApiRequestValidatorError extends ZodApiValidationException {
  public static addCategoryViewRequestId = 'validator_exception_add_category_view_request'

  public static addCategoryViewValidation (issues: ZodIssue[]): CategoriesApiRequestValidatorError {
    return new CategoriesApiRequestValidatorError(
      this.addCategoryViewRequestId,
      issues
    )
  }
}
