import { DBConnection } from '@db/db';
import CategoryItemTable, { CategoryItemType } from '@db/tables/category-items';
import { DB, eq } from 'drizzle-orm';

export default class CategoryItemQueryService extends DBConnection {
  #categoryItem: CategoryItemTable;

  constructor(db: DB) {
    super(db);
    this.#categoryItem = new CategoryItemTable(this.db);
  }

  public getAll = (): Promise<CategoryItemType[]> =>
    this.#categoryItem.select().all();

  public getByCategoryId = (categoryId: number): Promise<CategoryItemType[]> =>
    this.#categoryItem
      .select()
      .where(eq(this.#categoryItem.categoryId, categoryId))
      .all();

  public getById = (id: number): Promise<CategoryItemType> =>
    this.#categoryItem
      .select()
      .where(eq(this.#categoryItem.id, id))
      .all()
      .then(res => res[0]);
}
