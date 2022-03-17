import { Translate } from '@custom-types/translate.type';
import { AbstractTable, ExtractModel } from 'drizzle-orm';

export default class CategoryTable extends AbstractTable<CategoryTable> {
  public id = this.serial('id').primaryKey();

  public name = this.varchar('name').notNull();

  public translate = this.jsonb<Translate>('translate').notNull();

  public tableName(): string {
    return 'category';
  }
}

export type CategoryType = ExtractModel<CategoryTable>;
