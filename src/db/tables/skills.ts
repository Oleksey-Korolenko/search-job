import { AbstractTable, ExtractModel } from 'drizzle-orm';
import CategoryItemTable from './category-items';

export default class SkillTable extends AbstractTable<SkillTable> {
  public id = this.serial('id').primaryKey();

  public name = this.varchar('name').notNull();

  public translate = this.jsonb('translate').notNull();

  public categoryItemId = this.int('category_item_id')
    .foreignKey(CategoryItemTable, table => table.id)
    .notNull();

  public tableName(): string {
    return 'skills';
  }
}

export type SkillType = ExtractModel<SkillTable>;
