import { z, ZodError } from 'zod'
import {
  CategoriesApiRequestValidatorError
} from '~/modules/Categories/Infrastructure/Api/CategoriesApiRequestValidatorError'
import { AddCategoryViewApiRequestDto } from '~/modules/Categories/Infrastructure/Api/AddCategoryViewRequestDto'

export class AddCategoryViewRequestValidator {
  private static addCategoryViewApiRequestSchema = z.object({
    categoryId: z.string().uuid(),
  })

  public static validate (request: AddCategoryViewApiRequestDto): CategoriesApiRequestValidatorError | void {
    try {
      this.addCategoryViewApiRequestSchema.parse(request)
    } catch (exception: unknown) {
      if (!(exception instanceof ZodError)) {
        throw exception
      }

      return CategoriesApiRequestValidatorError.addCategoryViewValidation(exception.issues)
    }
  }
}
