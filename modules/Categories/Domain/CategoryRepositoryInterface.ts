import { Category } from '~/modules/Categories/Domain/Category'

export interface CategoryRepositoryInterface {
  /**
   * Insert a Category in the persistence layer
   * @param category Category to persist
   */
  save (category: Category): Promise<void>

  /**
   * Find a Category given its slug
   * @param categorySlug Category Slug
   * @return Category if found or null
   */
  findBySlug (categorySlug: Category['slug']): Promise<Category | null>

  /**
   * Get all categories from database
   * @return Array of Categories
   */
  getAll(): Promise<Category[]>
}
