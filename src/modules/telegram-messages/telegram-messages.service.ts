import { arrayValuesToType } from '@custom-types/array-values.type';
import { DBConnection } from '@db/db';
import { ETelegramMessageType, TelegramMessagesType } from '@db/tables';
import { DB } from 'drizzle-orm';
import { ITelegramMessageInput } from './interface';
import TelegramMessageQueryService from './telegram-messages.query.service';
import { TelegramMessageValidate } from './telegram-messages.validator';

export default class TelegramMessageService extends DBConnection {
  #telegramMessageQueryService: TelegramMessageQueryService;
  #telegramMessageValidator: TelegramMessageValidate;

  constructor(db: DB) {
    super(db);
    this.#telegramMessageQueryService = new TelegramMessageQueryService(db);
    this.#telegramMessageValidator = new TelegramMessageValidate();
  }

  public save = (
    telegramInfo: ITelegramMessageInput
  ): Promise<TelegramMessagesType | undefined> => {
    this.#telegramMessageValidator.save(telegramInfo);

    return this.#telegramMessageQueryService.save(telegramInfo);
  };

  public getByTgInfo = (
    userId: string,
    chatId: string
  ): Promise<TelegramMessagesType | undefined> =>
    this.#telegramMessageQueryService.getByTgInfo(userId, chatId);

  public getByTgInfoWithOperationType = (
    userId: string,
    chatId: string,
    operationType: arrayValuesToType<typeof ETelegramMessageType.values>
  ): Promise<TelegramMessagesType | undefined> =>
    this.#telegramMessageQueryService.getByTgInfoWithOperationType(
      userId,
      chatId,
      operationType
    );

  public deleteByTgInfo = (
    userId: string,
    messageId: string,
    chatId: string,
    operationType: arrayValuesToType<typeof ETelegramMessageType.values>
  ): Promise<void> =>
    this.#telegramMessageQueryService.deleteByTgInfo(
      userId,
      messageId,
      chatId,
      operationType
    );
}
