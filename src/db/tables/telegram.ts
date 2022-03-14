import { AbstractTable, ExtractModel } from 'drizzle-orm';
import { createEnum } from 'drizzle-orm/types/type';

export const ELanguageType = createEnum({
  alias: 'language_type',
  values: ['en', 'uk'],
});

export default class TelegramTable extends AbstractTable<TelegramTable> {
  public id = this.serial('id').primaryKey();

  public name = this.varchar('name').notNull();

  public language = this.type(ELanguageType, 'language_type');

  public tableName(): string {
    return 'telegram';
  }
}

export type TelegramType = ExtractModel<TelegramTable>;
