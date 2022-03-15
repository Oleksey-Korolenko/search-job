import { languageArray } from '@modules/telegram';
import { AbstractTable, ExtractModel } from 'drizzle-orm';
import { createEnum } from 'drizzle-orm/types/type';

export const ELanguageType = createEnum({
  alias: 'language_type',
  values: languageArray
});

export default class TelegramTable extends AbstractTable<TelegramTable> {
  public id = this.serial('id').primaryKey();

  public username = this.varchar('username').notNull();

  public userId = this.int('user_id').notNull();

  public language = this.type(ELanguageType, 'language_type').notNull();

  public tableName(): string {
    return 'telegram';
  }
}

export type TelegramType = ExtractModel<TelegramTable>;
