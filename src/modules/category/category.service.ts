import { DBConnection } from '@db/db';
import { CategoryType } from '@db/tables';
import { DB } from 'drizzle-orm';
import CategoryQueryService from './category.query.service';

export default class CategoryService extends DBConnection {
  #categoryQueryService: CategoryQueryService;

  constructor(db: DB) {
    super(db);
    this.#categoryQueryService = new CategoryQueryService(db);
  }

  public getAll = async (): Promise<CategoryType[]> => {
    const categories = await this.#categoryQueryService.getAll();

    if (categories.length === 0) {
      throw new Error(`Can't find any categories!`);
    }

    return categories;
  };

  public getById = async (categoryId: number): Promise<CategoryType> => {
    const category = await this.#categoryQueryService.getById(categoryId);

    if (category === undefined) {
      throw new Error(`Can't find category with id: [${categoryId}]!`);
    }

    return category;
  };
}
