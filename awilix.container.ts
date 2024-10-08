import { GetActors } from '~/modules/Actors/Application/GetActors/GetActors'
import { AddPostView } from '~/modules/Posts/Application/AddPostView/AddPostView'
import { GetPostBySlug } from '~/modules/Posts/Application/GetPostBySlug/GetPostBySlug'
import { GetRelatedPosts } from '~/modules/Posts/Application/GetRelatedPosts/GetRelatedPosts'
import { GetPopularProducers } from '~/modules/Producers/Application/GetPopularProducers'
import { CreatePostReaction } from '~/modules/Posts/Application/CreatePostReaction/CreatePostReaction'
import { MysqlPostRepository } from '~/modules/Posts/Infrastructure/MysqlPostRepository'
import { BcryptCryptoService } from '~/helpers/Infrastructure/BcryptCryptoService'
import { MysqlActorRepository } from '~/modules/Actors/Infrastructure/MysqlActorRepository'
import { MysqlProducerRepository } from '~/modules/Producers/Infrastructure/MysqlProducerRepository'
import { asClass, asFunction, createContainer, InjectionMode } from 'awilix'
import { GetPostUserInteraction } from '~/modules/Posts/Application/GetPostUserInteraction/GetPostUserInteraction'
import { DateService } from '~/helpers/Infrastructure/DateService'
import { GetPostPostComments } from '~/modules/Posts/Application/GetPostPostComments/GetPostPostComments'
import { MysqlPostCommentRepository } from '~/modules/Posts/Infrastructure/MysqlPostCommentRepository'
import { GetPostPostChildComments } from '~/modules/Posts/Application/GetPostPostChildComments/GetPostPostChildComments'
import { CreatePostComment } from '~/modules/Posts/Application/CreatePostComment/CreatePostComment'
import { CreatePostChildComment } from '~/modules/Posts/Application/CreatePostChildComment/CreatePostChildComment'
import { DeletePostComment } from '~/modules/Posts/Application/DeletePostComment/DeletePostComment'
import { DeletePostReaction } from '~/modules/Posts/Application/DeletePostReaction/DeletePostReaction'
import { MysqlReactionRepository } from '~/modules/Reactions/Infrastructure/MysqlReactionRepository'
import {
  CreatePostCommentReaction
} from '~/modules/Posts/Application/CreatePostCommentReaction/CreatePostCommentReaction'
import {
  DeletePostCommentReaction
} from '~/modules/Posts/Application/DeletePostCommentReaction/DeletePostCommentReaction'
import { GetPosts } from '~/modules/Posts/Application/GetPosts/GetPosts'
import { GetActorBySlug } from '~/modules/Actors/Application/GetActorBySlug/GetActorBySlug'
import { GetProducerBySlug } from '~/modules/Producers/Application/GetProducerBySlug/GetProducerBySlug'
import { MysqlCategoryRepository } from '~/modules/Categories/Infrastructure/MysqlCategoryRepository'
import { GetCategoryBySlug } from '~/modules/Categories/Application/GetCategoryBySlug/GetCategoryBySlug'
import { GetProducers } from '~/modules/Producers/Application/GetProducers/GetProducers'
import { AddActorView } from '~/modules/Actors/Application/AddActorView/AddActorView'
import { AddProducerView } from '~/modules/Producers/Application/AddProducerView/AddProducerView'
import { GetAllCategories } from '~/modules/Categories/Application/GetAllCategories/GetAllCategories'
import { MysqlReportRepository } from '~/modules/Reports/Infrastructure/MysqlReportRepository'
import { CreateReport } from '~/modules/Reports/Application/CreateReport'

/**
 * We create a container to register our classes dependencies
 * This will be a global container, so it can be used in any module
 * CLASSIC MODE: https://github.com/jeffijoe/awilix#injection-modes
 */
const container = createContainer({ injectionMode: InjectionMode.CLASSIC })

/**
 * Register dependencies in the container
 */
container.register('cryptoService', asClass(BcryptCryptoService))
// FIXME: This was the only way to make it works...
container.register('postRepository', asFunction(() => {
  return new MysqlPostRepository()
}))
container.register('reportRepository', asFunction(() => {
  return new MysqlReportRepository()
}))
container.register('actorRepository', asClass(MysqlActorRepository))
container.register('producerRepository', asClass(MysqlProducerRepository))
container.register('dateService', asClass(DateService))
container.register('postCommentRepository', asClass(MysqlPostCommentRepository))
container.register('baseUrl', asFunction(() => {
  const baseUrl = process.env.BASE_URL

  if (!baseUrl) {
    throw Error('Missing BASE_URL environment variable')
  }

  return baseUrl
}))
container.register('reactionRepository', asClass(MysqlReactionRepository))
container.register('categoryRepository', asClass(MysqlCategoryRepository))
/**
 * Use-cases
 */
container.register('getPostsUseCase', asClass(GetPosts))
container.register('getActorsUseCase', asClass(GetActors))
container.register('getPopularProducersUseCase', asClass(GetPopularProducers))
container.register('getRelatedPostsUseCase', asClass(GetRelatedPosts))
container.register('getPostBySlugUseCase', asClass(GetPostBySlug))
container.register('addPostViewUseCase', asClass(AddPostView))
container.register('addActorViewUseCase', asClass(AddActorView))
container.register('addProducerViewUseCase', asClass(AddProducerView))
container.register('createPostReactionUseCase', asClass(CreatePostReaction))
container.register('getPostUserInteractionUseCase', asClass(GetPostUserInteraction))
container.register('getPostPostCommentsUseCase', asClass(GetPostPostComments))
container.register('getPostPostChildCommentsUseCase', asClass(GetPostPostChildComments))
container.register('createPostCommentUseCase', asClass(CreatePostComment))
container.register('createPostChildCommentUseCase', asClass(CreatePostChildComment))
container.register('deletePostCommentUseCase', asClass(DeletePostComment))
container.register('deletePostReactionUseCase', asClass(DeletePostReaction))
container.register('createPostCommentReactionUseCase', asClass(CreatePostCommentReaction))
container.register('deletePostCommentReactionUseCase', asClass(DeletePostCommentReaction))
container.register('getActorBySlugUseCase', asClass(GetActorBySlug))
container.register('getProducerBySlugUseCase', asClass(GetProducerBySlug))
container.register('getCategoryBySlugUseCase', asClass(GetCategoryBySlug))
container.register('getProducersUseCase', asClass(GetProducers))
container.register('getAllCategoriesUseCase', asClass(GetAllCategories))
container.register('createReportUseCase', asClass(CreateReport))

export { container }
