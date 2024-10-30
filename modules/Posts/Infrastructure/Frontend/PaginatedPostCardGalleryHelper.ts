import { FetchFilter } from '~/modules/Shared/Infrastructure/FrontEnd/FetchFilter'
import { PostFilterOptions } from '~/modules/Posts/Infrastructure/Frontend/PostFilterOptions'

export class PaginatedPostCardGalleryHelper {
  public static arraysEqual (
    currentFiltersArray: FetchFilter<PostFilterOptions>[],
    newFiltersArray: FetchFilter<PostFilterOptions>[]) {
    if (currentFiltersArray.length !== newFiltersArray.length) {
      return false
    }

    for (const currentFilterArray of currentFiltersArray) {
      const foundOnNewArray = newFiltersArray.find((newFilter) =>
        newFilter.type === currentFilterArray.type && newFilter.value === currentFilterArray.value
      )

      if (!foundOnNewArray) {
        return false
      }

      const index = newFiltersArray.indexOf(foundOnNewArray)

      newFiltersArray.splice(index, 1)
    }

    return true
  }
}
