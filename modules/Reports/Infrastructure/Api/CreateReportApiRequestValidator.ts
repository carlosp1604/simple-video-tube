import { z, ZodError } from 'zod'
import { ReportsApiRequestValidatorError } from '~/modules/Reports/Infrastructure/Api/ReportsApiRequestValidatorError'
import { CreateReportApiRequestDto } from '~/modules/Reports/Infrastructure/Api/CreateReportApiRequestDto'

export class CreateReportApiRequestValidator {
  private static createReportApiRequestSchema = z.object({
    postId: z.string().uuid(),
    content: z.string(),
    userName: z.string().min(1),
    userEmail: z.string().email(),
  })

  public static validate (request: CreateReportApiRequestDto): ReportsApiRequestValidatorError | void {
    try {
      this.createReportApiRequestSchema.parse(request)
    } catch (exception: unknown) {
      if (!(exception instanceof ZodError)) {
        throw exception
      }

      return ReportsApiRequestValidatorError.createReportValidation(exception.issues)
    }
  }
}
