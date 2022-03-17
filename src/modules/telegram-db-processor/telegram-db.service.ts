import { DBConnection } from '@db/db';
import { TelegramType } from '@db/tables';
import { languageTypes } from '@modules/telegram/messages';
import { DB } from 'drizzle-orm';
import { ITelegramDBInput } from './interface';
import TelegramDBQueryService from './telegram-db.query.service';
import { TelegramDBValidate } from './telegram-db.validator';

export default class TelegramDBProcessorService extends DBConnection {
  #telegramDBQueryService: TelegramDBQueryService;
  #telegramValidator: TelegramDBValidate;

  constructor(db: DB) {
    super(db);
    this.#telegramDBQueryService = new TelegramDBQueryService(db);
    this.#telegramValidator = new TelegramDBValidate();
  }

  public save = (
    telegramInfo: ITelegramDBInput
  ): Promise<TelegramType | undefined> => {
    this.#telegramValidator.save(telegramInfo);

    return this.#telegramDBQueryService.save(telegramInfo);
  };

  public getById = (id: number): Promise<TelegramType | undefined> =>
    this.#telegramDBQueryService.getById(id);

  public getByUserId = (userId: string): Promise<TelegramType | undefined> =>
    this.#telegramDBQueryService.getByUserId(userId);

  public updateLanguage = (
    userId: string,
    language: languageTypes
  ): Promise<TelegramType | undefined> =>
    this.#telegramDBQueryService.updateLanguage(userId, language);
}
