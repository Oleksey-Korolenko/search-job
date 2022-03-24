import { arrayValuesToType } from '@custom-types/array-values.type';
import { DBConnection } from '@db/db';
import TelegramMessagesTable, {
  TelegramMessagesType,
  ETelegramMessageType
} from '@db/tables/telegram-messages';
import { and, DB, eq } from 'drizzle-orm';
import Order from 'drizzle-orm/builders/highLvlBuilders/order';
import { ITelegramMessageInput } from './interface';

export default class TelegramMessageQueryService extends DBConnection {
  #telegramMessage: TelegramMessagesTable;

  constructor(db: DB) {
    super(db);
    this.#telegramMessage = new TelegramMessagesTable(this.db);
  }

  public save = (
    telegramMessageInfo: ITelegramMessageInput
  ): Promise<TelegramMessagesType | undefined> =>
    this.#telegramMessage
      .insert(telegramMessageInfo)
      .all()
      .then(res => res[0] as TelegramMessagesType | undefined);

  public getByTgInfo = (userId: string, chatId: string) =>
    this.#telegramMessage
      .select()
      .where(
        and([
          eq(this.#telegramMessage.userId, userId),
          eq(this.#telegramMessage.chatId, chatId)
        ])
      )
      .orderBy(table => table.messageId, Order.DESC)
      .all()
      .then(res => res[0] as TelegramMessagesType | undefined);

  public getByTgInfoWithOperationType = (
    userId: string,
    chatId: string,
    operationType: arrayValuesToType<typeof ETelegramMessageType.values>
  ) =>
    this.#telegramMessage
      .select()
      .where(
        and([
          eq(this.#telegramMessage.userId, userId),
          eq(this.#telegramMessage.chatId, chatId),
          eq(this.#telegramMessage.telegramMessageType, operationType)
        ])
      )
      .orderBy(table => table.messageId, Order.DESC)
      .all()
      .then(res => res[0] as TelegramMessagesType | undefined);

  public deleteByTgInfo = (
    userId: string,
    messageId: string,
    chatId: string,
    operationType: arrayValuesToType<typeof ETelegramMessageType.values>
  ) =>
    this.#telegramMessage
      .delete()
      .where(
        and([
          eq(this.#telegramMessage.userId, userId),
          eq(this.#telegramMessage.chatId, chatId),
          eq(this.#telegramMessage.messageId, messageId),
          eq(this.#telegramMessage.telegramMessageType, operationType)
        ])
      )
      .all()
      .then(res => res[0] as TelegramMessagesType | undefined);
}
