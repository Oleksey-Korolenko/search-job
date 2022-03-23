import { AbstractTable, ExtractModel } from 'drizzle-orm';
import { createEnum } from 'drizzle-orm/types/type';
import TemporaryUserTable from './temporary-user';

export const ETelegramMessageType = createEnum({
  alias: 'telegram_message_type',
  values: ['phone', 'salary', 'name', 'position', 'company', 'details']
});

export default class TelegramMessagesTable extends AbstractTable<TelegramMessagesTable> {
  public messageId = this.varchar('message_id').notNull();

  public chatId = this.varchar('chat_id').notNull();

  public userId = this.varchar('user_id').notNull();

  public temporaryUserId = this.int('temporary_user_id')
    .foreignKey(TemporaryUserTable, table => table.id)
    .notNull();

  public telegramMessageType = this.type(
    ETelegramMessageType,
    'telegram_message_type'
  ).notNull();

  public tableName(): string {
    return 'telegram_messages';
  }
}

export type TelegramMessagesType = ExtractModel<TelegramMessagesTable>;
