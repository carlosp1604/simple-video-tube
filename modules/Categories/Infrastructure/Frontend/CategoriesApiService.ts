export class CategoriesApiService {
  public async addCategoryView (categoryId: string): Promise<Response> {
    return fetch(`/api/categories/${categoryId}/category-views`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
