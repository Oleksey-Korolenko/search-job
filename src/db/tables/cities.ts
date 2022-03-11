import { AbstractTable, ExtractModel } from 'drizzle-orm';

export default class CityTable extends AbstractTable<CityTable> {
  public id = this.serial('id').primaryKey();

  public name = this.varchar('name').notNull();

  public translate = this.jsonb('translate').notNull();

  public tableName(): string {
    return 'city';
  }
}

export type CityType = ExtractModel<CityTable>;
