import { AbstractTable, ExtractModel } from 'drizzle-orm';

export default class EmpoymentOptionsTable extends AbstractTable<EmpoymentOptionsTable> {
  public id = this.serial('id').primaryKey();

  public name = this.varchar('name').notNull();

  public translate = this.jsonb('translate').notNull();

  public tableName(): string {
    return 'employment_options';
  }
}

export type EmpoymentOptionsType = ExtractModel<EmpoymentOptionsTable>;
