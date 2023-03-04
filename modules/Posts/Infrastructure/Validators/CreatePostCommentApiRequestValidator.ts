import { z, ZodError } from 'zod'
import { CreatePostCommentApiRequestDto } from '../Dtos/CreatePostCommentApiRequestDto'
import { PostCommentApiRequestValidatorError } from './PostCommentApiRequestValidatorError'

export class CreatePostCommentApiRequestValidator {
  private static createPostCommentApiRequestSchema = z.object({
    comment: z
      .string()
      .trim()
      .min(1, { message: 'Comment cannot be empty' }),
    postId: z.string({}).uuid(),
    userId: z.string().uuid(),
  })

  public static validate(request: CreatePostCommentApiRequestDto): PostCommentApiRequestValidatorError | void {
    try {
      this.createPostCommentApiRequestSchema.parse(request)
    }
    catch (exception: unknown) {
      if (!(exception instanceof ZodError)) {
        throw exception
      }

      return PostCommentApiRequestValidatorError.createPostCommentValidation(exception.issues)
    }

    return
  }
}