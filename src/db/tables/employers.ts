import { AbstractTable, ExtractModel } from 'drizzle-orm';

export default class EmployerTable extends AbstractTable<EmployerTable> {
  public id = this.serial('id').primaryKey();

  public name = this.varchar('name').notNull();

  public position = this.varchar('position').notNull();

  public company = this.varchar('company').notNull();

  public telegram = this.varchar('telegram').notNull();

  public phone = this.varchar('phone').notNull();

  public tableName(): string {
    return 'employers';
  }
}

export type EmployerType = ExtractModel<EmployerTable>;
