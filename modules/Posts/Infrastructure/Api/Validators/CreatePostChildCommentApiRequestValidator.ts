import { z, ZodError } from 'zod'
import { PostCommentApiRequestValidatorError } from './PostCommentApiRequestValidatorError'
import {
  CreatePostCommentApiRequestDto
} from '~/modules/Posts/Infrastructure/Api/Requests/CreatePostCommentApiRequestDto'

export class CreatePostChildCommentApiRequestValidator {
  private static createPostChildCommentApiRequestSchema = z.object({
    comment: z
      .string()
      .trim()
      .min(1, { message: 'Comment cannot be empty' }),
    postId: z.string({}).uuid(),
    username: z.string().min(1),
    parentCommentId: z.string().uuid(),
  })

  public static validate (request: CreatePostCommentApiRequestDto): PostCommentApiRequestValidatorError | void {
    try {
      this.createPostChildCommentApiRequestSchema.parse(request)
    } catch (exception: unknown) {
      if (!(exception instanceof ZodError)) {
        throw exception
      }

      return PostCommentApiRequestValidatorError.createPostChildCommentValidation(exception.issues)
    }
  }
}
