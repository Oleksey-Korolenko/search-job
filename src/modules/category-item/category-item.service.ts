import { DBConnection } from '@db/db';
import { CategoryItemType } from '@db/tables';
import { DB } from 'drizzle-orm';
import CategoryItemQueryService from './category-item.query.service';

export default class CategoryItemService extends DBConnection {
  #categoryItemQueryService: CategoryItemQueryService;

  constructor(db: DB) {
    super(db);
    this.#categoryItemQueryService = new CategoryItemQueryService(db);
  }

  public getAll = (): Promise<CategoryItemType[]> =>
    this.#categoryItemQueryService.getAll();

  public getByCategoryId = (categoryId: number): Promise<CategoryItemType[]> =>
    this.#categoryItemQueryService.getByCategoryId(categoryId);
}
