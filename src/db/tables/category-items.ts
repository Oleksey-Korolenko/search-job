import { AbstractTable, ExtractModel } from 'drizzle-orm';
import CategoryTable from './category';

export default class CategoryItemTable extends AbstractTable<CategoryItemTable> {
  public id = this.serial('id').primaryKey();

  public name = this.varchar('name').notNull();

  public translate = this.jsonb('translate').notNull();

  public categoryId = this.int('category_id')
    .foreignKey(CategoryTable, (table) => table.id)
    .notNull();

  public tableName(): string {
    return 'category-item';
  }
}

export type CategoryItemType = ExtractModel<CategoryItemTable>;
