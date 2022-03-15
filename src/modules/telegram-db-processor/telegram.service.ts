import { DBConnection } from '@db/db';
import { TelegramType } from '@db/tables';
import { languageTypes } from '@modules/telegram/messages';
import { DB } from 'drizzle-orm';
import { ITelegramInput } from './interface';
import TelegramDBQueryService from './telegram.query.service';

export default class TelegramDBProcessorService extends DBConnection {
  #telegramDBQueryService: TelegramDBQueryService;

  constructor(db: DB) {
    super(db);
    this.#telegramDBQueryService = new TelegramDBQueryService(db);
  }

  public save = (
    telegramInfo: ITelegramInput
  ): Promise<TelegramType | undefined> =>
    this.#telegramDBQueryService.save(telegramInfo);

  public getById = (id: number): Promise<TelegramType | undefined> =>
    this.#telegramDBQueryService.getById(id);

  public getByUserId = (userId: number): Promise<TelegramType | undefined> =>
    this.#telegramDBQueryService.getByUserId(userId);

  public updateLanguage = (
    userId: number,
    language: languageTypes
  ): Promise<TelegramType | undefined> =>
    this.#telegramDBQueryService.updateLanguage(userId, language);
}
