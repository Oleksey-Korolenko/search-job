import { DBConnection } from '@db/db';
import CategoryTable, { CategoryType } from '@db/tables/categories';
import { DB } from 'drizzle-orm';

export default class CategoryQueryService extends DBConnection {
  #category: CategoryTable;

  constructor(db: DB) {
    super(db);
    this.#category = new CategoryTable(this.db);
  }

  public getAll = (): Promise<CategoryType[]> => this.#category.select().all();
}
