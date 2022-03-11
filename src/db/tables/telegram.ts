import { AbstractTable, ExtractModel } from 'drizzle-orm';

export default class TelegramTable extends AbstractTable<TelegramTable> {
  public id = this.serial('id').primaryKey();

  public name = this.varchar('name').notNull();

  public tableName(): string {
    return 'telegram';
  }
}

export type TelegramType = ExtractModel<TelegramTable>;
