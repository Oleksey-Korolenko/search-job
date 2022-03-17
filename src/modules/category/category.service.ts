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

  public getAll = (): Promise<CategoryType[]> =>
    this.#categoryQueryService.getAll();
}
