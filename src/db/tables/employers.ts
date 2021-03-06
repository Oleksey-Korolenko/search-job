import { AbstractTable, ExtractModel } from 'drizzle-orm';
import TelegramTable from './telegram';

export default class EmployerTable extends AbstractTable<EmployerTable> {
  public id = this.serial('id').primaryKey();

  public name = this.varchar('name').notNull();

  public position = this.varchar('position').notNull();

  public company = this.varchar('company').notNull();

  public phone = this.varchar('phone').notNull();

  public telegramUserId = this.int('telegram_user_id')
    .foreignKey(TelegramTable, table => table.id)
    .notNull();

  public tableName(): string {
    return 'employers';
  }
}

export type EmployerType = ExtractModel<EmployerTable>;
